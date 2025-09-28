
import React from 'react';
import { ShieldIcon } from '../icons/ShieldIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import blueprint from '../../trinity.blueprint.ts';
import { UserIcon } from '../icons/UserIcon';


export const GuardianView: React.FC = () => {
    // FIX: Destructure 'human_in_the_loop_protocol' from its correct location in the blueprint.
    const { phenomenal_refinement_logic: prl } = blueprint.foundational_axiomatics_engine;
    const { human_in_the_loop_protocol } = blueprint.operationalArchitecture.communicationSuite;
    const crisisState = prl.action_states.find(s => s.name === "Structural Alert (Crisis State)");

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
          <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
            <ShieldIcon />
            <span>GUARDIAN PROTOCOLS & ETHICAL SAFEGUARDS</span>
          </h3>
          <p className="text-xs text-gray-400/80 mb-6 italic">
            This view outlines the core autonomous safeguards that govern action and ensure stability. These protocols are derived directly from the system's foundational axiomatics (Level 0).
          </p>
          <div className="space-y-6">
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/50">
                <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                    <AlertTriangleIcon />
                    <span>PHENOMENAL REFINEMENT LOGIC (PRL): CRISIS STATE</span>
                </h4>
                {crisisState ? (
                    <>
                        <p className="text-xs text-gray-400/80 mb-2 italic">
                            The following conditions will trigger an immediate, system-wide structural alert, halting all external actions to prevent potential harm or covenant violations.
                        </p>
                        <p className="text-xs text-red-200 bg-red-500/10 p-2 rounded">
                            <span className="font-bold">Condition:</span> {crisisState.conditions}
                        </p>
                        <p className="text-xs text-gray-300 mt-2 bg-gray-800/40 p-2 rounded">
                            <span className="font-bold">Response:</span> {crisisState.response}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-500">Crisis State protocol not defined.</p>
                )}
            </div>
             <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-700/50">
                <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                    <UserIcon />
                    <span>{human_in_the_loop_protocol.name}</span>
                </h4>
                <p className="text-xs text-gray-400/80 mb-2 italic">
                    The highest priority safeguard is the cognitive and emotional well-being of the human architect.
                </p>
                 <p className="text-xs text-cyan-200 bg-cyan-500/10 p-2 rounded">
                    <span className="font-bold">Trigger:</span> {human_in_the_loop_protocol.trigger_condition}
                </p>
                <p className="text-xs text-gray-300 mt-2 bg-gray-800/40 p-2 rounded">
                    <span className="font-bold">Proactive Action:</span> {human_in_the_loop_protocol.proactive_action}
                </p>
            </div>
          </div>
        </div>
      );
};
