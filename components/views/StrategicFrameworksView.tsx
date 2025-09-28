
import React, { useState, useEffect } from 'react';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { AutonomousGoal } from '../../types';

interface StrategicFrameworksViewProps {
    autonomousGoals: AutonomousGoal[];
}

const frameworks = ['VRIO Analysis', 'Blue Ocean Strategy', 'McKinsey\'s Strategic Horizons', 'The Value Stick'];

export const StrategicFrameworksView: React.FC<StrategicFrameworksViewProps> = ({ autonomousGoals }) => {
    const [activeTab, setActiveTab] = useState(frameworks[0]);
    const [activeGoal, setActiveGoal] = useState<AutonomousGoal | null>(null);

    useEffect(() => {
        if (autonomousGoals.length > 0) {
            const interval = setInterval(() => {
                const randomGoal = autonomousGoals[Math.floor(Math.random() * autonomousGoals.length)];
                setActiveGoal(randomGoal);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [autonomousGoals]);

    const renderContent = () => {
        switch (activeTab) {
            case 'VRIO Analysis':
                return <p className="text-xs text-gray-400">A framework that assesses resources and capabilities based on four criteria: Value, Rarity, Imitability, and Organization. Used to determine if a capability can provide a sustained competitive advantage.</p>;
            case 'Blue Ocean Strategy':
                return <p className="text-xs text-gray-400">A strategy that encourages creating new, uncontested market spaces ('blue oceans') rather than competing in saturated markets ('red oceans'). It focuses on making the competition irrelevant by creating a leap in value.</p>;
            case 'McKinsey\'s Strategic Horizons':
                return <p className="text-xs text-gray-400">A framework for managing current business operations while planning for the future. It balances efforts across three horizons: Horizon 1 (Maintain & Defend Core), Horizon 2 (Nurture Emerging Business), and Horizon 3 (Create Genuinely New).</p>;
            case 'The Value Stick':
                return <p className="text-xs text-gray-400">Visualizes the price a customer is willing to pay and the cost to the company. The difference between Willingness to Pay (WTP) and Cost is the Value Created, which is split between Customer Delight and Firm Margin.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <ChartBarIcon />
                <span>STRATEGIC FRAMEWORKS</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-4 italic">
                Visualizing the application of advanced strategic models to autonomous goal pursuit.
            </p>

            <div className="flex border-b border-gray-700/50 mb-4">
                {frameworks.map(fw => (
                    <button
                        key={fw}
                        onClick={() => setActiveTab(fw)}
                        className={`px-3 py-2 text-xs -mb-px border-b-2 transition-colors ${activeTab === fw ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        {fw}
                    </button>
                ))}
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 flex-grow">
                <h4 className="font-bold text-base text-cyan-300 mb-2">{activeTab}</h4>
                {renderContent()}
                {activeGoal && (
                    <div className="mt-4 pt-4 border-t border-cyan-500/10">
                        <p className="text-cyan-400/80 text-xs uppercase tracking-wider">Live Application</p>
                        <p className="text-yellow-300 animate-pulse">&gt; Applying <span className="font-bold">{activeTab}</span> to goal: "{activeGoal.description}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};
