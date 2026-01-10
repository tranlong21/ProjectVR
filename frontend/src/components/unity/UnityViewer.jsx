import { useEffect } from 'react';

const UnityViewer = () => {
  useEffect(() => {
    console.log('🟢 Unity WebGL mounted');
    return () => {
      console.log('🔴 Unity WebGL unmounted');
    };
  }, []);

  return (
    <iframe
      src="/Unity/huce/index.html"
      className="w-full h-full"
      style={{ border: 'none' }}
      allow="fullscreen"
      loading="lazy"
      title="HUCE Unity WebGL"
    />
  );
};

export default UnityViewer;
