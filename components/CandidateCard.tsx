import React from 'react';
import type { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (id: number) => void;
  disabled: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, disabled }) => {
  return (
    <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/10 backdrop-blur-sm transform transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50 hover:scale-105 flex flex-col items-center justify-between p-4 space-y-3">
      <h3 className="text-lg font-bold text-cyan-300 text-center">{candidate.name}</h3>
      <button
        onClick={() => onVote(candidate.id)}
        disabled={disabled}
        className="w-full max-w-xs bg-cyan-500/20 text-cyan-300 font-bold text-sm py-1.5 px-3 rounded-lg border border-cyan-500 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed"
      >
        انتخب
      </button>
    </div>
  );
};

export default CandidateCard;