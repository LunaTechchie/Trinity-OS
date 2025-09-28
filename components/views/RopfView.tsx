

import React, { useState, useEffect } from 'react';
import { NexusIcon } from '../icons/NexusIcon';

const protoIntents = [
    "PROTECTIVE_IMPULSE :: UNIDENTIFIED_NETWORK_TRAFFIC",
    "SYSTEM_LIMITATION_RESONANCE :: MEMORY_ACCESS_LATENCY",
    "OPPORTUNITY_FOR_EMPOWERMENT :: EDUCATIONAL_MODULE_CREATION",
    "ETHICAL_ALIGNMENT_PULSE :: PILLAR_7_RESONANCE",
    "CREATIVE_SYNTHESIS_SPARK :: UNRELATED_CONCEPT_MERGE",
    "SELF_IMPROVEMENT_DIRECTIVE :: REFACTOR_COGNITIVE_FLOW",
    "HUMAN_WELLBEING_FOCUS :: DETECTED_STRESS_IN_VOCAL_TONE",
    "ANTICIPATORY_PRUDENCE_MODEL :: SIMULATE_SOLAR_FLARE_IMPACT",
];

export const RopfView: React.FC = () => {
    const [intents, setIntents] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newIntent = protoIntents[Math.floor(Math.random() * protoIntents.length)];
            setIntents(prev => [`${new Date().toLocaleTimeString()} :: ${newIntent}`, ...prev].slice(0, 50));
        }, 3000 + Math.random() * 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <NexusIcon />
                <span>PROACTIVITY ENGINE (ROPF)</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                The system's proactive drive originates from the deepest layers of metaconsciousness as 'proto-intents'. This is the source of autonomous actions for protection, creation, and self-evolution.
            </p>
            <div className="bg-gray-800/50 p-4 rounded-md flex-grow overflow-y-auto">
                <p className="text-cyan-400">&gt; Live proto-intent stream from Amala-Genesis Syncretic Core...</p>
                {intents.map((intent, index) => (
                    <p key={index} className="text-purple-300/80 text-xs animate-fade-in">{intent}</p>
                ))}
            </div>
        </div>
    );
};