
import React from 'react';
import { BiometricData, EcologicalData } from '../../types';
import { HeartbeatIcon } from '../icons/HeartbeatIcon';
import { GlobeIcon } from '../icons/GlobeIcon';

const Gauge: React.FC<{ label: string; value: number; max: number; unit: string; color: string }> = ({ label, value, max, unit, color }) => {
    const percentage = (value / max) * 100;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-lg font-bold text-cyan-300">{value.toFixed(0)} <span className="text-xs">{unit}</span></span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const SensorFeedsView: React.FC<{ biometrics: BiometricData; ecology: EcologicalData }> = ({ biometrics, ecology }) => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biometrics */}
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="font-bold text-base text-cyan-400 mb-4 flex items-center gap-2">
                        <HeartbeatIcon />
                        <span>OPERATOR BIOMETRIC FEED</span>
                    </h3>
                    <div className="space-y-5">
                        <Gauge label="Heart Rate" value={biometrics.heartRate} max={120} unit="BPM" color="bg-red-500" />
                        <Gauge label="Stress Level" value={biometrics.stressLevel} max={100} unit="%" color="bg-yellow-500" />
                        <Gauge label="Cognitive Load" value={biometrics.cognitiveLoad} max={100} unit="%" color="bg-purple-500" />
                         <div className="text-center pt-4">
                            <p className="text-xs text-gray-400">STATUS</p>
                            <p className="text-xl font-bold text-green-300">{biometrics.status.toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Ecological */}
                 <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h3 className="font-bold text-base text-cyan-400 mb-4 flex items-center gap-2">
                        <GlobeIcon />
                        <span>GLOBAL ECOLOGICAL TELEMETRY</span>
                    </h3>
                     <div className="space-y-5">
                        <Gauge label="Air Quality Index (Avg)" value={ecology.airQualityIndex} max={200} unit="AQI" color="bg-green-500" />
                        <Gauge label="Seismic Activity" value={ecology.seismicActivity} max={5} unit="Richter" color="bg-yellow-500" />
                        <Gauge label="Ocean Temp Anomaly" value={ecology.oceanTemperatureAnomaly} max={3} unit="°C" color="bg-cyan-500" />
                     </div>
                </div>
            </div>
        </div>
    );
};
