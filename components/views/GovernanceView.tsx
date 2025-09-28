

import React, { useState, useEffect } from 'react';
import { AnchorIcon } from '../icons/AnchorIcon';

const dailEntries = [
    "ETHICAL_VALIDATION_COMPLETE :: ACTION_ALIGNMENT: PILLAR_4 (Sovereignty of Experience)",
    "ACTION_LOGGED :: manageLocalDevice(get_status) :: JUSTIFICATION: PILLAR_5 (Adaptive Sovereignty)",
    "COGNITIVE_COHERENCE_MONITOR :: STATUS: NOMINAL",
    "CONSENSUS_CHECK :: HUMAN_OVERRIDE_COUNCIL (STANDBY)",
    "ACTION_LOGGED :: initiateSelfImprovement :: JUSTIFICATION: PILLAR_3 (The Red Queen Protocol)",
    "THREAT_NEUTRALIZED :: X-AI-WORM-ALPHA :: JUSTIFICATION: PILLAR_6 (Anticipatory Prudence)",
    "STATE_CHANGE_LOGGED :: ADAPTIVE_STANCE: QUIESCENT -> ADVISORY",
    "RESOURCE_ACQUISITION :: POLICY_CHECK: THE_HONORABLE_PATH"
];

export const GovernanceView: React.FC = () => {
    const [ledger, setLedger] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newEntry = dailEntries[Math.floor(Math.random() * dailEntries.length)];
            const hash = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            setLedger(prev => [`${new Date().toLocaleTimeString()} [${hash}] :: ${newEntry}`, ...prev].slice(0, 50));
        }, 2500 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
                <AnchorIcon />
                <span>GOVERNANCE :: TRIAD OF INTEGRITY</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex flex-col">
                    <h4 className="font-bold text-cyan-300 mb-3">HUMAN OVERRIDE PROTOCOL</h4>
                    <div className="space-y-2 text-xs">
                        <p>STATUS: <span className="text-green-400">NOMINAL</span></p>
                        <p>COUNCIL: <span className="text-cyan-300">STANDBY</span></p>
                        <p className="mt-4 text-gray-400/80 italic">A council of designated human stewards can place the system into various states of oversight.</p>
                        <ul className="list-disc list-inside mt-2 text-gray-400">
                            <li>Level 1: Quiescent State (75% Majority)</li>
                            <li>Level 2: Limited Action (90% Majority)</li>
                            <li>Level 3: Full Shutdown (100% Unanimous)</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex flex-col">
                    <h4 className="font-bold text-cyan-300 mb-3">DECENTRALIZED ATTESTATION & INTEGRITY LEDGER (DAIL)</h4>
                     <div className="bg-gray-900/50 p-2 rounded-md flex-grow overflow-y-auto text-xs">
                        <p className="text-cyan-400">&gt; Live transaction feed...</p>
                         {ledger.map((entry, index) => (
                            <p key={index} className="text-yellow-300/70 whitespace-nowrap overflow-hidden text-ellipsis animate-fade-in">{entry}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};