import React from 'react';

export const SpeakerIcon: React.FC<{muted?: boolean}> = ({ muted }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    {muted ? (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    )}
  </svg>
);