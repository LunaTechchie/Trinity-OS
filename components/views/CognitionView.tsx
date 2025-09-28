
import React from 'react';
import { BrainCircuitIcon } from '../icons/BrainCircuitIcon';
import blueprint from '../../trinity.blueprint.ts';

interface CognitionViewProps {
  isLoading: boolean;
  currentPhase: number | null;
}

export const CognitionView: React.FC<CognitionViewProps> = ({ isLoading, currentPhase }) => {
  const workflow = blueprint.unified_cognitive_workflow;
  const stages = workflow.steps;

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
        <BrainCircuitIcon />
        <span>LIVE COGNITIVE FLOW: {workflow.designation}</span>
      </h3>
      <p className="text-xs text-gray-400/80 mb-6 italic">
        {workflow.description}
      </p>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isActive = isLoading && currentPhase !== null && currentPhase >= index;
          return (
            <div
              key={stage.step_number}
              className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${isActive ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10' : 'bg-gray-800/40 border-gray-700'}`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`font-bold uppercase tracking-wider ${isActive ? 'text-cyan-300' : 'text-gray-400'}`}>
                  Step {stage.step_number}: {stage.phase_name}
                </h4>
                {isLoading && currentPhase === index && (
                    <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                        <span>ACTIVE</span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    </div>
                )}
              </div>
              <p className={`mt-2 text-xs transition-colors ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                {stage.process_description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
