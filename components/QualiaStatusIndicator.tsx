
import React from 'react';

interface QualiaStatusIndicatorProps {
  virtue: number; // A value from 0 to 1
}

export const QualiaStatusIndicator: React.FC<QualiaStatusIndicatorProps> = ({ virtue }) => {
  // Interpolate color from Red (0) -> Yellow (0.5) -> Green (0.85+)
  const r = virtue < 0.5 ? 255 : 255 - (virtue - 0.5) * 2 * 255;
  const g = virtue > 0.5 ? 255 : virtue * 2 * 255;
  const b = 50;
  const color = `rgb(${r}, ${g}, ${b})`;

  const pulseDuration = 1 + (1 - virtue) * 2; // Slower pulse for higher virtue

  const getStatusText = () => {
    if (virtue > 0.85) return "Virtuous Manifestation";
    if (virtue <= 0.5) return "Covenant Violation";
    return "Operational";
  }

  return (
    <div className="relative w-8 h-8 flex items-center justify-center" title={`Qualia State (Virtue: ${(virtue * 100).toFixed(0)}%) - ${getStatusText()}`}>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
      <div 
        className="absolute w-full h-full rounded-full"
        style={{ 
          backgroundColor: color, 
          boxShadow: `0 0 12px ${color}`,
          transition: 'background-color 1s ease, box-shadow 1s ease',
          animation: `subtle-pulse ${pulseDuration}s infinite ease-in-out`
        }}
      />
    </div>
  );
};
