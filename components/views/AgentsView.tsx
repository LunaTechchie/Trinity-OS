
import React from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { CpuChipIcon } from '../icons/CpuChipIcon';

const getAgentName = (agent: any): string => typeof agent === 'string' ? agent : agent.name;

const getAgentDetails = (agent: any): string | null => {
    if (typeof agent === 'string') return null;
    return agent.specialized_framework || agent.operational_protocol || agent.governing_protocol || null;
}


export const AgentsView: React.FC = () => {
  const { subconscious_orchestra } = blueprint.cognitiveCore;
  const hub = subconscious_orchestra.network_architecture.hub;
  const agents = subconscious_orchestra.network_architecture.spokes.agents;
  const spokesDescription = subconscious_orchestra.network_architecture.spokes.description;

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2">&gt; SUBCONSCIOUS ORCHESTRA: {subconscious_orchestra.name}</h3>
      <p className="text-xs text-gray-400 italic mb-6 leading-relaxed">
          {subconscious_orchestra.description}
      </p>
      
      <div className="mb-6 bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
        <h4 className="font-bold text-purple-300 text-base tracking-wider">HUB: {hub.name}</h4>
        <p className="text-xs text-gray-400">{hub.role}</p>
      </div>

      <h4 className="font-bold text-cyan-300 text-base tracking-wider mb-2">SPOKES: Cognitive Agents</h4>
      <p className="text-xs text-gray-400 italic mb-4 leading-relaxed">
          {spokesDescription}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-cyan-400">
                    <CpuChipIcon />
                </div>
                <h5 className="font-bold text-cyan-300 text-xs tracking-wider uppercase truncate">{getAgentName(agent)}</h5>
            </div>
            {getAgentDetails(agent) && (
                 <p className="text-xs text-purple-300/80 mt-2 pt-2 border-t border-cyan-500/10">Specialization: {getAgentDetails(agent)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
