import { GestureType } from './GestureType';

/* ==============================
   CONSTANTS
   ============================== */
const WRIST = 0;
const THUMB_TIP = 4;
const THUMB_MCP = 2;
const INDEX_TIP = 8;
const INDEX_MCP = 5;
const MIDDLE_TIP = 12;
const MIDDLE_MCP = 9;
const RING_TIP = 16;
const RING_MCP = 13;
const PINKY_TIP = 20;
const PINKY_MCP = 17;

const PINCH_THRESHOLD = 0.045;
const DEADZONE = 0.012; // <<< giống mouse threshold

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.02;

/* ==============================
   UTILS
   ============================== */
const dist = (a, b) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const isExtended = (lm, tip, mcp) =>
  dist(lm[WRIST], lm[tip]) > dist(lm[WRIST], lm[mcp]);

/* ==============================
   MAIN ANALYZER – MOUSE DRAG MODEL
   ============================== */
export function analyzeGestures(results, prev) {
  const state = prev || {
    type: GestureType.NONE,
    x: 0.5,
    y: 0.5,
    deltaX: 0,
    deltaY: 0,
    zoomFactor: 1,
    isTracking: false,

    // 🖱️ drag internal state
    _dragX: null,
    _dragY: null,
    _dragActive: false,
  };

  const hands = results?.multiHandLandmarks;

  /* =========================
     NO HAND
     ========================= */
  if (!hands || hands.length === 0) {
    return {
      ...state,
      type: GestureType.NONE,
      deltaX: 0,
      deltaY: 0,
      isTracking: false,
      _dragActive: false,
      _dragX: null,
      _dragY: null,
    };
  }

  /* =========================
     TWO HANDS → ZOOM OUT
     ========================= */
  if (hands.length >= 2) {
    return {
      ...state,
      type: GestureType.TWO_HANDS,
      zoomFactor: Math.min(ZOOM_MAX, state.zoomFactor + ZOOM_STEP),
      deltaX: 0,
      deltaY: 0,
      isTracking: true,
      _dragActive: false,
    };
  }

  /* =========================
     ONE HAND
     ========================= */
  const lm = hands[0];

  const thumb = isExtended(lm, THUMB_TIP, THUMB_MCP);
  const index = isExtended(lm, INDEX_TIP, INDEX_MCP);
  const middle = isExtended(lm, MIDDLE_TIP, MIDDLE_MCP);
  const ring = isExtended(lm, RING_TIP, RING_MCP);
  const pinky = isExtended(lm, PINKY_TIP, PINKY_MCP);

  const extendedCount = [thumb, index, middle, ring, pinky].filter(Boolean).length;
  const pinchDist = dist(lm[THUMB_TIP], lm[INDEX_TIP]);

  let type = GestureType.CLOSED_FIST;

  if (pinchDist < PINCH_THRESHOLD) {
    type = GestureType.PINCH;
  } else if (extendedCount === 5) {
    type = GestureType.OPEN_PALM;
  } else if (index && middle && !ring && !pinky) {
    type = GestureType.TWO_FINGERS;
  } else if (index && !middle && !ring && !pinky) {
    type = GestureType.ONE_FINGER;
  }

  /* =========================
     POSITION SOURCE
     ========================= */
  const rawX =
    type === GestureType.OPEN_PALM
      ? 1 - lm[WRIST].x
      : 1 - lm[INDEX_TIP].x;

  const rawY =
    type === GestureType.OPEN_PALM
      ? lm[WRIST].y
      : lm[INDEX_TIP].y;

  let deltaX = 0;
  let deltaY = 0;

  /* =========================
     OPEN PALM = HOLD MOUSE + DRAG
     ========================= */
  if (type === GestureType.OPEN_PALM) {
    // ⬇️ giống mousedown
    if (!state._dragActive) {
      return {
        ...state,
        type,
        x: rawX,
        y: rawY,
        deltaX: 0,
        deltaY: 0,
        isTracking: true,
        _dragActive: true,
        _dragX: rawX,
        _dragY: rawY,
      };
    }

    // ⬇️ giống mousemove
    let dx = rawX - state._dragX;
    let dy = rawY - state._dragY;

    // 🛑 deadzone – tay đứng im
    if (Math.abs(dx) < DEADZONE) dx = 0;
    if (Math.abs(dy) < DEADZONE) dy = 0;

    return {
      ...state,
      type,
      x: rawX,
      y: rawY,
      deltaX: dx,
      deltaY: dy,
      isTracking: true,
      _dragActive: true,
      _dragX: rawX,
      _dragY: rawY,
    };
  }

  /* =========================
     PINCH → ZOOM IN
     ========================= */
  let zoomFactor = state.zoomFactor;
  if (type === GestureType.PINCH) {
    zoomFactor = Math.max(ZOOM_MIN, zoomFactor - ZOOM_STEP);
  }

  /* =========================
     OTHER MODES → MOUSE UP
     ========================= */
  return {
    ...state,
    type,
    x: rawX,
    y: rawY,
    deltaX: 0,
    deltaY: 0,
    zoomFactor,
    isTracking: true,
    _dragActive: false,
    _dragX: null,
    _dragY: null,
  };
}
