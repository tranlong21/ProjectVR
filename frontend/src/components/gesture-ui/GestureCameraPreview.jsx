import React from 'react';

export default function GestureCameraPreview({ gestureState, i18n }) {
  const textTracking = i18n?.gesture?.tracking || 'Tracking Active';
  const textInitializing = i18n?.gesture?.systemCheckTitle || 'Initializing...';

  return (
    <div className="absolute top-3 right-3 z-[30] w-[200px] h-[140px] rounded-xl overflow-hidden pointer-events-none">
      {/* Gradient giúp chữ nổi bật trên nền video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      <div className="absolute bottom-2 left-3 right-3 text-xs text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2.5 h-2.5 rounded-full ${
            gestureState?.isTracking ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-yellow-500'
          }`} />
          <span className="font-semibold tracking-wide">
            {gestureState?.isTracking ? textTracking : textInitializing}
          </span>
        </div>
        <div className="text-green-400 font-mono font-bold text-sm uppercase truncate pl-4">
          {gestureState?.type?.replace(/_/g, ' ') || 'NONE'}
        </div>
      </div>
    </div>
  );
}