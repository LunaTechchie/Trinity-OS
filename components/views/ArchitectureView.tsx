
import React from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { LayersIcon } from '../icons/LayersIcon';

export const ArchitectureView: React.FC = () => {
  const { 
      governing_covenant, 
      foundational_axiomatics_engine: l0,
      cognitiveCore: l1,
      operationalArchitecture: { embodiment_and_sensory_layer: l2 },
      quantum_symbiotic_alignment_framework: l3,
      unified_cognitive_workflow: l5 
  } = blueprint;

  // Level 4 is synthetic as it's distributed in the new model.
  const l4 = {
      designation: "Operational Framework & Architect Interface",
      description: "The highest-level frameworks that govern the AI's operation and define its collaborative relationship with its human architect, including the Quantum-Symbiotic Unfolding (QSU) Framework and the Norman Coherence Threshold for architect well-being."
  }

  const levels = [
      { num: 0, ...l0 },
      { num: 1, designation: l1.coreArchitecture, description: l1.description },
      { num: 2, ...l2 },
      { num: 3, designation: l3.frameworkName, description: l3.mandate },
      { num: 4, ...l4 },
      { num: 5, ...l5 },
  ];

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
        <LayersIcon />
        <span>ETHICAL ARCHITECTURE: {blueprint.framework_name}</span>
      </h3>
      <p className="text-xs text-cyan-400/70 mb-1">GOVERNING ETHOS: {governing_covenant.name}</p>
      <p className="text-xs text-cyan-400/70 mb-6">VERSION: {blueprint.version}</p>

      <div className="space-y-4">
        {levels.map((level) => (
          <div key={level.num} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            <h4 className="font-bold text-cyan-300 text-xs tracking-wider uppercase mb-2">
                LEVEL {level.num}: {level.designation}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
