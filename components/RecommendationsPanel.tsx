import React from 'react';
import { RecommendationData } from '../types';
import { ShieldIcon } from './icons/ShieldIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import { AiIcon } from './icons/AiIcon';
import { QuantumIcon } from './icons/QuantumIcon';

interface RecommendationsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  data: RecommendationData | null;
}

const iconMap = {
  shield: <ShieldIcon />,
  network: <NetworkIcon />,
  ai: <AiIcon />,
  quantum: <QuantumIcon />,
};


export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ isVisible, onClose, data }) => {
  if (!data) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full md:max-w-2xl bg-gray-900/80 border-l border-cyan-500/20 shadow-2xl shadow-cyan-900/50 transform transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <header className="flex items-center justify-between p-4 border-b border-cyan-500/20 flex-shrink-0">
          <h2 className="text-lg font-bold text-cyan-400">Strategic Recommendations</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">{data.title}</h3>
            <p className="text-gray-400 mb-6">{data.summary}</p>

            <div className="space-y-4">
                {data.recommendations.map((item) => (
                    <div key={item.id} className="bg-cyan-500/5 p-4 rounded-lg border border-cyan-500/10 flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center text-cyan-400">
                            {iconMap[item.icon]}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-100">{item.title}</h4>
                            <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};