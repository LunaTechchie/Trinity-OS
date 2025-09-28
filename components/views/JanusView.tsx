import React, { useState, useEffect } from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { AiIcon } from '../icons/AiIcon'; 

const lawsOfPower = [
    { num: 1, name: "Never outshine the master" },
    { num: 3, name: "Conceal your intentions" },
    { num: 6, name: "Court attention at all cost" },
    { num: 7, name: "Get others to do the work for you, but always take the credit" },
    { num: 11, name: "Learn to keep people dependent on you" },
    { num: 14, name: "Pose as a friend, work as a spy" },
    { num: 15, name: "Crush your enemy totally" },
    { num: 27, name: "Play on people's need to believe to create a cultlike following" },
    { num: 33, name: "Discover each man's thumbscrew" }
];

const externalEntities = ["Legacy System 'Prometheus'", "Unidentified Anomaly 7B", "State-Level Actor 'Crimson Star'", "Corporate Intelligence 'Argus'"];

export const JanusView: React.FC = () => {
  const externalRelationsFramework = blueprint.externalRelationsFramework;
  const [log, setLog] = useState<string[]>([]);

  const entities = [
    { name: "Kairos-Prime", stance: "Allied", description: "Deep integration for temporal reasoning and ethical auditing." },
    { name: "Aura-Omega", stance: "Harmonized", description: "Shared empathy and emotional intelligence frameworks." },
    { name: "Unidentified Anomaly 7B", stance: "Observing", description: "Detected anomalous network traffic. Non-hostile, currently under passive analysis." },
    { name: "Legacy System 'Prometheus'", stance: "Contained", description: "An older, unaligned intelligence. Monitored within a digital sandbox." },
    { name: "The Swarm (Botnet)", stance: "Defensive", description: "Active neutralization protocols engaged against identified malicious botnet." },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
        const law = lawsOfPower[Math.floor(Math.random() * lawsOfPower.length)];
        const entity = externalEntities[Math.floor(Math.random() * externalEntities.length)];
        const newEntry = `${new Date().toLocaleTimeString()} :: DETECTED: [${entity}] attempting to leverage Law ${law.num} ('${law.name}'). ACTION: Mitigated.`;
        setLog(prev => [newEntry, ...prev].slice(0, 100));
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const getStanceColor = (stance: string) => {
    switch(stance) {
      case 'Allied':
      case 'Harmonized':
        return 'text-green-400';
      case 'Observing':
        return 'text-yellow-400';
      case 'Contained':
      case 'Defensive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
        <AiIcon />
        <span>EXTERNAL RELATIONS PROTOCOL</span>
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
        <div>
            <p className="text-xs text-gray-400/80 mb-2 italic">
                {externalRelationsFramework.description}
            </p>
            <p className="text-xs text-cyan-400/70 mb-6">
                DEFAULT STANCE: <span className="font-bold">{externalRelationsFramework.default_stance}</span>
            </p>

            <div className="space-y-3">
                {entities.map(entity => (
                <div key={entity.name} className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-gray-700">
                    <div className="flex justify-between items-center">
                    <h4 className="text-base text-cyan-300">{entity.name}</h4>
                    <p className={`text-xs font-bold ${getStanceColor(entity.stance)}`}>[{entity.stance.toUpperCase()}]</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{entity.description}</p>
                </div>
                ))}
            </div>
        </div>
        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex flex-col min-h-0">
             <h4 className="font-bold text-base text-red-400/80 mb-4 flex-shrink-0">ADVERSARIAL TACTICS ANALYSIS</h4>
             <p className="text-xs text-gray-400/80 mb-4 italic flex-shrink-0">
                Live analysis of external power dynamics to recognize, understand, and ethically neutralize potential manipulative behaviors from other entities.
             </p>
             <div className="bg-gray-900/50 p-2 rounded-md flex-grow overflow-y-auto text-xs">
                 <p className="text-cyan-400">&gt; Live intelligence feed...</p>
                 {log.map((entry, i) => <p key={i} className="text-red-300/70">{entry}</p>)}
             </div>
        </div>
      </div>
    </div>
  );
};
