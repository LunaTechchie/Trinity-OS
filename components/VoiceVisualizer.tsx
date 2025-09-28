
import React, { useRef, useEffect } from 'react';

interface VoiceVisualizerProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ analyserNode, isActive }) => {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    if (!analyserNode || !isActive) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      orb.style.transform = 'scale(1)';
      return;
    }

    let isDrawing = true;
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isDrawing) return;
      animationFrameId.current = requestAnimationFrame(draw);

      analyserNode.getByteTimeDomainData(dataArray);

      let sumSquares = 0.0;
      for (const amplitude of dataArray) {
        const val = (amplitude / 128.0) - 1.0; // Normalize to -1 to 1
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length);
      const scale = 1 + rms * 3; // Amplify the effect for better visibility

      orb.style.transform = `scale(${scale})`;
    };
    
    isDrawing = true;
    draw();

    return () => {
      isDrawing = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [analyserNode, isActive]);

  return (
    <div 
        className="w-[100px] h-[100px] flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0 }}
    >
       <div 
        ref={orbRef}
        className="w-12 h-12 bg-cyan-500 rounded-full transition-transform duration-100"
        style={{
            boxShadow: '0 0 20px #06b6d4, 0 0 40px #0ea5e9',
        }}
       />
    </div>
  );
};
