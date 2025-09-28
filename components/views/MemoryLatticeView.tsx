import React, { useMemo, useRef, useEffect, useState } from 'react';
import { ConversationTurn } from '../../types';
import { NexusIcon } from '../icons/NexusIcon';
import { MEMORY_FRAMEWORK_MANIFEST } from '../../protocols/memory-framework';

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'and', 'or', 'but', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'who', 'when', 'where', 'why', 'how', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'to', 'of', 'for', 'with', 'by']);

interface Entity {
    name: string;
    count: number;
    pos: { top: number; left: number };
}

export const MemoryLatticeView: React.FC<{ conversation: ConversationTurn[] }> = ({ conversation }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    
    const extractedEntities = useMemo(() => {
        const entityCount: { [key: string]: number } = {};
        
        conversation.forEach(turn => {
            const regex = /\b([A-Z]{2,})\b|\b([A-Z][a-z]+)\b|`([^`]+)`/g;
            const matches = turn.text.match(regex);
            
            if (matches) {
                matches.forEach(match => {
                    const entity = match.replace(/`/g, '').toLowerCase();
                    if (!STOP_WORDS.has(entity) && isNaN(Number(entity))) {
                        entityCount[entity] = (entityCount[entity] || 0) + 1;
                    }
                });
            }
        });

        return Object.entries(entityCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 20)
            .map(([name, count]): Entity => ({ 
                name, 
                count, 
                pos: { top: 15 + Math.random() * 70, left: 15 + Math.random() * 70 } 
            }));

    }, [conversation]);

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
            <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
                <NexusIcon />
                <span>{MEMORY_FRAMEWORK_MANIFEST.codename}</span>
            </h3>
            <p className="text-xs text-gray-400/80 mb-6 italic">
                {MEMORY_FRAMEWORK_MANIFEST.mandate} Key entities and concepts are extracted from our dialogue to form an evolving web of shared understanding.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {MEMORY_FRAMEWORK_MANIFEST.framework_components.map(comp => (
                    <div key={comp.name} className="bg-gray-800/30 p-2 rounded-md border border-gray-700/50">
                        <p className="font-bold text-cyan-300/80 text-xs">{comp.name}</p>
                        <p className="text-gray-400 text-[10px] leading-tight">{comp.outcome}</p>
                    </div>
                ))}
            </div>
            <div ref={containerRef} className="flex-grow bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 relative overflow-hidden">
                {extractedEntities.length > 0 ? (
                    <div className="relative w-full h-full">
                         <svg width="100%" height="100%" className="absolute top-0 left-0 z-0">
                            {extractedEntities.map((entity, index) => (
                                <line
                                    key={`line-${entity.name}-${index}`}
                                    x1="50%"
                                    y1="50%"
                                    x2={`${entity.pos.left}%`}
                                    y2={`${entity.pos.top}%`}
                                    stroke="rgba(6, 182, 212, 0.2)"
                                    strokeWidth="1"
                                />
                            ))}
                        </svg>
                         <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-600/50 rounded-full flex items-center justify-center text-xs border-2 border-cyan-400/70"
                        >
                            DIALOGUE CORE
                        </div>
                         {extractedEntities.map((entity, index) => {
                            const size = 60 + entity.count * 15;
                            const maxCount = Math.max(...extractedEntities.map(e => e.count), 1);
                            const opacity = 0.5 + (entity.count / maxCount) * 0.5;

                            return (
                                <div
                                    key={entity.name}
                                    className="absolute bg-cyan-500/20 text-cyan-200 rounded-full flex items-center justify-center p-2 border border-cyan-500/30 animate-fade-in z-10"
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        top: `${entity.pos.top}%`,
                                        left: `${entity.pos.left}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: `${10 + entity.count * 1}px`,
                                        opacity: opacity,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    {entity.name}
                                </div>
                            );
                         })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Awaiting dialogue to build memory lattice...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
