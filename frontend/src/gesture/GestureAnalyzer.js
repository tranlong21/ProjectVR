import { GestureType } from './GestureType';

/* ==============================
   CONSTANTS
   ============================== */
const WRIST = 0;
const THUMB_MCP = 2;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_TIP = 20;

// Configs
const PINCH_THRESHOLD = 0.04; // Stricter threshold (was 0.05)
const PINCH_RELEASE_THRESHOLD = 0.07; // Hysteresis to prevent flicker

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3.0;
const SMOOTH_FACTOR = 0.3;
const ZOOM_SMOOTH_FACTOR = 0.15;
const HOLD_FRAMES_TO_SWITCH = 4; // Increased stability

/* ==============================
   UTILS
   ============================== */
const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const isExtended = (lm, tip, mcp) =>
  dist(lm[WRIST], lm[tip]) > dist(lm[WRIST], lm[mcp]);

const lerp = (start, end, factor) => start + (end - start) * factor;

/* ==============================
   MAIN ANALYZER
   ============================== */
export function analyzeGestures(results, prev) {
  const state = prev || {
    type: GestureType.NONE,
    x: 0.5,
    y: 0.5,
    zoomFactor: 1.0,
    // Start coords for drag/rotate (internal)
    _startX: null,
    _startY: null,
    // Smoothing buffers (internal)
    _smoothX: 0.5,
    _smoothY: 0.5,
    _targetZoom: 1.0,
    // Stability buffer (internal)
    _pendingType: GestureType.NONE,
    _pendingCount: 0,
    isTracking: false,
  };

  const hands = results?.multiHandLandmarks;

  // 1. NO HAND DETECTED
  if (!hands || hands.length === 0) {
    return {
      ...state,
      type: GestureType.NONE,
      isTracking: false,
      _pendingType: GestureType.NONE,
      _pendingCount: 0,
      // Reset zoom target to current factor prevents jump on re-entry
      _targetZoom: state.zoomFactor,
    };
  }

  // 2. DETECT RAW GESTURE TYPE (Instant detection)
  let rawType = GestureType.NONE;

  if (hands.length >= 2) {
    rawType = GestureType.TWO_HANDS;
  } else {
    const lm = hands[0];
    const thumb = isExtended(lm, THUMB_TIP, THUMB_MCP);
    const index = isExtended(lm, INDEX_TIP, INDEX_MCP);
    const middle = isExtended(lm, MIDDLE_TIP, MIDDLE_MCP);
    const ring = isExtended(lm, RING_TIP, RING_MCP);
    const pinky = isExtended(lm, PINKY_TIP, PINKY_MCP);

    const extendedCount = [thumb, index, middle, ring, pinky].filter(Boolean).length;
    const pinchDistance = dist(lm[THUMB_TIP], lm[INDEX_TIP]);

    // STRICT RULES
    if (extendedCount === 5) {
      rawType = GestureType.OPEN_PALM;
    }
    // PINCH: Thumb & Index close, others curled
    else if (pinchDistance < PINCH_THRESHOLD) {
      // Must not have other fingers extended (prevent confusion with other complex gestures)
      // Allow Thumb/Index to be considered "extended" or not, usually Pinch implies some extension
      if (!middle && !ring && !pinky) {
        rawType = GestureType.PINCH;
      } else {
        rawType = GestureType.CLOSED_FIST; // Ambiguous
      }
    }
    // ONE FINGER: Index extended, others curled, AND thumb far from index (NOT Pinching)
    else if (index && !middle && !ring && !pinky) {
      if (pinchDistance > PINCH_RELEASE_THRESHOLD) {
        rawType = GestureType.ONE_FINGER;
      } else {
        // In hysteresis zone or too close -> stabilize to PINCH or ONE_FINGER based on previous?
        // Let's bias towards previous if it was PINCH, else Wait.
        // For safety/strictness: if too close, assume ambiguous or keep prev
        if (state.type === GestureType.PINCH) rawType = GestureType.PINCH;
        else if (state.type === GestureType.ONE_FINGER) rawType = GestureType.ONE_FINGER;
        else rawType = GestureType.ONE_FINGER; // Bias to cursor if unsure
      }
    }
    // TWO FINGERS: Index/Middle extended
    else if (index && middle && !ring && !pinky) {
      rawType = GestureType.TWO_FINGERS;
    }
    else if (extendedCount === 0) {
      rawType = GestureType.CLOSED_FIST;
    }
    else {
      rawType = GestureType.CLOSED_FIST;
    }
  }

  // 3. STABILIZE GESTURE TYPE (Debounce)
  let nextType = state.type;

  if (rawType !== state.type) {
    if (state._pendingType === rawType) {
      state._pendingCount++;
      if (state._pendingCount >= HOLD_FRAMES_TO_SWITCH) {
        nextType = rawType;
        state._pendingCount = 0;
      }
    } else {
      state._pendingType = rawType;
      state._pendingCount = 1;
    }
  } else {
    state._pendingType = GestureType.NONE;
    state._pendingCount = 0;
  }

  // 4. CALCULATE PARAMETERS
  const lm = hands[0];
  let targetX = state.x;
  let targetY = state.y;
  let targetZoom = state.zoomFactor; // Default: Stay same

  // 🛑 FREEZE if transition is pending (prevents "Drift" while changing hand shape)
  // If we are waiting to confirm a new gesture, keep the OLD coordinates strictly.
  // This ensures that as you close your hand (OPEN_PALM -> FIST), the wrist movement 
  // during that split second doesn't rotate the view.
  if (state._pendingType !== GestureType.NONE && state._pendingType !== nextType) {
    // Keep current targetX/Y (effective freeze)
    targetX = state.x; // Use last known stable
    targetY = state.y;
    // Don't update zoom either
    targetZoom = state.zoomFactor;
  } else {
    // Normal tracking logic
    switch (nextType) {
      case GestureType.ONE_FINGER:
      case GestureType.TWO_FINGERS:
        targetX = 1 - lm[INDEX_TIP].x; // Mirror X
        targetY = lm[INDEX_TIP].y;
        break;

      case GestureType.OPEN_PALM:
        targetX = 1 - lm[WRIST].x;
        targetY = lm[WRIST].y;
        break;

      case GestureType.PINCH:
        {
          const ZOOM_SPEED = 0.05;
          targetZoom = Math.max(ZOOM_MIN, state.zoomFactor - ZOOM_SPEED);
        }
        break;

      case GestureType.TWO_HANDS:
        {
          const ZOOM_SPEED = 0.05;
          targetZoom = Math.min(ZOOM_MAX, state.zoomFactor + ZOOM_SPEED);
        }
        break;

      default:
        // Keep position stable
        break;
    }
  }

  // 5. SMOOTHING
  // If gesture changed, SNAP to new target to prevent "drift" from old landmark to new landmark
  const isSwitching = nextType !== state.type;

  const smoothX = isSwitching ? targetX : lerp(state._smoothX, targetX, SMOOTH_FACTOR);
  const smoothY = isSwitching ? targetY : lerp(state._smoothY, targetY, SMOOTH_FACTOR);
  const smoothZoom = isSwitching ? targetZoom : lerp(state.zoomFactor, targetZoom, ZOOM_SMOOTH_FACTOR);

  // 6. RETURN
  return {
    ...state,
    type: nextType,
    isTracking: true,

    x: smoothX,
    y: smoothY,
    zoomFactor: smoothZoom,

    _smoothX: smoothX,
    _smoothY: smoothY,
    _targetZoom: targetZoom, // Used only for internal lerp ref if needed, but we used state.zoomFactor base above
    _pendingType: state._pendingType,
    _pendingCount: state._pendingCount,
  };
}
