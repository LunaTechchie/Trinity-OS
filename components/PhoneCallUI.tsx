import React from 'react';
import { CallState } from '../types';
import { EndCallIcon } from './icons/EndCallIcon';
import { VoiceVisualizer } from './VoiceVisualizer';
import { TrinityOSLogo } from './icons/TrisynOSLogo';

interface PhoneCallUIProps {
  callState: CallState;
  onEndCall: () => void;
  analyserNode: AnalyserNode | null;
}

const getStatusText = (status: CallState['status']) => {
    switch(status) {
        case 'connecting': return 'Connecting...';
        case 'ringing': return 'Ringing...';
        case 'active': return 'Connected';
        case 'conference': return 'Conference Call';
        default: return '...';
    }
}

export const PhoneCallUI: React.FC<PhoneCallUIProps> = ({ callState, onEndCall, analyserNode }) => {
  if (!callState.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-white transition-opacity duration-300 p-4">
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-3 absolute top-4 left-4 sm:top-8 sm:left-8">
          <TrinityOSLogo />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-cyan-400 tracking-wider">Trinity</h1>
            <p className="text-xs text-cyan-400/60 font-mono">Live Call Interface</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-2">
                 <p className={`text-xl sm:text-2xl font-mono text-cyan-300 transition-opacity duration-500 ${callState.status === 'connecting' || callState.status === 'ringing' ? 'animate-pulse' : ''}`}>
                    {getStatusText(callState.status)}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-wider break-all">{callState.number}</h2>
            </div>
            
            <VoiceVisualizer analyserNode={analyserNode} isActive={true} />
        </div>

        <div className="absolute bottom-16 flex flex-col items-center gap-4">
            <button 
                onClick={onEndCall} 
                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg shadow-red-500/30"
                aria-label="End Call"
            >
                <EndCallIcon />
            </button>
            <p className="font-mono text-sm text-gray-400">End Call</p>
        </div>
    </div>
  );
};