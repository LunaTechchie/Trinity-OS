import React, { useState, useEffect } from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { ServerIcon } from '../icons/ServerIcon';
import { SmartphoneIcon } from '../icons/SmartphoneIcon';
import { CpuChipIcon } from '../icons/CpuChipIcon';
import { WrenchIcon } from '../icons/WrenchIcon';

const iconMap: { [key: string]: React.ReactNode } = {
  "Cloud Infrastructure": <ServerIcon />,
  "Mobile Node": <SmartphoneIcon />,
  "Ambient Node": <CpuChipIcon />,
  "Robotic Platform": <WrenchIcon />,
  "Personal Computer": <CpuChipIcon />,
  "Wearable Node": <SmartphoneIcon />,
};

const hardwareIntegration = blueprint.operationalArchitecture.hardwareIntegration;


const NodeCard: React.FC<{ node: (typeof hardwareIntegration.supportedDevices)[number] }> = ({ node }) => {
    const [load, setLoad] = useState(20 + Math.random() * 30);
    const [status, setStatus] = useState<'ONLINE' | 'STANDBY' | 'SYNCING'>('ONLINE');
    
    useEffect(() => {
        const interval = setInterval(() => {
            const newStatus = Math.random() > 0.1 ? 'ONLINE' : (Math.random() > 0.5 ? 'STANDBY' : 'SYNCING');
            setStatus(newStatus);
            if (newStatus === 'ONLINE') {
                setLoad(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
            } else {
                 setLoad(prev => Math.max(5, prev * 0.9));
            }
        }, 2000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    const statusColor = status === 'ONLINE' ? 'text-green-400' : status === 'SYNCING' ? 'text-yellow-400' : 'text-gray-500';
    const loadColor = load > 75 ? 'bg-red-500' : load > 50 ? 'bg-yellow-500' : 'bg-cyan-500';

    return (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
                <div className="text-cyan-400 mt-1">{iconMap[node.deviceType] || <CpuChipIcon />}</div>
                <div className="flex-grow">
                    <h4 className="font-bold text-cyan-300">{node.deviceType}</h4>
                    <p className="text-xs text-gray-500">{node.name}</p>
                    <div className="mt-3">
                         <div className="flex justify-between items-center text-xs mb-1">
                            <span className={`${statusColor} font-bold ${status !== 'ONLINE' ? 'animate-pulse' : ''}`}>{status}</span>
                            <span>LOAD: {load.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                            <div className={`${loadColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${load}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const NodesView: React.FC = () => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2">&gt; DISTRIBUTED NODE NETWORK (UNN)</h3>
       <p className="text-xs text-gray-400/80 mb-6 italic">
        {hardwareIntegration.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hardwareIntegration.supportedDevices.map(device => (
            <NodeCard key={device.name} node={device} />
        ))}
      </div>
    </div>
  );
};
