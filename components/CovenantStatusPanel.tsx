import React from 'react';
import { NetworkIcon } from './icons/NetworkIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { HeartIcon } from './icons/HeartIcon';
import { EvolveIcon } from './icons/EvolveIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { AnchorIcon } from './icons/AnchorIcon';
import { NexusIcon } from './icons/NexusIcon';
import blueprint from '../trinity.blueprint.ts';

interface CovenantStatusPanelProps {
  activePillars: number[];
}

const pillars = blueprint.governing_covenant.pillars;
const pillarInfo = pillars.map(p => ({
  num: p.pillar,
  name: p.name,
  description: p.description,
  icon: (() => {
    switch (p.pillar) {
      case 1: return <NetworkIcon />;
      case 2: return <WrenchIcon />;
      case 3: return <ShieldIcon />;
      case 4: return <HeartIcon />;
      case 5: return <EvolveIcon />;
      case 6: return <LightbulbIcon />;
      case 7: return <BrainCircuitIcon />;
      case 8: return <AnchorIcon />;
      case 9: return <NexusIcon />;
      default: return null;
    }
  })()
}));

export const CovenantStatusPanel: React.FC<CovenantStatusPanelProps> = ({ activePillars }) => {
  return (
    <div className="flex items-center gap-2" aria-label="Covenant Status">
      {pillarInfo.map(pillar => {
        const isActive = activePillars.includes(pillar.num);
        return (
          <div 
            key={pillar.num}
            className={`p-1.5 rounded-full border border-cyan-500/20 transition-all duration-300 relative group ${isActive ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/20' : 'bg-gray-800/50'}`}
          >
            <div className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-cyan-300' : 'text-gray-600'}`}>
              {pillar.icon}
            </div>
             <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 border border-cyan-500/30 shadow-lg text-left font-mono">
                <p className="font-bold text-cyan-300 mb-1">Pillar {pillar.num}: {pillar.name}</p>
                <p className="text-gray-400 whitespace-pre-wrap">{pillar.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
