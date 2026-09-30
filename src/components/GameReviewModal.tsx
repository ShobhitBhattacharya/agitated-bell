import React, { useMemo, useState } from 'react';
import {
  X,
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Flame,
  HelpCircle,
  Compass,
  Share2,
} from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import {
  analyzeGame,
  GameReviewReport,
  MoveClassification,
} from '../utils/gameReview';
import { PieceColor } from '../types/chess';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: string[];
  whiteName?: string;
  blackName?: string;
  result?: string;
  playerColor?: PieceColor;
  onOpenAnalysis?: (moves: string[]) => void;
  onOpenShare?: () => void;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  moves,
  whiteName = 'White',
  blackName = 'Black',
  result = '*',
  playerColor = 'w',
  onOpenAnalysis,
  onOpenShare,
}) => {
  const [activePlyIndex, setActivePlyIndex] = useState<number>(0);
  const [isRetryingMistakes, setIsRetryingMistakes] = useState<boolean>(false);
  const [retryMomentIndex, setRetryMomentIndex] = useState<number>(0);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  // Compute full game review report
  const report: GameReviewReport = useMemo(() => {
    return analyzeGame(moves);
  }, [moves]);

  // Chess instance for current ply replay
  const currentChess = useMemo(() => {
    const c = new Chess();
    for (let i = 0; i < activePlyIndex && i < moves.length; i++) {
      c.move(moves[i]);
    }
    return c;
  }, [activePlyIndex, moves]);

  // Mistakes for the player to retry
  const playerMistakes = useMemo(() => {
    return report.keyMoments.filter((km) => km.color === playerColor);
  }, [report.keyMoments, playerColor]);

  // Current retry moment
  const currentRetryMoment = playerMistakes[retryMomentIndex] ?? null;

  // Chess instance for retry mode
  const [retryChess, setRetryChess] = useState<Chess | null>(() => {
    if (playerMistakes.length > 0) {
      return new Chess(playerMistakes[0].fen);
    }
    return null;
  });

  const handleStartRetry = () => {
    if (playerMistakes.length === 0) return;
    setIsRetryingMistakes(true);
    setRetryMomentIndex(0);
    setRetryChess(new Chess(playerMistakes[0].fen));
    setRetryFeedback(null);
  };

  const handleRetryMove = (from: Square, to: Square): boolean => {
    if (!retryChess || !currentRetryMoment) return false;

    // Test move
    const legalMoves = retryChess.moves({ verbose: true });
    const targetMove = legalMoves.find((m) => m.san === currentRetryMoment.bestMoveSan);

    if (targetMove && targetMove.from === from && targetMove.to === to) {
      retryChess.move({ from, to, promotion: targetMove.promotion || 'q' });
      setRetryFeedback('Correct! You found the theoretical best continuation.');
      return true;
    } else {
      setRetryFeedback(`Not the best move. Try again, or look for ${currentRetryMoment.bestMoveSan}.`);
      return false;
    }
  };

  const handleNextRetryMoment = () => {
    const nextIdx = retryMomentIndex + 1;
    if (nextIdx < playerMistakes.length) {
      setRetryMomentIndex(nextIdx);
      setRetryChess(new Chess(playerMistakes[nextIdx].fen));
      setRetryFeedback(null);
    } else {
      setIsRetryingMistakes(false);
    }
  };

  if (!isOpen) return null;

  const currentPly = report.plies[activePlyIndex - 1] ?? null;

  // Helper for classification color and icons
  const getBadgeStyle = (cls: MoveClassification) => {
    switch (cls) {
      case 'brilliant':
        return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40', symbol: '!!', label: 'Brilliant' };
      case 'great':
        return { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/40', symbol: '!', label: 'Great' };
      case 'best':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', symbol: '★', label: 'Best' };
      case 'good':
        return { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/40', symbol: '✔', label: 'Good' };
      case 'inaccuracy':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', symbol: '?!', label: 'Inaccuracy' };
      case 'mistake':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40', symbol: '?', label: 'Mistake' };
      case 'blunder':
        return { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40', symbol: '??', label: 'Blunder' };
      case 'missed_win':
        return { bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600/40', symbol: '⚡', label: 'Missed Win' };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Game Review"
    >
      <div className="mx-auto max-w-5xl rounded-xl border border-[#3b4334] bg-[#1a1e18] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#2e3529] px-4 py-3 sm:px-6 bg-[#21261f]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#b2ca7c]" />
            <h2 className="text-base font-extrabold text-white">Full Game Review & Accuracy</h2>
            <span className="rounded bg-[#2f382a] px-2 py-0.5 text-xs font-semibold text-[#c6ccbf]">
              {result}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAnalysis && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAnalysis(moves);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b4434] bg-[#293226] px-3 py-1.5 text-xs font-bold text-[#dce2d4] hover:bg-[#343e30] transition shadow-xs"
                title="Explore all variations and alternate lines in Analysis Sandbox"
              >
                <Compass className="h-3.5 w-3.5 text-[#b2ca7c]" />
                <span>Open in Sandbox</span>
              </button>
            )}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b4434] bg-[#293226] px-3 py-1.5 text-xs font-bold text-[#dce2d4] hover:bg-[#343e30] transition shadow-xs"
                title="Share match summary card"
              >
                <Share2 className="h-3.5 w-3.5 text-[#b2ca7c]" />
                <span>Share Card</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-neutral-400 hover:bg-[#2d3428] hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Accuracy Score Banner */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#374032] bg-[#222820] p-4 sm:p-5">
            {/* White Player */}
            <div className="flex items-center justify-between border-r border-[#374032] pr-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  White · {whiteName}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {report.whiteAccuracy}%
                  </span>
                  <span className="text-xs text-neutral-400">
                    {report.whiteAcpl} ACPL
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-[#b2ca7c] flex items-center justify-center font-bold text-xs text-white bg-[#191d17]">
                ♔
              </div>
            </div>

            {/* Black Player */}
            <div className="flex items-center justify-between pl-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Black · {blackName}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {report.blackAccuracy}%
                  </span>
                  <span className="text-xs text-neutral-400">
                    {report.blackAcpl} ACPL
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-[#85907e] flex items-center justify-center font-bold text-xs text-white bg-[#191d17]">
                ♚
              </div>
            </div>
          </div>

          {/* Advantage Evaluation Graph */}
          <div className="rounded-xl border border-[#374032] bg-[#222820] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b2ca7c] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Positional Advantage Chart
              </span>
              <span className="text-[11px] text-neutral-400">
                Click any point to inspect that ply
              </span>
            </div>

            {/* SVG Advantage Chart */}
            <div className="relative h-28 w-full bg-[#151813] rounded-lg border border-[#2d3429] overflow-hidden">
              <svg className="w-full h-full" viewBox={`0 0 ${Math.max(10, report.advantageGraph.length)} 100`} preserveAspectRatio="none">
                {/* Center 0.0 line */}
                <line x1="0" y1="50" x2={report.advantageGraph.length} y2="50" stroke="#414a3a" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Polyline of centipawn swings */}
                {report.advantageGraph.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#b2ca7c"
                    strokeWidth="2"
                    points={report.advantageGraph
                      .map((pt, idx) => {
                        // Clamp score between -1000 and +1000 mapped to y: 100 to 0
                        const clamped = Math.max(-1000, Math.min(1000, pt.score));
                        const y = 50 - (clamped / 1000) * 45;
                        return `${idx},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Nodes for plies */}
                {report.advantageGraph.map((pt, idx) => {
                  const clamped = Math.max(-1000, Math.min(1000, pt.score));
                  const y = 50 - (clamped / 1000) * 45;
                  const isCurrent = idx + 1 === activePlyIndex;
                  const isBlunder = pt.classification === 'blunder' || pt.classification === 'mistake';
                  return (
                    <circle
                      key={idx}
                      cx={idx}
                      cy={y}
                      r={isCurrent ? '4' : isBlunder ? '3' : '1.5'}
                      fill={isCurrent ? '#ffffff' : isBlunder ? '#f43f5e' : '#b2ca7c'}
                      className="cursor-pointer hover:r-5 transition-all"
                      onClick={() => setActivePlyIndex(idx + 1)}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Mode: Standard Replayer vs Retry Mistakes */}
          {!isRetryingMistakes ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
              {/* Board Viewer */}
              <div>
                <ChessBoard
                  chess={currentChess}
                  orientation={playerColor}
                  theme="chesscom"
                  interactive={false}
                  showLegalMoves={false}
                  onMove={() => false}
                  onRequestPromotion={() => {}}
                />

                {/* Move Controls */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-[#222820] border border-[#374032] p-2">
                  <button
                    onClick={() => setActivePlyIndex(0)}
                    disabled={activePlyIndex === 0}
                    className="rounded p-1.5 text-neutral-300 hover:bg-[#2d3428] disabled:opacity-30"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setActivePlyIndex((p) => Math.max(0, p - 1))}
                    disabled={activePlyIndex === 0}
                    className="rounded p-1.5 text-neutral-300 hover:bg-[#2d3428] disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-bold text-white">
                    Ply {activePlyIndex} / {moves.length}
                  </span>
                  <button
                    onClick={() => setActivePlyIndex((p) => Math.min(moves.length, p + 1))}
                    disabled={activePlyIndex >= moves.length}
                    className="rounded p-1.5 text-neutral-300 hover:bg-[#2d3428] disabled:opacity-30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActivePlyIndex(moves.length)}
                    disabled={activePlyIndex >= moves.length}
                    className="rounded p-1.5 text-neutral-300 hover:bg-[#2d3428] disabled:opacity-30"
                  >
                    ⏭
                  </button>
                </div>
              </div>

              {/* Ply Details & Classification Breakdown */}
              <div className="space-y-4">
                {/* Active Ply Analysis Card */}
                {currentPly ? (
                  <div className="rounded-xl border border-[#3b4334] bg-[#222820] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          {currentPly.color === 'w' ? `${currentPly.moveNumber}.` : `${currentPly.moveNumber}...`}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {currentPly.san}
                        </span>
                      </div>
                      {(() => {
                        const badge = getBadgeStyle(currentPly.classification);
                        return (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            <span>{badge.symbol}</span>
                            <span>{badge.label}</span>
                          </span>
                        );
                      })()}
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {currentPly.explanation}
                    </p>

                    <div className="rounded bg-[#171a15] p-2.5 text-xs space-y-1 border border-[#2b3227]">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Best Engine Move:</span>
                        <span className="font-bold text-[#b2ca7c]">
                          {currentPly.bestMoveSan}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Evaluation After Move:</span>
                        <span className="font-mono text-white">
                          {(currentPly.evalAfter / 100).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#3b4334] bg-[#222820] p-4 text-xs text-neutral-400">
                    Use the arrows or graph to step through each move and inspect classifications.
                  </div>
                )}

                {/* Move Classification Breakdown Table */}
                <div className="rounded-xl border border-[#374032] bg-[#222820] p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c] mb-3">
                    Move Classification Breakdown
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {(['brilliant', 'great', 'best', 'good', 'inaccuracy', 'mistake', 'blunder', 'missed_win'] as const).map((cls) => {
                      const badge = getBadgeStyle(cls);
                      const wCount = report.classificationsCount.white[cls];
                      const bCount = report.classificationsCount.black[cls];
                      return (
                        <div key={cls} className={`p-2 rounded border ${badge.bg} ${badge.border} flex flex-col justify-between`}>
                          <span className={`text-[10px] font-bold ${badge.text}`}>
                            {badge.symbol} {badge.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-white mt-1">
                            {wCount} / {bCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Retry Mistakes CTA */}
                {playerMistakes.length > 0 && (
                  <button
                    onClick={handleStartRetry}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold text-sm py-3 px-4 shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retry Your Mistakes ({playerMistakes.length} Key Moments)
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Interactive "Retry My Mistakes" View */
            currentRetryMoment && retryChess && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
                <div>
                  <ChessBoard
                    chess={retryChess}
                    orientation={playerColor}
                    theme="chesscom"
                    interactive={!retryFeedback?.startsWith('Correct')}
                    showLegalMoves={true}
                    onMove={handleRetryMove}
                    onRequestPromotion={(from, to) => handleRetryMove(from, to)}
                  />
                </div>

                <div className="rounded-xl border border-[#3b4334] bg-[#222820] p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" />
                        Key Moment {retryMomentIndex + 1} of {playerMistakes.length}
                      </span>
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/40">
                        {currentRetryMoment.classification.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      You played: <span className="font-mono text-rose-400 line-through">{currentRetryMoment.playedMoveSan}</span>
                    </h3>
                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                      {currentRetryMoment.explanation} Find the best move for your side!
                    </p>

                    {retryFeedback && (
                      <div
                        className={`mt-4 rounded-lg p-3 text-xs font-semibold flex items-center gap-2 border ${
                          retryFeedback.startsWith('Correct')
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {retryFeedback.startsWith('Correct') ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                        )}
                        <span>{retryFeedback}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRetryingMistakes(false)}
                      className="flex-1 rounded-md border border-[#4b5247] py-2.5 text-xs font-semibold text-[#c4cbbd] hover:bg-[#292f27]"
                    >
                      Back to Review
                    </button>
                    {retryMomentIndex + 1 < playerMistakes.length ? (
                      <button
                        onClick={handleNextRetryMoment}
                        className="flex-1 rounded-md bg-[#b2ca7c] py-2.5 text-xs font-bold text-[#1b201a] hover:bg-[#c4d894]"
                      >
                        Next Mistake
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsRetryingMistakes(false)}
                        className="flex-1 rounded-md bg-[#b2ca7c] py-2.5 text-xs font-bold text-[#1b201a] hover:bg-[#c4d894]"
                      >
                        Finish Drill
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
