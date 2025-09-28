

import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

interface ThinkingDisplayProps {
    loadingMessage: string;
}

const cyclicalProcess = ["Examining", "Questioning", "Polarizing", "Taking Multiple Perspectives", "Modeling", "Evaluating"];
const creativeTechniques = ["Lateral Thinking", "Brainstorming", "Mind Mapping", "Six Thinking Hats", "Analyzing Methods"];


export const ThinkingDisplay: React.FC<ThinkingDisplayProps> = ({ loadingMessage }) => {
    const [subProcess, setSubProcess] = useState('');
    const subProcessIntervalRef = useRef<number | null>(null);

    useEffect(() => {
       subProcessIntervalRef.current = window.setInterval(() => {
            const cycle = cyclicalProcess[Math.floor(Math.random() * cyclicalProcess.length)];
            const tech = creativeTechniques[Math.floor(Math.random() * creativeTechniques.length)];
            setSubProcess(`(${cycle} / ${tech})`);
        }, 800);
        
        return () => {
            if (subProcessIntervalRef.current) {
                clearInterval(subProcessIntervalRef.current);
            }
        }
    }, [])

    return (
        <div className="w-full">
            <div className="flex items-center gap-2">
                <LoadingSpinnerIcon />
                <div className="flex flex-col">
                    <span className="text-cyan-400/80 text-sm animate-pulse">{loadingMessage}</span>
                    <span className="text-cyan-500/60 text-xs animate-pulse">{subProcess}</span>
                </div>
            </div>
        </div>
    )
}