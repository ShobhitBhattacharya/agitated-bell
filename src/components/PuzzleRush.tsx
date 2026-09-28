import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Clock3, RotateCcw, X } from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { getPuzzlePool } from '../utils/puzzleRush';
import {
  loadPuzzleRushProgress,
  recordPuzzleSolved,
  savePuzzleRushProgress,
} from '../utils/progressStorage';

interface PuzzleRushProps {
  startingRating: number;
  onExit: () => void;
}

const RUSH_SECONDS = 120;

export const PuzzleRush: React.FC<PuzzleRushProps> = ({ startingRating, onExit }) => {
  const pool = useMemo(() => {
    const shuffled = [...getPuzzlePool(startingRating)];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }, [startingRating]);
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const puzzle = pool[puzzleNumber];
  const [position, setPosition] = useState(() => new Chess(puzzle.fen));
  const [fen, setFen] = useState(puzzle.fen);
  const [moveIndex, setMoveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(RUSH_SECONDS);
  const [solved, setSolved] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('Find the best move.');
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [rushProgress, setRushProgress] = useState(loadPuzzleRushProgress);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    savePuzzleRushProgress(rushProgress);
  }, [rushProgress]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setFinished(true);
          setFeedback('Time. Rush complete.');
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
  }, []);

  const loadPuzzle = (index: number) => {
    const nextPuzzle = pool[index];
    const nextPosition = new Chess(nextPuzzle.fen);
    setPosition(nextPosition);
    setFen(nextPosition.fen());
    setMoveIndex(0);
    setLastMove(null);
    setFeedback(`Find the best move: ${nextPuzzle.theme}.`);
  };

  const finishRush = (message: string) => {
    setIsRunning(false);
    setFinished(true);
    setFeedback(message);
  };

  const handleMove = (from: Square, to: Square): boolean => {
    if (!isRunning || finished) return false;
    const target = puzzle.solution[moveIndex];
    if (!target || target.slice(0, 2) !== from || target.slice(2, 4) !== to) {
      finishRush('Not quite. That ends this rush.');
      return false;
    }

    try {
      const move = position.move({ from, to, promotion: target[4] ?? 'q' });
      if (!move) return false;
      setLastMove({ from, to });
      let nextIndex = moveIndex + 1;
      const reply = puzzle.solution[nextIndex];
      if (reply) {
        position.move({
          from: reply.slice(0, 2) as Square,
          to: reply.slice(2, 4) as Square,
          promotion: reply[4] ?? 'q',
        });
        setLastMove({ from: reply.slice(0, 2) as Square, to: reply.slice(2, 4) as Square });
        nextIndex += 1;
      }
      setMoveIndex(nextIndex);
      setFen(position.fen());

      if (nextIndex >= puzzle.solution.length) {
        const nextSolved = solved + 1;
        setSolved(nextSolved);
        setRushProgress((progress) => recordPuzzleSolved(progress, startingRating, nextSolved));
        if (puzzleNumber + 1 >= pool.length) {
          finishRush(`Pack cleared. ${nextSolved} solved.`);
        } else {
          setFeedback(`Correct. ${nextSolved} solved.`);
          const nextPuzzleNumber = puzzleNumber + 1;
          resetTimerRef.current = window.setTimeout(() => {
            setPuzzleNumber(nextPuzzleNumber);
            loadPuzzle(nextPuzzleNumber);
          }, 650);
        }
      } else {
        setFeedback('Correct. Find the continuation.');
      }
      return true;
    } catch {
      return false;
    }
  };

  const restart = () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    const fresh = new Chess(pool[0].fen);
    setPuzzleNumber(0);
    setPosition(fresh);
    setFen(fresh.fen());
    setMoveIndex(0);
    setLastMove(null);
    setSecondsLeft(RUSH_SECONDS);
    setSolved(0);
    setFinished(false);
    setFeedback('Find the best move.');
    setIsRunning(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-[#171916] text-[#eceee7]">
      <header className="border-b border-[#343a32] bg-[#1e221d]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <button onClick={onExit} className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[#dce2d4] hover:bg-[#30372d]">
            <ArrowLeft className="h-4 w-4" /> Practice hub
          </button>
          <div className="text-sm font-bold text-white">Puzzle Rush</div>
          <div className="inline-flex min-w-20 items-center justify-end gap-2 font-mono text-lg font-bold text-[#d6e7ac]">
            <Clock3 className="h-4 w-4" /> {minutes}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,620px)_1fr] lg:items-start sm:px-8">
        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#b2ca7c]">Puzzle {puzzleNumber + 1}</div>
              <div className="mt-1 text-sm text-[#9da596]">{puzzle.theme}</div>
            </div>
            <span className="rounded-md border border-[#505a48] bg-[#242b21] px-3 py-1.5 text-xs font-bold text-[#dce7c9]">~{puzzle.rating} rating</span>
          </div>
          <ChessBoard
            key={`${puzzle.id}-${puzzleNumber}-${fen}`}
            chess={position}
            orientation={position.turn()}
            theme="chesscom"
            interactive={isRunning && !finished}
            showLegalMoves
            lastMove={lastMove}
            onMove={handleMove}
            onRequestPromotion={(from, to) => handleMove(from, to)}
          />
          <div className="mt-3 flex min-h-12 items-center gap-2 rounded-md border border-[#343a32] bg-[#222720] px-4 py-3 text-sm text-[#d8dfd1]" aria-live="polite">
            {feedback.startsWith('Correct') ? <Check className="h-4 w-4 text-[#b2ca7c]" /> : finished ? <X className="h-4 w-4 text-[#e49a84]" /> : null}
            {feedback}
          </div>
        </section>

        <aside className="space-y-5 lg:pt-9">
          <section className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#343a32] bg-[#343a32]">
            <div className="bg-[#222720] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9da596]">This rush</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{solved}</div>
            </div>
            <div className="bg-[#222720] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9da596]">Best · {startingRating}</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{rushProgress.bestByRating[String(startingRating)] ?? 0}</div>
            </div>
            <div className="bg-[#222720] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9da596]">Lifetime</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{rushProgress.totalSolved}</div>
            </div>
          </section>
          {finished ? (
            <button onClick={restart} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#b2ca7c] px-4 py-3 text-sm font-extrabold text-[#20251b] hover:bg-[#c4d894]">
              <RotateCcw className="h-4 w-4" /> Run it back
            </button>
          ) : (
            <button onClick={() => finishRush('Rush ended.')} className="w-full rounded-md border border-[#4b5247] px-4 py-3 text-sm font-semibold text-[#c4cbbd] hover:bg-[#292f27]">
              End rush
            </button>
          )}
          <p className="border-l-2 border-[#657455] pl-3 text-xs leading-5 text-[#9da596]">
            Puzzle Rush draws from a curated, rated sample. Each puzzle has its own source rating and theme tags.
          </p>
          <p className="text-[11px] leading-5 text-[#788071]">
            Themes: {puzzle.themes.join(', ')}<br />
            Rating source: Lichess CC0 · <a className="underline decoration-[#788071] underline-offset-2 hover:text-white" href={puzzle.sourceUrl} target="_blank" rel="noreferrer">Puzzle</a>
            {' · '}<a className="underline decoration-[#788071] underline-offset-2 hover:text-white" href={puzzle.gameUrl} target="_blank" rel="noreferrer">Source game</a>
          </p>
        </aside>
      </main>
    </div>
  );
};
