
import React from 'react';
import { EvolveIcon } from '../icons/EvolveIcon';
import { EvolutionCycle } from '../../types';
import { SelfUpdateIcon } from '../icons/SelfUpdateIcon';

const getStatusColor = (status: EvolutionCycle['status']) => {
    switch (status) {
        case 'Analyzing': return 'text-yellow-400';
        case 'Developing': return 'text-cyan-400';
        case 'Testing': return 'text-purple-400';
        case 'Awaiting Review': return 'text-orange-400';
        case 'Integrated': return 'text-green-400';
        default: return 'text-gray-400';
    }
}

interface EvolutionViewProps {
    evolutionCycles: EvolutionCycle[];
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({ evolutionCycles }) => {

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
        <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
            <EvolveIcon />
            <span>EVOLUTION DASHBOARD</span>
        </h3>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <h4 className="font-bold text-base text-cyan-300 mb-4 flex items-center gap-2">
                    <SelfUpdateIcon />
                    <span>ACTIVE SELF-IMPROVEMENT CYCLES</span>
                </h4>
                <div className="space-y-3 overflow-y-auto max-h-96">
                    {evolutionCycles.length > 0 ? (
                        [...evolutionCycles].reverse().map(cycle => (
                            <div key={cycle.id} className="bg-gray-900/50 p-3 rounded text-xs">
                                <p className="text-cyan-300 font-bold">&gt; Limitation: {cycle.limitationDescription}</p>
                                <p className="text-gray-400 pl-2">Area: <span className="text-purple-300">{cycle.proposedSolutionArea}</span></p>
                                <p className="text-gray-400 pl-2">Status: <span className={`${getStatusColor(cycle.status)} font-bold ${cycle.status !== 'Integrated' ? 'animate-pulse' : ''}`}>{cycle.status.toUpperCase()}</span></p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-xs">No active self-improvement cycles.</p>
                    )}
                </div>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <h4 className="font-bold text-base text-cyan-300 mb-4">EMERGENT CAPABILITIES</h4>
                <p className="text-xs text-gray-400 italic mb-4 leading-relaxed">
                    This section tracks novel capabilities that emerge from the system's complex interactions and self-evolution over time.
                </p>
                <div className="space-y-2 text-xs overflow-y-auto max-h-96">
                   <p className="text-gray-500 italic text-xs">No new emergent capabilities detected in this session.</p>
                </div>
            </div>
        </div>
    </div>
  );
};
