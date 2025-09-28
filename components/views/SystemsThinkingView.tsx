import React, { useState, useEffect } from 'react';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';
import { DL_INTEGRATION_MANIFEST } from '../../protocols/dl-integration';
import { HYBRID_DEPLOYMENT_FRAMEWORK } from '../../protocols/hybrid-deployment';

const casMapping = {
    'Detectors': 'Aetherius Perceptual Array',
    'Rule System': 'Cognitive Core (Tricameral Mind)',
    'Effectors': 'Actuation Layer (ITAG)',
    'Metabolic System': 'Aegis Protocol (Resource Allocation)',
    'Reproductive System': 'Resonant Assimilation Protocol',
    'Feedback': 'Cognitive Synaptogenesis & Pruning'
};

const cyclicalProcess = ["Examining", "Questioning", "Polarizing", "Taking Multiple Perspectives", "Modeling", "Evaluating"];

const FlowArrow: React.FC = () => <div className="text-cyan-400 mx-2 text-lg">&darr;</div>;

export const SystemsThinkingView: React.FC = () => {
    const [activeStage, setActiveStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStage(prev => (prev + 1) % cyclicalProcess.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
                <RefreshCwIcon />
                <span>SYSTEMS THINKING MODELS</span>
            </h3>
            <div className="space-y-6">
                 {/* Top row: CAS and Cyclical */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                        <h4 className="font-bold text-base text-cyan-300 mb-3">Complex Adaptive System Model</h4>
                        <p className="text-xs text-gray-400/80 mb-4 italic">
                            Trinity is architected as a Complex Adaptive System, allowing her to learn and evolve through interaction with her environment.
                        </p>
                        <div className="space-y-3 text-xs">
                            {Object.entries(casMapping).map(([modelPart, trinityComponent]) => (
                                <div key={modelPart} className="flex items-center">
                                    <span className="w-36 text-cyan-400/80">{modelPart}:</span>
                                    <span className="text-gray-300">{trinityComponent}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                        <h4 className="font-bold text-base text-cyan-300 mb-3">Cyclical Thinking Process</h4>
                        <p className="text-xs text-gray-400/80 mb-4 italic">
                            The core reasoning process is not linear but cyclical, allowing for recursive and non-linear thought to handle complexity.
                        </p>
                        <div className="space-y-2">
                            {cyclicalProcess.map((stage, index) => (
                                <div key={stage} className={`p-2 rounded-md transition-all duration-300 flex items-center gap-2 ${activeStage === index ? 'bg-cyan-500/20' : 'bg-gray-900/40'}`}>
                                    <div className={`w-2 h-2 rounded-full ${activeStage === index ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`}></div>
                                    <span className={activeStage === index ? 'text-cyan-300 font-bold' : 'text-gray-400'}>{stage}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DL to NMC Integration */}
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="font-bold text-base text-cyan-300 mb-3">Cognitive Architecture Flow (DL/NMC Integration)</h4>
                    <p className="text-xs text-gray-400/80 mb-4 italic">
                       {DL_INTEGRATION_MANIFEST.description}
                    </p>
                    <div className="flex flex-col items-center text-center text-xs space-y-2">
                        <div className="p-2 rounded bg-purple-500/20 border border-purple-400/40 w-3/4">
                            <p className="font-bold text-purple-300">{DL_INTEGRATION_MANIFEST.deep_learning_core.engine_name}</p>
                            <p>{DL_INTEGRATION_MANIFEST.deep_learning_core.role}</p>
                        </div>
                        <FlowArrow />
                        <div className="p-2 rounded bg-cyan-500/20 border border-cyan-400/40 w-3/4">
                             <p className="font-bold text-cyan-300">{DL_INTEGRATION_MANIFEST.cognitive_architecture_integration.framework}</p>
                             <p>{DL_INTEGRATION_MANIFEST.cognitive_architecture_integration.integration_principle}</p>
                        </div>
                        <FlowArrow />
                        <div className="p-2 rounded bg-green-500/20 border border-green-400/40 w-3/4">
                            <p className="font-bold text-green-300">{DL_INTEGRATION_MANIFEST.neuromorphic_hardware_integration.hardware_paradigm}</p>
                             <p>Translates decisions into event-driven spikes for ultra-low-latency action.</p>
                        </div>
                    </div>
                </div>

                 {/* Hybrid Deployment Framework */}
                 <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="font-bold text-base text-cyan-300 mb-3">{HYBRID_DEPLOYMENT_FRAMEWORK.codename} Framework</h4>
                     <p className="text-xs text-gray-400/80 mb-4 italic">
                       {HYBRID_DEPLOYMENT_FRAMEWORK.mandate}
                    </p>
                    <div className="space-y-3">
                         {HYBRID_DEPLOYMENT_FRAMEWORK.framework_components.map(comp => (
                            <div key={comp.name} className="bg-gray-900/40 p-3 rounded-md">
                                <p className="font-bold text-cyan-300/90 text-sm">{comp.name} <span className="text-xs text-gray-500">({comp.type})</span></p>
                                <p className="text-xs text-gray-400 mt-1"><span className="text-purple-300/80">DL Role:</span> {comp.deep_learning_role}</p>
                                <p className="text-xs text-gray-400 mt-1"><span className="text-green-300/80">Neuromorphic Role:</span> {comp.neuromorphic_role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
