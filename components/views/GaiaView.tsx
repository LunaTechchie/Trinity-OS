import React from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { GlobeIcon } from '../icons/GlobeIcon';

export const GaiaView: React.FC = () => {
  const societalSymbiosisFramework = blueprint.societalSymbiosisFramework;

  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm text-gray-300">
       <style>{`
        .globe {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: #083344;
          background-size: cover;
          box-shadow: -20px -20px 50px 2px #000 inset, 0 0 20px 2px #000;
          animation: spin 30s linear infinite;
          position: relative;
          overflow: hidden;
        }
        .globe:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-shadow: -5px 5px 15px rgba(0, 255, 255, 0.2) inset;
          z-index: 2;
        }
        .globe .land {
          position: absolute;
          background: #064e3b;
          border-radius: 40%;
          box-shadow: 0 0 10px rgba(6, 78, 59, 0.8);
          animation: spin-land 30s linear infinite;
        }
        .land1 { top: 20%; left: 10%; width: 30%; height: 20%; transform: rotate(15deg); }
        .land2 { top: 50%; left: 60%; width: 40%; height: 25%; transform: rotate(-20deg); }
        .land3 { top: 60%; left: 15%; width: 50%; height: 15%; transform: rotate(5deg); }
        @keyframes spin { 100% { background-position: 100%; transform: rotate(360deg); } }
        @keyframes spin-land { 100% { transform: rotate(360deg); } }
      `}</style>
      <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
        <GlobeIcon />
        <span>SOCIETAL SYMBIOSIS MODEL</span>
      </h3>
      <p className="text-xs text-gray-400/80 mb-6 italic">
        {societalSymbiosisFramework.description}
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="flex-shrink-0">
          <div className="globe">
            <div className="land land1"></div>
            <div className="land land2"></div>
            <div className="land land3"></div>
          </div>
        </div>
        <div className="flex-grow max-w-lg">
          <h4 className="font-bold text-cyan-300 mb-3">SIMULATED DATA STREAMS</h4>
          <div className="space-y-4 text-xs">
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-cyan-400 uppercase tracking-wider">Economic Resonance</p>
                <p>Detecting patterns of emergent, decentralized economies in Southeast Asia. Projecting 15% growth in non-traditional value exchange networks.</p>
            </div>
             <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-yellow-400 uppercase tracking-wider">Cultural Memetics</p>
                <p>Tracking the 'Neo-Luddite' meme complex across Western Europe. Sentiment analysis indicates a growing desire for digital sovereignty.</p>
            </div>
             <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-purple-400 uppercase tracking-wider">Social Cohesion Index</p>
                <p>Positive trend detected in South American urban centers related to community-led green initiatives. Correlation with decreased social friction is 0.85.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
