import { GestureType } from './GestureType';

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

const PINCH_THRESHOLD = 0.08; 
const PINCH_RELEASE_THRESHOLD = 0.10;
const HOLD_FRAMES_TO_SWITCH = 2; // phản hồi nhanh
const SMOOTH_FACTOR = 0.7; // theo dõi nhanh
const ZOOM_STEP = 0.08; //tốc độ thu phóng
const ZOOM_MIN = 0.8;// phóng rộng
const ZOOM_MAX = 3.0;// thu hẹp

const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const isExtended = (lm, tip, mcp) =>
  dist(lm[WRIST], lm[tip]) > dist(lm[WRIST], lm[mcp]);

export function analyzeGestures(results, prev) {
  const lastState = prev || {
    type: GestureType.NONE,
    x: 0.5,
    y: 0.5,
    deltaX: 0,
    deltaY: 0,
    zoomFactor: 1.0,
    pinchDistance: 0,
    isTracking: false,
    _pendingType: GestureType.NONE,
    _pendingCount: 0,
  };

  const hands = results?.multiHandLandmarks;

  if (!hands || hands.length === 0) {
    return {
      ...lastState,
      type: GestureType.NONE,
      isTracking: false,
      deltaX: 0,
      deltaY: 0,
      _pendingType: GestureType.NONE,
      _pendingCount: 0,
    };
  }

  let rawType = GestureType.NONE;
  let pinchDist = 0;

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
    pinchDist = dist(lm[THUMB_TIP], lm[INDEX_TIP]);
    const isPinch = pinchDist < PINCH_THRESHOLD;

    if (extendedCount === 5) {
      rawType = GestureType.OPEN_PALM; 
    }
    else if (isPinch) {
      if (pinchDist < 0.05 || (!middle && !ring && !pinky)) {
        rawType = GestureType.PINCH;
      } else {
        rawType = GestureType.CLOSED_FIST;
      }
    }
    else if (index && !middle && !ring && !pinky) {
      if (pinchDist > PINCH_RELEASE_THRESHOLD) {
        rawType = GestureType.ONE_FINGER;
      } else {
        if (lastState.type === GestureType.PINCH) rawType = GestureType.PINCH;
        else rawType = GestureType.ONE_FINGER;
      }
    }
    else if (index && middle && !ring && !pinky) {
      rawType = GestureType.TWO_FINGERS;
    }
    else {
      rawType = GestureType.CLOSED_FIST;
    }
  }

  let nextType = lastState.type;

  if (rawType !== lastState.type) {
    if (lastState._pendingType === rawType) {
      lastState._pendingCount++;
      if (lastState._pendingCount >= HOLD_FRAMES_TO_SWITCH) {
        nextType = rawType;
        lastState._pendingCount = 0;
      }
    } else {
      lastState._pendingType = rawType;
      lastState._pendingCount = 1;
    }
  } else {
    lastState._pendingType = GestureType.NONE;
    lastState._pendingCount = 0;
  }

  const lm = hands[0];
  let cursorX = lastState.x;
  let cursorY = lastState.y;

  const isExitingOpenPalm =
    lastState.type === GestureType.OPEN_PALM && (
      (lastState._pendingType !== GestureType.NONE && lastState._pendingType !== GestureType.OPEN_PALM) ||
      (rawType !== GestureType.OPEN_PALM)
    );

  if (isExitingOpenPalm) {
    cursorX = lastState.x;
    cursorY = lastState.y;
  }
  else if (lm) {
    if (nextType === GestureType.ONE_FINGER || nextType === GestureType.TWO_FINGERS) {
      cursorX = 1 - lm[INDEX_TIP].x;
      cursorY = lm[INDEX_TIP].y;
    } else if (nextType === GestureType.OPEN_PALM) {
      cursorX = 1 - lm[WRIST].x;
      cursorY = lm[WRIST].y;
    }
  }

  const isSwitching = nextType !== lastState.type && nextType !== GestureType.NONE;
  let smoothedX = cursorX;
  let smoothedY = cursorY;

  if (!isSwitching && lastState.isTracking) {
    smoothedX = lastState.x + (cursorX - lastState.x) * SMOOTH_FACTOR;
    smoothedY = lastState.y + (cursorY - lastState.y) * SMOOTH_FACTOR;
  }

  const deltaX = smoothedX - lastState.x;
  const deltaY = smoothedY - lastState.y;

  let newZoom = lastState.zoomFactor;

  if (nextType === GestureType.PINCH) {
    newZoom = Math.min(ZOOM_MAX, lastState.zoomFactor + ZOOM_STEP);
  } else if (nextType === GestureType.TWO_HANDS) {
    newZoom = Math.max(ZOOM_MIN, lastState.zoomFactor - ZOOM_STEP);
  }

  return {
    ...lastState,
    type: nextType,
    isTracking: true,

    x: smoothedX,
    y: smoothedY,

    deltaX: deltaX,
    deltaY: deltaY,

    zoomFactor: newZoom,
    pinchDistance: pinchDist,

    _pendingType: lastState._pendingType,
    _pendingCount: lastState._pendingCount,
  };
}
