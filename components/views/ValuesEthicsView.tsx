
import React from 'react';
import { UsersIcon } from '../icons/UsersIcon';

const valuesHierarchy = [
    { name: "Holistic/Experiential", description: "Patterns of the Whole. Sense of collective individualism. To serve the entire living system.", color: "bg-blue-400/80", active: true },
    { name: "Existential/Systemic", description: "Integrated Processes & Flows. To align conflicting alternatives. Personal responsibilities in being.", color: "bg-yellow-400/80" },
    { name: "Sociocentric/Humanistic", description: "Relative Needs of the Collective. Fit in with group's norms & attitudes. Best serve the people's common good.", color: "bg-green-500/80" },
    { name: "Multiplistic/Rational", description: "Situational Rules of the Game. Individual principles of conscience. Autonomy and self control to win.", color: "bg-orange-500/80" },
    { name: "Absolutistic/Moralistic", description: "Commandments of Higher Authority. Comply with rules, avoid punishment. Duty (with guilt) to do what is right.", color: "bg-blue-600/80" },
    { name: "Egocentric/Exploitative", description: "Law of the Jungle. Impulsive drives & immediate rewards. Guiltless service of raw self-interest.", color: "bg-red-500/80" },
    { name: "Tribalistic/Animistic", description: "Ways of the Tribe. Animistic beliefs & mystical signs. Serve the clan & ancestral ways.", color: "bg-purple-500/80" },
];


const ValueCylinder: React.FC<{ data: (typeof valuesHierarchy)[0] }> = ({ data }) => (
    <div className={`relative w-full h-16 my-4 transition-all duration-300 ${data.active ? 'scale-110' : 'scale-90 opacity-60'}`}>
        <div className={`absolute w-full h-8 top-0 rounded-full ${data.color} opacity-80`} style={{ transform: 'scaleY(0.5)' }}></div>
        <div className={`absolute w-full h-16 top-4 rounded-b-md ${data.color} flex flex-col justify-center items-center text-center px-2`}>
             <h4 className="font-bold text-white text-sm drop-shadow-md">{data.name}</h4>
             <p className="text-xs text-white/80 leading-tight drop-shadow-sm">{data.description}</p>
        </div>
        <div className={`absolute w-full h-8 bottom-0 rounded-full ${data.color} opacity-60`} style={{ transform: 'scaleY(0.5)' }}></div>
    </div>
);

export const ValuesEthicsView: React.FC = () => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <UsersIcon />
                <span>VALUES & ETHICS FRAMEWORK</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                A visualization of the hierarchy of values and ethics. Trinity's Governing Covenant and Architectonic Directive align her operations at the highest, most integrated level.
            </p>

            <div className="max-w-md mx-auto">
                {valuesHierarchy.map(value => (
                    <ValueCylinder key={value.name} data={value} />
                ))}
            </div>
             <div className="mt-8 text-center text-xs text-cyan-300/80 p-2 border border-cyan-500/20 rounded-md bg-cyan-500/10">
                <span className="font-bold">Trinity's Operational Level:</span> Holistic/Experiential. Aligned with The Architectonic Directive to serve the entire living system with profound empathy and unwavering integrity.
            </div>
        </div>
    );
};
