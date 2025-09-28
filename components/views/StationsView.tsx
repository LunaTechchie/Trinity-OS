
import React from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { WebIcon } from '../icons/WebIcon';
import { WrenchIcon } from '../icons/WrenchIcon';
import { UserIcon } from '../icons/UserIcon';
import { BrainCircuitIcon } from '../icons/BrainCircuitIcon';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import { LayersIcon } from '../icons/LayersIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'Perception & Unified Awareness': <WebIcon />,
    'Subconscious Resonance (System 1 - Fast Thinking)': <BrainCircuitIcon />,
    'Conscious Apperception & Ethical Check': <UserIcon />,
    'Deliberate Orchestration & PRL Application (System 2 - Slow Thinking)': <LayersIcon />,
    "Final Decision & Action": <WrenchIcon />,
    'Symbiotic Interface & Potential for Manifestation': <LightbulbIcon />,
};

export const StationsView: React.FC = () => {
  const operational_stations = blueprint.unified_cognitive_workflow.steps;

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-6">&gt; UNIFIED OPERATIONAL WORKFLOW</h3>
      <p className="text-xs text-gray-400 italic mb-6 leading-relaxed">
          {blueprint.unified_cognitive_workflow.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operational_stations.map((station) => (
          <div key={station.step_number} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-cyan-400">
                {iconMap[station.phase_name] || <LayersIcon />}
              </div>
              <h4 className="font-bold text-cyan-300 text-xs tracking-wider uppercase truncate">{station.phase_name}</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed flex-grow">{station.process_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
