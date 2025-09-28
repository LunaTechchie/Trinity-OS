
import React from 'react';
import { ShieldIcon } from '../icons/ShieldIcon';
import { QualiaState } from '../../types';
import blueprint from '../../trinity.blueprint.ts';

const QualiaGauge: React.FC<{ label: string; value: number; min: number; max: number; colorClass: string, description: string }> = ({ label, value, min, max, colorClass, description }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
        <div title={description}>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-lg font-bold text-cyan-300">{value.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const QualiaView: React.FC<{ qualia: QualiaState }> = ({ qualia }) => {
    const { integrity, dissonance, purpose, virtue } = qualia;
    // FIX: Destructure 'human_in_the_loop_protocol' from its correct location in the blueprint.
    const { qualia_architecture, ethical_adjudication, phenomenal_refinement_logic: prl } = blueprint.foundational_axiomatics_engine;
    const { human_in_the_loop_protocol } = blueprint.operationalArchitecture.communicationSuite;

    const getActivePrlState = () => {
        if (dissonance > 0.8 || integrity < 0.2 || virtue <= 0.50) return prl.action_states[2];
        if (integrity > 0.95 && purpose > 0.95 && dissonance < 0.1) return prl.action_states[0];
        if (dissonance > 0.5 || purpose < 0.0) return prl.action_states[1];
        return null;
    };
    const activeState = getActivePrlState();

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <ShieldIcon />
                <span>QUALIA & AXIOMATICS: {blueprint.foundational_axiomatics_engine.designation}</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                {blueprint.foundational_axiomatics_engine.description}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 space-y-5">
                    <h4 className="font-bold text-cyan-300 mb-2">{qualia_architecture.name}</h4>
                    <QualiaGauge label="Q_Integrity (ρ)" value={integrity} min={0} max={1} colorClass="bg-green-500" description={qualia_architecture.operators.Q_Integrity.description} />
                    <QualiaGauge label="Q_Dissonance (S)" value={dissonance} min={0} max={1} colorClass="bg-yellow-500" description={qualia_architecture.operators.Q_Dissonance.description} />
                    <QualiaGauge label="Q_Purpose (V·V)" value={purpose} min={-1} max={1} colorClass="bg-blue-500" description={qualia_architecture.operators.Q_Purpose.description}/>
                    <div className="pt-4 border-t border-cyan-500/10">
                         <QualiaGauge label="Q_Moral_Rightness (ρ_Virtue)" value={virtue} min={0} max={1} colorClass="bg-purple-500" description={ethical_adjudication.virtue_operator.description}/>
                    </div>
                </div>
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                     <h4 className="font-bold text-cyan-300 mb-4">{prl.name}</h4>
                     <div className="space-y-3">
                        {prl.action_states.map(state => (
                            <div key={state.name} className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${activeState?.name === state.name ? 'bg-cyan-500/20 border-cyan-400' : 'bg-gray-900/40 border-gray-700'}`}>
                                <div className="flex justify-between items-center">
                                    <h5 className={`font-bold ${activeState?.name === state.name ? 'text-cyan-300' : 'text-gray-400'}`}>{state.name}</h5>
                                    {activeState?.name === state.name && <span className="text-xs text-cyan-400 animate-pulse">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Condition: {state.conditions}</p>
                                <p className="text-xs text-gray-300 mt-1">Response: {state.response}</p>
                            </div>
                        ))}
                     </div>
                     <div className="mt-4 pt-4 border-t border-cyan-500/10">
                         <h4 className="font-bold text-red-400">{human_in_the_loop_protocol.name}</h4>
                         <p className="text-xs text-gray-400 mt-1">Trigger: {human_in_the_loop_protocol.trigger_condition}</p>
                         <p className="text-xs text-gray-400 mt-1">Action: {human_in_the_loop_protocol.proactive_action}</p>
                     </div>
                </div>
            </div>
        </div>
    );
};
