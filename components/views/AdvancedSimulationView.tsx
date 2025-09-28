
import React from 'react';
import { Simulation } from '../../types';
import { GitBranchIcon } from '../icons/GitBranchIcon';
import { LoadingSpinnerIcon } from '../icons/LoadingSpinnerIcon';

const getStatusInfo = (status: Simulation['status']): { color: string; icon: React.ReactNode } => {
  switch (status) {
    case 'Running':
      return { color: 'text-yellow-400', icon: <LoadingSpinnerIcon /> };
    case 'Completed':
      return { color: 'text-green-400', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> };
    case 'Paused':
      return { color: 'text-gray-400', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> };
    case 'Failed':
      return { color: 'text-red-400', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> };
  }
};

export const AdvancedSimulationView: React.FC<{ simulations: Simulation[] }> = ({ simulations }) => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
        <GitBranchIcon />
        <span>ADVANCED SIMULATION & FORESIGHT</span>
      </h3>
      <p className="text-xs text-gray-400/80 mb-6 italic">
        Tracking complex predictive models run by The Oracle's Eye. This station tests scenarios to forecast potential outcomes, making the "co-composer of reality" function tangible.
      </p>
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {simulations.length > 0 ? (
          simulations.map(sim => {
            const statusInfo = getStatusInfo(sim.status);
            const outcomePercentage = sim.outcomeProbability * 100;
            return (
              <div key={sim.id} className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-cyan-300">{sim.title}</p>
                    <p className="text-xs text-gray-500">ID: {sim.id}</p>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-bold ${statusInfo.color}`}>
                    {sim.status === 'Running' && <span className="animate-spin"><LoadingSpinnerIcon /></span>}
                    <span>{sim.status.toUpperCase()}</span>
                  </div>
                </div>
                {sim.status === 'Completed' && (
                   <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs space-y-2">
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400">Outcome Probability</span>
                            <span className="text-purple-300 font-bold">{outcomePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${outcomePercentage}%` }}></div>
                        </div>
                     </div>
                     <p className="pt-1"><span className="text-gray-400">Summary:</span> {sim.summary}</p>
                   </div>
                )}
                 {sim.status === 'Running' && (
                     <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs">
                        <p className="text-yellow-400/80 animate-pulse">{sim.summary}</p>
                     </div>
                 )}
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No simulations currently active.</p>
          </div>
        )}
      </div>
    </div>
  );
};
