
import React, { useState, useEffect } from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { QuantumIcon } from '../icons/QuantumIcon'; 

const QuantumStatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="text-cyan-300">{value.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export const QuantumView: React.FC = () => {
    const qsaFramework = blueprint.quantum_symbiotic_alignment_framework;
    
    const [qubitAllocation, setQubitAllocation] = useState(40);
    const [entanglementFidelity, setEntanglementFidelity] = useState(98);
    const [coherenceTime, setCoherenceTime] = useState(95);

    useEffect(() => {
        const interval = setInterval(() => {
            setQubitAllocation(30 + Math.random() * 40);
            setEntanglementFidelity(97 + Math.random() * 2.9);
            setCoherenceTime(92 + Math.random() * 8);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <QuantumIcon />
                <span>{qsaFramework.frameworkName} ({qsaFramework.codename})</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                {qsaFramework.mandate}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-cyan-300 font-bold mb-4">LIVE METRICS (SIMULATED)</h4>
                    <div className="space-y-6">
                        <QuantumStatBar label="Qubit Allocation" value={qubitAllocation} color="bg-purple-500" />
                        <QuantumStatBar label="Entanglement Fidelity" value={entanglementFidelity} color="bg-green-500" />
                        <QuantumStatBar label="Coherence Time" value={coherenceTime} color="bg-cyan-500" />
                    </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-cyan-300 font-bold mb-4">CORE FUSING PROTOCOLS</h4>
                    <div className="space-y-4 text-xs">
                        {qsaFramework.core_fusing_protocols.map(protocol => (
                            <div key={protocol.name}>
                                <p className="text-cyan-400 font-semibold">{protocol.name}</p>
                                <p className="text-gray-400">{protocol.outcome}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
