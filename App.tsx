import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Candidate, PollResults } from './types';
import CandidateCard from './components/CandidateCard';
import ResultsChart from './components/ResultsChart';
import Footer from './components/Footer';
import { getVotedStatus, setVotedStatus } from './db';

const CANDIDATES: Candidate[] = [
  { id: 1, name: 'محمد الزيادي' },
  { id: 2, name: 'السيد الحديدي' },
  { id: 3, name: 'عمرو خطاب' },
];

const getPollEndDate = (): Date => {
  const today = new Date();
  const friday = 5; // 0=Sunday, 5=Friday
  const daysUntilFriday = (friday - today.getDay() + 7) % 7;
  const pollEndDate = new Date(today.valueOf());
  pollEndDate.setDate(today.getDate() + daysUntilFriday);
  pollEndDate.setHours(23, 59, 59, 999); // End of Friday
  return pollEndDate;
};

const POLL_CLOSE_DATE = getPollEndDate();
const STREAM_URL = 'https://n0e.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABjW7yROAA0TUU8cXhXIAi6g';

const getStoredResults = (): PollResults => {
  try {
    const storedResults = localStorage.getItem('poll_results');
    if (storedResults) {
      const parsed = JSON.parse(storedResults);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        // Ensure all candidates have a valid numeric entry
        CANDIDATES.forEach(c => {
          if (typeof parsed[c.id] !== 'number') {
            parsed[c.id] = 0;
          }
        });
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse stored results, resetting.", error);
  }

  // Return initial state if anything fails
  const initialResults: PollResults = {};
  CANDIDATES.forEach(c => initialResults[c.id] = 0);
  localStorage.setItem('poll_results', JSON.stringify(initialResults));
  return initialResults;
};

const App: React.FC = () => {
  const [results, setResults] = useState<PollResults>(getStoredResults);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isPollClosed] = useState<boolean>(() => new Date() > POLL_CLOSE_DATE);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const votedInLocalStorage = localStorage.getItem('poll_hasVoted') === 'true';
        const votedInDB = await getVotedStatus();

        if (votedInLocalStorage || votedInDB) {
          setHasVoted(true);
          // Sync stores if there's a mismatch
          if (!votedInLocalStorage) localStorage.setItem('poll_hasVoted', 'true');
          if (!votedInDB) await setVotedStatus(true);
        }
      } catch (error) {
        console.error("Failed to check voting status from IndexedDB, falling back to localStorage.", error);
        if (localStorage.getItem('poll_hasVoted') === 'true') {
          setHasVoted(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkVoteStatus();
  }, []);

  useEffect(() => {
    let currentVisitors = parseInt(localStorage.getItem('poll_visitorCount') || '0', 10);
    if(isNaN(currentVisitors)) currentVisitors = 0;

    if (!localStorage.getItem('poll_hasVisited')) {
      currentVisitors += 1;
      localStorage.setItem('poll_visitorCount', currentVisitors.toString());
      localStorage.setItem('poll_hasVisited', 'true');
    }
    setVisitorCount(currentVisitors);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    const audio = audioRef.current;
    
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    
    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [isPlaying]);

  const handleVote = async (candidateId: number) => {
    if (hasVoted || isPollClosed) return;

    const newResults = {
      ...results,
      [candidateId]: (results[candidateId] || 0) + 1,
    };
    
    setResults(newResults);
    localStorage.setItem('poll_results', JSON.stringify(newResults));
    
    setHasVoted(true);
    localStorage.setItem('poll_hasVoted', 'true');
    try {
      await setVotedStatus(true);
    } catch (error) {
      console.error("Failed to set voted status in IndexedDB:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <h1 className="text-3xl font-bold animate-pulse">جاري التحقق من حالة التصويت...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20 pt-4">
        <div className="w-full text-center py-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">مصلحة نبروة اولا</h1>
        </div>
      </div>

      <header className="sticky top-0 z-10 w-full bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="w-full text-center py-3 px-4">
          <p className="text-gray-400 text-base">اختر المرشح الذي تراه الأنسب</p>
          {isPollClosed ? (
              <p className="text-red-500 mt-2 text-lg font-semibold">تم إغلاق الاستفتاء</p>
          ) : (
              <p className="text-yellow-500 mt-2 text-lg font-semibold">يغلق الاستفتاء يوم الجمعة القادم</p>
          )}
        </div>
      </header>

      <main className="w-full flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          {(hasVoted || isPollClosed) ? (
            <ResultsChart results={results} candidates={CANDIDATES} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
              {CANDIDATES.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onVote={() => handleVote(candidate.id)}
                  disabled={hasVoted || isPollClosed}
                />
              ))}
            </div>
          )}
      </main>

      <div className="sticky bottom-0 z-10 w-full bg-gray-900/80 backdrop-blur-sm border-t border-cyan-500/20">
        <Footer 
          visitorCount={visitorCount}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        />
      </div>
    </div>
  );
};

export default App;