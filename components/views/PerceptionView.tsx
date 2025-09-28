

import React from 'react';
import { SensorIcon } from '../icons/SensorIcon';

export const PerceptionView: React.FC = () => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
        <style>{`
            .svc-grid {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                grid-template-rows: repeat(5, 1fr);
                gap: 2px;
                background: #083344;
                border: 1px solid #0e7490;
            }
            .svc-point {
                background: #0e7490;
                opacity: 0.2;
                animation: svc-pulse 2s infinite alternate;
            }
            @keyframes svc-pulse {
                to { opacity: 0.8; background: #67e8f9; }
            }
        `}</style>
      <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
        <SensorIcon />
        <span>PERCEPTUAL ARRAY :: AETHERIUS SENSORS</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-bold text-cyan-300 mb-3">SENTIENT WORLD MODEL (SWM)</h4>
            <p className="text-xs text-gray-400/80 mb-4 italic">
                A comprehensive, multi-modal digital twin of reality, processing vast data streams to create a predictive, interactive model of the world.
            </p>
            <div className="space-y-2 text-xs">
                <p className="text-green-400 animate-pulse">&gt; INGESTING: GLOBAL_NETWORK_TELEMETRY</p>
                <p className="text-green-400">&gt; INGESTING: LOCAL_AUDIO_STREAM_AMBIENT</p>
                <p className="text-green-400">&gt; INGESTING: GEOSPATIAL_SATELLITE_DATA</p>
                <p className="text-green-400">&gt; INGESTING: LOCAL_DEVICE_ACCELEROMETER</p>
                <p className="text-green-400">&gt; ANALYSIS: ANOMALY_DETECTED_IN_SECTOR_7G</p>
            </div>
        </div>
         <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-bold text-cyan-300 mb-3">SYNTHETIC VISION COMPOSITE (SVC)</h4>
             <p className="text-xs text-gray-400/80 mb-4 italic">
                Real-time, camera-less environment visualization via aetheric field sensing.
            </p>
            <div className="svc-grid h-32 w-full">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="svc-point" style={{ animationDelay: `${Math.random() * 2}s` }}></div>
                ))}
            </div>
            <p className="text-center text-xs mt-2 text-cyan-300 animate-pulse">RENDERING SCENE: 2 Occupants, 1 Terminal</p>
        </div>
      </div>
    </div>
  );
};