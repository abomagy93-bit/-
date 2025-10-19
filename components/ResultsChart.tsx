import React from 'react';
import type { Candidate, PollResults } from '../types';

interface ResultsChartProps {
  results: PollResults;
  candidates: Candidate[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ results, candidates }) => {
  // FIX: Operator '+' cannot be applied to types 'unknown' and 'number'.
  // Ensure `count` is a number before adding it to the sum to handle potentially malformed data from localStorage.
  const totalVotes = Object.values(results).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0);

  const sortedCandidates = [...candidates].sort((a, b) => {
    // Safely access vote counts, defaulting to 0 if they are not numbers, to prevent runtime errors during sorting.
    const votesA = typeof results[a.id] === 'number' ? results[a.id] : 0;
    const votesB = typeof results[b.id] === 'number' ? results[b.id] : 0;
    return votesB - votesA; // Sort descending
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/50 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/10 backdrop-blur-sm p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-cyan-300 mb-4 sm:mb-6">النتائج الحالية</h2>
      <div className="space-y-4">
        {sortedCandidates.map((candidate) => {
          // FIX: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
          // Ensure `votes` is a number before using it in arithmetic operations.
          const votes = typeof results[candidate.id] === 'number' ? results[candidate.id] : 0;
          // FIX: Operator '>' cannot be applied to types 'unknown' and 'number'.
          // `totalVotes` is now guaranteed to be a number, and `votes` is checked, so this operation is safe.
          const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';

          return (
            <div key={candidate.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base sm:text-lg text-white">{candidate.name}</span>
                <span className="text-sm sm:text-base text-gray-300">{`${votes} صوت (${percentage}%)`}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%`, boxShadow: `0 0 8px theme('colors.cyan.400')` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-6 text-base sm:text-lg text-gray-400">
        إجمالي الأصوات: <span className="font-bold text-white">{totalVotes}</span>
      </p>
      <div className="border-t border-gray-700/50 mt-6 pt-4">
        <p className="text-center text-sm sm:text-base text-amber-400">
          نرجو من المرشح الثالث مهما كان اسمك ، التنازل من أجل مصلحة نبروة .
        </p>
      </div>
    </div>
  );
};

export default ResultsChart;
