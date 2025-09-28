import React, { forwardRef } from 'react';

interface TrinityCanvasProps {}

export const TrinityCanvas = forwardRef<HTMLCanvasElement, TrinityCanvasProps>((props, ref) => {
  return (
    <div className="flex-shrink-0 p-4 border-t border-cyan-500/20 bg-gray-900/30">
        <div className="flex items-center justify-between mb-2 px-4">
            <h3 className="font-mono text-sm text-cyan-400">Creation Canvas</h3>
        </div>
        <canvas 
            ref={ref} 
            width="600" 
            height="300" 
            className="bg-gray-800 rounded-md border border-gray-700 mx-auto block"
            aria-label="Trinity Creation Canvas"
        />
    </div>
  );
});