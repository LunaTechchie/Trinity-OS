
import React from 'react';

interface ActionButtonProps {
  actionText: string;
  onClick: (actionText: string) => void;
  disabled: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ actionText, onClick, disabled }) => (
  <button
    onClick={() => onClick(actionText)}
    disabled={disabled}
    className="mt-3 px-4 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
  >
    <span className="text-lg">⚡</span>
    <span>{actionText}</span>
  </button>
);
