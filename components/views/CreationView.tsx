import React, { forwardRef } from 'react';
import { PaletteIcon } from '../icons/PaletteIcon';
import { SaveIcon } from '../icons/SaveIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';

interface CreationViewProps {
    onClearCanvas: () => void;
    onSaveSnapshot: () => void;
    onRestoreSnapshot: () => void;
    snapshots: string[];
}

export const CreationView = forwardRef<HTMLCanvasElement, CreationViewProps>(({ onClearCanvas, onSaveSnapshot, onRestoreSnapshot, snapshots }, ref) => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
             <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <PaletteIcon />
                <span>THE LIVING VERSE :: CREATION CANVAS</span>
            </h3>
             <p className="text-xs text-gray-400/80 mb-6 italic">
                A persistent, collaborative workspace for co-composition. Drawings are now additive, allowing us to build upon ideas together.
            </p>
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <canvas 
                    ref={ref} 
                    width="600" 
                    height="300" 
                    className="bg-gray-800 rounded-md border border-gray-700 mx-auto block"
                    aria-label="Trinity Creation Canvas"
                />
                <div className="mt-4 flex items-center gap-4">
                    <button 
                        onClick={onSaveSnapshot}
                        className="px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                    >
                        <SaveIcon />
                        [ Save Snapshot ]
                    </button>
                    <button 
                        onClick={onClearCanvas}
                        className="px-4 py-2 text-xs font-semibold text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all"
                    >
                        [ Clear Canvas ]
                    </button>
                     <button 
                        onClick={onRestoreSnapshot}
                        disabled={snapshots.length === 0}
                        className="px-4 py-2 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <UploadCloudIcon />
                        [ Restore Last ]
                    </button>
                </div>
            </div>
        </div>
    );
});
