import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PieceColor, BoardTheme } from '../types/chess';
import { soundEngine } from '../utils/audio';

interface CoordinateTrainerProps {
  onExit: () => void;
  boardTheme?: BoardTheme;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const getRandomCoordinate = (): string => {
  const file = FILES[Math.floor(Math.random() * FILES.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  return `${file}${rank}`;
};

export const CoordinateTrainer: React.FC<CoordinateTrainerProps> = ({
  onExit,
  boardTheme = 'chesscom',
}) => {
  const [orientation, setOrientation] = useState<PieceColor>('w');
  const [targetSquare, setTargetSquare] = useState<string>(getRandomCoordinate);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('chess-coordinate-highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDrill = useCallback(() => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsActive(true);
    setLastFeedback(null);
    setTargetSquare(getRandomCoordinate());
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Update high score on game over
  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('chess-coordinate-highscore', score.toString());
      } catch {
        // ignore
      }
    }
  }, [isGameOver, score, highScore]);

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (!isActive) {
      if (!isGameOver) startDrill();
      return;
    }

    if (square === targetSquare) {
      // Correct!
      soundEngine.playMove();
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setLastFeedback('correct');

      let nextCoord = getRandomCoordinate();
      while (nextCoord === targetSquare) {
        nextCoord = getRandomCoordinate();
      }
      setTargetSquare(nextCoord);
    } else {
      // Wrong square
      soundEngine.playCapture();
      setStreak(0);
      setLastFeedback('wrong');
    }
  };

  const filesToRender = orientation === 'w' ? FILES : [...FILES].reverse();
  const ranksToRender = orientation === 'w' ? [...RANKS].reverse() : RANKS;

  return (
    <div className="min-h-screen bg-[#161512] text-neutral-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <header className="h-14 border-b border-[#2b2723] bg-[#21201d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              Coordinate Vision Trainer
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#312e2b] text-amber-400 border border-amber-500/30 uppercase">
                30s Speed Drill
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Master square coordinates with lightning reflexes</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
            disabled={isActive}
            className="px-2.5 py-1.5 rounded-lg border border-[#312e2b] bg-[#2a2824] hover:bg-[#36332e] text-xs font-semibold text-neutral-300 disabled:opacity-40 transition"
            title="Flip Orientation"
          >
            Flip ({orientation.toUpperCase()})
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-[#312e2b] hover:bg-[#3d3a34] text-xs font-bold text-white transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Exit Drill</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center space-y-5">
        {/* Target Coordinate Banner */}
        <div className="w-full max-w-[540px] flex items-center justify-between p-4 rounded-2xl bg-[#21201d] border border-[#312e2b] shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-neutral-400 font-bold text-xs uppercase tracking-wider">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Time:</span>
              <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Active Target Banner */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Find Square</span>
            <div
              className={`text-3xl sm:text-4xl font-black transition-transform duration-100 ${
                lastFeedback === 'correct'
                  ? 'text-emerald-400 scale-110'
                  : lastFeedback === 'wrong'
                  ? 'text-rose-400 scale-95'
                  : 'text-amber-400'
              }`}
            >
              {isActive ? targetSquare : '—'}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-right">
            <div>
              <div className="text-[10px] font-bold uppercase text-neutral-400">Score</div>
              <div className="text-2xl font-black text-white">{score}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-neutral-400">Streak</div>
              <div className="text-2xl font-black text-[#81b64c]">{streak}</div>
            </div>
          </div>
        </div>

        {/* Board Component (Coordinates Hidden on Squares for True Mastery) */}
        <div className="relative aspect-square w-full max-w-[540px] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-8 grid-rows-8 border-4 border-[#2b2723] select-none">
          {ranksToRender.map((rank, rankIdx) =>
            filesToRender.map((file, fileIdx) => {
              const sq = `${file}${rank}`;
              const fileNum = file.charCodeAt(0) - 97;
              const rankNum = parseInt(rank, 10) - 1;
              const isLight = (fileNum + rankNum) % 2 !== 0;

              return (
                <div
                  key={sq}
                  onClick={() => handleSquareClick(sq)}
                  className={`flex items-center justify-center cursor-pointer transition-colors duration-100 ${
                    isLight ? 'bg-[#ebecd0] hover:bg-[#d8d9b8]' : 'bg-[#779556] hover:bg-[#688448]'
                  }`}
                />
              );
            })
          )}

          {/* Start / Game Over Overlay */}
          {!isActive && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
              {isGameOver ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Time's Up!</h2>
                    <p className="text-sm text-neutral-300 mt-1">
                      You identified <strong className="text-amber-400 font-extrabold">{score}</strong> squares in 30 seconds!
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Best Streak: {bestStreak} • High Score: {highScore}
                    </p>
                  </div>
                  <button
                    onClick={startDrill}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 transition active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Coordinate Vision Test</h2>
                    <p className="text-xs text-neutral-300 max-w-xs mt-1">
                      Target squares will appear at the top. Click the matching square on the board as fast as possible within 30 seconds!
                    </p>
                  </div>
                  <button
                    onClick={startDrill}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm shadow-xl flex items-center gap-2 transition active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Start 30s Challenge</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
