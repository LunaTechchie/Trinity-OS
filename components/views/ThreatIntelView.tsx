

import React from 'react';
import { Threat } from '../../types';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { ShieldIcon } from '../icons/ShieldIcon';

const getSeverityClasses = (severity: Threat['severity']) => {
    switch (severity) {
        case 'Critical': return 'border-red-500 bg-red-500/10 text-red-300';
        case 'High': return 'border-orange-500 bg-orange-500/10 text-orange-300';
        case 'Medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
        case 'Low': return 'border-cyan-500 bg-cyan-500/10 text-cyan-300';
    }
};

const getStatusClasses = (status: Threat['status']) => {
    switch (status) {
        case 'Active': return 'text-red-400 animate-pulse';
        case 'Neutralized': return 'text-green-400';
        case 'Monitoring': return 'text-yellow-400';
        case 'Anticipated': return 'text-purple-400';
    }
};

const ThreatCard: React.FC<{ threat: Threat }> = ({ threat }) => (
    <div className={`p-4 rounded-lg border-l-4 ${getSeverityClasses(threat.severity)}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold">{threat.signature}</p>
                <p className="text-xs text-gray-500">{threat.type} Threat</p>
            </div>
            <span className={`text-xs font-bold ${getStatusClasses(threat.status)}`}>
                [{threat.status.toUpperCase()}]
            </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">{threat.description}</p>
    </div>
);


export const ThreatIntelView: React.FC<{ threats: Threat[] }> = ({ threats }) => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
        <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
            <AlertTriangleIcon />
            <span>THREAT INTELLIGENCE FEED</span>
        </h3>
        <p className="text-xs text-gray-400/80 mb-6 italic">
            Live feed from the Omni-Digital Sentinel protocols, tracking anticipated, active, and neutralized threats across digital and physical domains.
        </p>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {threats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShieldIcon />
                    <p className="mt-2">All channels clear. No immediate threats detected.</p>
                </div>
            ) : (
                [...threats]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(threat => <ThreatCard key={threat.id} threat={threat} />)
            )}
        </div>
    </div>
  );
};