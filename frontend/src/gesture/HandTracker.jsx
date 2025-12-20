// --- FILE: src/gesture/HandTracker.js ---
import React, { useEffect, useRef } from 'react';
import * as handsPkg from '@mediapipe/hands';
import { analyzeGestures } from './GestureAnalyzer';
import { GestureType } from './GestureType';

const HandTracker = ({ onGestureUpdate, isActive }) => {
  const videoRef = useRef(null);
  const requestRef = useRef(null);
  const streamRef = useRef(null);
  const processingRef = useRef(false);

  // 🔑 Analyzer state – single source
  const lastStateRef = useRef({
    type: GestureType.NONE,
    x: 0.5,
    y: 0.5,
    zoomFactor: 1.0,
    isTracking: false,

    // Internal smoothing buffers
    _smoothX: 0.5,
    _smoothY: 0.5,
    _targetZoom: 1.0,
    _pendingType: GestureType.NONE,
    _pendingCount: 0,
  });

  useEffect(() => {
    if (!isActive) {
      lastStateRef.current = {
        type: GestureType.NONE,
        x: 0.5,
        y: 0.5,
        zoomFactor: 1.0,
        isTracking: false,

        // Internal smoothing buffers
        _smoothX: 0.5,
        _smoothY: 0.5,
        _targetZoom: 1.0,
        _pendingType: GestureType.NONE,
        _pendingCount: 0,
      };
      return;
    }

    let hands = null;
    let mounted = true;

    const init = async () => {
      const HandsClass =
        handsPkg.Hands || handsPkg.default?.Hands || handsPkg.default;

      hands = new HandsClass({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults((results) => {
        if (!mounted) return;

        // ✅ ANALYZE ONCE – LIKE THEM
        const nextState = analyzeGestures(results, lastStateRef.current);
        lastStateRef.current = nextState;
        onGestureUpdate?.(nextState);
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (!mounted) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const loop = async () => {
        if (
          !mounted ||
          !videoRef.current ||
          !hands ||
          videoRef.current.readyState < 2 ||
          processingRef.current
        ) {
          requestRef.current = requestAnimationFrame(loop);
          return;
        }

        processingRef.current = true;
        await hands.send({ image: videoRef.current });
        processingRef.current = false;

        requestRef.current = requestAnimationFrame(loop);
      };

      loop();
    };

    init();

    return () => {
      mounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach(t => t.stop());
      if (hands) hands.close();
    };
  }, [isActive, onGestureUpdate]);

  if (!isActive) return null;

  return (
    <video
      ref={videoRef}
      className="absolute top-3 right-3 w-[200px] h-[140px] rounded-xl object-cover scale-x-[-1] z-[29]"
      playsInline
      muted
    />
  );
};

export default HandTracker;
