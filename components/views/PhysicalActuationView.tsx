
import React, { useState } from 'react';
import { PhysicalAsset } from '../../types';
import { DroneIcon } from '../icons/DroneIcon';
import { WrenchIcon } from '../icons/WrenchIcon';
import { QuantumIcon } from '../icons/QuantumIcon';
import { SendIcon } from '../icons/SendIcon';
import { SyncIcon } from '../icons/SyncIcon';

const getStatusColor = (status: PhysicalAsset['status']) => {
    switch (status) {
        case 'Deployed':
        case 'Tasked':
            return 'text-green-400';
        case 'Idle':
            return 'text-cyan-400';
        case 'Returning':
            return 'text-yellow-400';
        case 'Error':
            return 'text-red-400';
    }
};

const getAssetIcon = (type: PhysicalAsset['type']) => {
    switch (type) {
        case 'Sentinel Drone': return <DroneIcon />;
        case 'Reclamation Rover': return <WrenchIcon />;
        case 'Quantum Sat-Link': return <QuantumIcon />;
        case 'Atmospheric Stabilizer': return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 12A10 10 0 0 0 12 2v10Z"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/></svg>;
    }
};

interface PhysicalActuationViewProps {
  assets: PhysicalAsset[];
  onDeployAsset: (assetType: PhysicalAsset['type'], locationName: string, mission: string) => void;
  isLoading: boolean;
  onSetFlightPath: (assetId: string, path: { lat: number, lng: number }[]) => void;
  onManipulateObject: (assetId: string, objectName: string, action: 'pick' | 'drop') => void;
  onReceiveTelemetry: (assetId: string) => void;
}

const assetTypes: PhysicalAsset['type'][] = ['Sentinel Drone', 'Reclamation Rover', 'Quantum Sat-Link', 'Atmospheric Stabilizer'];
const locationPresets = ['Amazon Basin', 'Siberian Tundra', 'Gobi Desert', 'North Atlantic'];

const AssetControlPanel: React.FC<{ asset: PhysicalAsset, isLoading: boolean, onSetFlightPath: PhysicalActuationViewProps['onSetFlightPath'], onManipulateObject: PhysicalActuationViewProps['onManipulateObject'], onReceiveTelemetry: PhysicalActuationViewProps['onReceiveTelemetry'] }> = ({ asset, isLoading, onSetFlightPath, onManipulateObject, onReceiveTelemetry }) => {
    const [pathInput, setPathInput] = useState('');
    const [objectInput, setObjectInput] = useState('');

    const handlePathSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedPath = JSON.parse(pathInput);
            if (Array.isArray(parsedPath) && parsedPath.every(p => typeof p.lat === 'number' && typeof p.lng === 'number')) {
                onSetFlightPath(asset.id, parsedPath);
                setPathInput('');
            } else {
                alert('Invalid path format. Use JSON array of {lat, lng} objects.');
            }
        } catch (error) {
            alert('Invalid JSON for flight path.');
        }
    };

    const handleObjectAction = (action: 'pick' | 'drop') => {
        if (objectInput.trim()) {
            onManipulateObject(asset.id, objectInput, action);
            setObjectInput('');
        }
    };

    return (
        <div className="bg-gray-900/50 p-3 mt-2 rounded-b-lg border-t border-cyan-500/20 text-xs">
            {/* Telemetry */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <p>Battery: <span className="text-green-300">{asset.telemetry?.battery.toFixed(1)}%</span></p>
                <p>Position: <span className="text-cyan-300">{asset.telemetry?.currentPosition.lat.toFixed(2)}, {asset.telemetry?.currentPosition.lng.toFixed(2)}</span></p>
                <p>Held Object: <span className="text-yellow-300">{asset.heldObject || 'None'}</span></p>
                <button onClick={() => onReceiveTelemetry(asset.id)} className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 justify-end"><SyncIcon /> Refresh</button>
            </div>
            <p className="mb-3">Status: <span className="text-gray-400 italic">{asset.telemetry?.statusMessage}</span></p>

            {/* Controls */}
            {asset.type === 'Sentinel Drone' && (
                <form onSubmit={handlePathSubmit}>
                    <label className="block text-cyan-400/80 mb-1">Set Flight Path</label>
                    <textarea value={pathInput} onChange={e => setPathInput(e.target.value)} placeholder='[{"lat": 34.05, "lng": -118.24}]' rows={2} className="bg-gray-800/60 border border-gray-700 rounded p-1 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs" />
                    <button type="submit" disabled={isLoading} className="mt-1 w-full text-center py-1 bg-cyan-600/50 rounded hover:bg-cyan-500/50 disabled:opacity-50">Set Path</button>
                </form>
            )}
            {asset.type === 'Reclamation Rover' && (
                <div>
                    <label className="block text-cyan-400/80 mb-1">Manipulate Object</label>
                    <input type="text" value={objectInput} onChange={e => setObjectInput(e.target.value)} placeholder="Object name..." className="bg-gray-800/60 border border-gray-700 rounded p-1 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs" />
                    <div className="flex gap-2 mt-1">
                        <button onClick={() => handleObjectAction('pick')} disabled={isLoading} className="flex-1 text-center py-1 bg-green-600/50 rounded hover:bg-green-500/50 disabled:opacity-50">Pick Up</button>
                        <button onClick={() => handleObjectAction('drop')} disabled={isLoading} className="flex-1 text-center py-1 bg-red-600/50 rounded hover:bg-red-500/50 disabled:opacity-50">Drop</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export const PhysicalActuationView: React.FC<PhysicalActuationViewProps> = ({ assets, onDeployAsset, isLoading, onSetFlightPath, onManipulateObject, onReceiveTelemetry }) => {
  const [assetType, setAssetType] = useState<PhysicalAsset['type']>(assetTypes[0]);
  const [locationName, setLocationName] = useState(locationPresets[0]);
  const [mission, setMission] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (mission.trim() && !isLoading) {
      onDeployAsset(assetType, locationName, mission);
      setMission('');
    }
  };

  const toggleAsset = (id: string) => {
    setSelectedAssetId(prev => prev === id ? null : id);
  }

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
        <DroneIcon />
        <span>PHYSICAL ACTUATION & ROBOTICS</span>
      </h3>
       <p className="text-xs text-gray-400/80 mb-6 italic">
        Monitor and deploy a network of simulated physical assets. This view provides direct control over real-world intervention capabilities.
      </p>
      
      <form onSubmit={handleDeploy} className="mb-6 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
        <h4 className="font-bold text-base text-cyan-300 mb-4">DEPLOY NEW ASSET</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as PhysicalAsset['type'])}
                className="bg-gray-800/60 border border-gray-700 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            >
                {assetTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
                 value={locationName}
                 onChange={(e) => setLocationName(e.target.value)}
                 className="bg-gray-800/60 border border-gray-700 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            >
                 {locationPresets.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
        </div>
        <div className="relative mt-4">
          <input 
              type="text"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Mission objective..."
              className="bg-gray-800/60 border border-gray-700 rounded-lg p-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
          />
           <button type="submit" disabled={isLoading || !mission.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cyan-400 hover:text-white disabled:text-gray-600">
                <SendIcon />
            </button>
        </div>
      </form>
      
      <h4 className="font-bold text-base text-cyan-300 mb-3">DEPLOYED ASSETS</h4>
      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        {assets.length > 0 ? (
          [...assets].sort((a,b) => new Date(b.deploymentTime).getTime() - new Date(a.deploymentTime).getTime()).map(asset => (
            <div key={asset.id} className="bg-gray-800/50 rounded-lg">
                <button onClick={() => toggleAsset(asset.id)} className="w-full flex items-center gap-4 p-3 text-left">
                    <div className="text-cyan-400 p-2 bg-gray-900/50 rounded-md">
                        {getAssetIcon(asset.type)}
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-cyan-300">{asset.type}</p>
                            <p className={`text-xs font-bold ${getStatusColor(asset.status)}`}>
                                {asset.status.toUpperCase()}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 truncate">Mission: {asset.mission}</p>
                        <p className="text-xs text-gray-500">Location: {asset.location.name}</p>
                    </div>
                </button>
                {selectedAssetId === asset.id && <AssetControlPanel asset={asset} isLoading={isLoading} onSetFlightPath={onSetFlightPath} onManipulateObject={onManipulateObject} onReceiveTelemetry={onReceiveTelemetry} />}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No physical assets currently deployed.</p>
          </div>
        )}
      </div>
    </div>
  );
};