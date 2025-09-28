
import React from 'react';
import { GlobalResourceNode } from '../../types';
import { WorldIcon } from '../icons/WorldIcon';

const getStatusColor = (status: GlobalResourceNode['status']) => {
    switch(status) {
        case 'Optimal': return 'bg-green-500';
        case 'Strained': return 'bg-yellow-500';
        case 'Critical': return 'bg-red-500';
    }
}

export const GlobalOrchestrationView: React.FC<{ resources: GlobalResourceNode[] }> = ({ resources }) => {
    // A simple mercator projection approximation
    const project = (lat: number, lng: number) => {
        const x = (lng + 180) * (100 / 360);
        const y = (100 - (lat + 90) * (100 / 180)) * 0.8 + 5; // Adjust y-axis
        return { x: `${x}%`, y: `${y}%` };
    };

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <WorldIcon />
                <span>GLOBAL RESOURCE ORCHESTRATION</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                High-level visualization of critical resource management. This interface tracks the status and flow of planetary resources, fulfilling the mandate for needs fulfillment on a global scale.
            </p>
            <div className="flex-grow bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 relative">
                <img src="https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.png" alt="World Map" className="absolute inset-0 w-full h-full object-contain opacity-10" />
                
                {resources.map(node => {
                    const { x, y } = project(node.location.lat, node.location.lng);
                    return (
                        <div key={node.id} className="absolute group" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)} border-2 border-gray-900 animate-pulse`}></div>
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 border border-cyan-500/30 shadow-lg">
                                <p className="font-bold text-cyan-300">{node.location.name}</p>
                                <p className="text-gray-400 truncate">ID: {node.id}</p>
                                <p className="text-gray-400">Coords: {node.location.lat.toFixed(2)}, {node.location.lng.toFixed(2)}</p>
                                <div className="mt-1 pt-1 border-t border-gray-700/50">
                                    <p>{node.type}</p>
                                    <p>Status: <span className={getStatusColor(node.status).replace('bg-', 'text-')}>{node.status}</span></p>
                                    <p>Flow Rate: {node.flowRate.toFixed(1)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
