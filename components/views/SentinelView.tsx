import React, { useState } from 'react';
import { Threat, BiometricData, EcologicalData } from '../../types';
import { RadarIcon } from '../icons/RadarIcon';

const getSeverityColor = (severity: Threat['severity'], type: 'bg' | 'border' | 'text' = 'bg') => {
    const colorMap = {
        'Critical': { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-300' },
        'High': { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-300' },
        'Medium': { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-300' },
        'Low': { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-300' },
    };
    return colorMap[severity][type];
};

const SensorFusionWidget: React.FC<{ biometrics: BiometricData; ecology: EcologicalData }> = ({ biometrics, ecology }) => (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 h-full">
        <h4 className="font-bold text-cyan-300 mb-4">SENSOR FUSION OVERVIEW</h4>
        <div className="space-y-4 text-xs">
            <div>
                <p className="text-gray-400">OPERATOR STATUS</p>
                <p className="text-lg font-bold text-green-300">{biometrics.status.toUpperCase()}</p>
            </div>
             <div>
                <p className="text-gray-400">PLANETARY STABILITY</p>
                 <p className="text-lg font-bold text-cyan-300">NOMINAL</p>
            </div>
             <div className="pt-2 border-t border-gray-700/50">
                <p>HR: <span className="text-white">{biometrics.heartRate}</span> | Stress: <span className="text-white">{biometrics.stressLevel}%</span></p>
                <p>AQI: <span className="text-white">{ecology.airQualityIndex.toFixed(0)}</span> | Seismic: <span className="text-white">{ecology.seismicActivity.toFixed(2)}</span></p>
            </div>
        </div>
    </div>
);

export const SentinelView: React.FC<{ threats: Threat[], biometrics: BiometricData, ecology: EcologicalData }> = ({ threats, biometrics, ecology }) => {
    const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);
    
    // A simple mercator projection approximation
    const project = (lat: number, lng: number) => {
        const x = (lng + 180) * (100 / 360);
        const y = (100 - (lat + 90) * (100 / 180)) * 0.9 + 5;
        return { x: `${x}%`, y: `${y}%` };
    };

    const sortedThreats = [...threats].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <RadarIcon />
                <span>OMNI-SENTINEL :: THREAT & SENSOR MAP</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                A unified, real-time situational awareness interface. The map displays detected digital and physical threats, while the dashboard provides a fused overview of critical sensor data.
            </p>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-2 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 relative">
                    <img src="https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.png" alt="World Map" className="absolute inset-0 w-full h-full object-contain opacity-10" />
                    {threats.map(threat => {
                        if (!threat.location) return null;
                        const { x, y } = project(threat.location.lat, threat.location.lng);
                        return (
                             <div 
                                key={threat.id} 
                                className="absolute group cursor-pointer" 
                                style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
                                onClick={() => setSelectedThreatId(threat.id)}
                            >
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity)} border-2 transition-all duration-300 ${selectedThreatId === threat.id ? 'border-white scale-150' : 'border-gray-900'} animate-pulse`}></div>
                                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded py-2 px-3 z-10 border border-red-500/30 shadow-lg">
                                    <p className="font-bold text-red-300">{threat.signature}</p>
                                    <p className="text-gray-400 truncate">Type: {threat.type} | Status: {threat.status}</p>
                                    <p className="mt-1 pt-1 border-t border-gray-700/50 text-gray-300">{threat.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
                    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex-grow flex flex-col min-h-0">
                        <h4 className="font-bold text-cyan-300 mb-3 flex-shrink-0">THREAT LIST</h4>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                            {sortedThreats.map(threat => (
                                <div 
                                    key={threat.id} 
                                    className={`p-2 rounded-md border text-xs cursor-pointer transition-all duration-300 ${selectedThreatId === threat.id ? 'bg-cyan-500/20 border-cyan-400' : 'bg-gray-900/40 border-gray-700 hover:bg-gray-700/50'}`}
                                    onClick={() => setSelectedThreatId(threat.id)}
                                >
                                    <p className={`font-bold ${getSeverityColor(threat.severity, 'text')}`}>{threat.signature}</p>
                                    <p className="text-gray-500">{threat.type} - {threat.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <SensorFusionWidget biometrics={biometrics} ecology={ecology} />
                </div>
            </div>
        </div>
    );
};