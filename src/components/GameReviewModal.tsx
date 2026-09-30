import React, { useMemo, useState, useEffect } from 'react';
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
  Lightbulb,
} from 'lucide-react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import { ChessBoard } from './ChessBoard';
import {
  analyzeGameProgressive,
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
  const [showRefutationPly, setShowRefutationPly] = useState<number | null>(null);
  const [retryHint, setRetryHint] = useState<string | null>(null);
  const [showRetryRefutation, setShowRetryRefutation] = useState<boolean>(false);

  const [report, setReport] = useState<GameReviewReport | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setReport(null);
      setAnalysisProgress(0);
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setActivePlyIndex(0);
    setIsRetryingMistakes(false);
    setRetryMomentIndex(0);
    setRetryFeedback(null);
    setShowRefutationPly(null);
    setRetryHint(null);
    setShowRetryRefutation(false);

    const cancel = analyzeGameProgressive(
      moves,
      (pct) => setAnalysisProgress(pct),
      (completedReport) => {
        setReport(completedReport);
        setIsAnalyzing(false);
      }
    );

    return () => {
      cancel();
    };
  }, [isOpen, moves]);

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
    if (!report) return [];
    return report.keyMoments.filter((km) => km.color === playerColor);
  }, [report, playerColor]);

  // Current retry moment
  const currentRetryMoment = playerMistakes[retryMomentIndex] ?? null;

  // Chess instance for retry mode
  const [retryChess, setRetryChess] = useState<Chess | null>(null);

  useEffect(() => {
    if (playerMistakes.length > 0) {
      setRetryChess(new Chess(playerMistakes[0].fen));
      setRetryMomentIndex(0);
    } else {
      setRetryChess(null);
    }
  }, [playerMistakes]);

  const handleStartRetry = () => {
    if (playerMistakes.length === 0) return;
    setIsRetryingMistakes(true);
    setRetryMomentIndex(0);
    setRetryChess(new Chess(playerMistakes[0].fen));
    setRetryFeedback(null);
    setRetryHint(null);
    setShowRetryRefutation(false);
  };

  const handleRevealRetryHint = () => {
    if (!retryChess || !currentRetryMoment) return;
    const legalMoves = retryChess.moves({ verbose: true });
    const targetMove = legalMoves.find((m) => m.san === currentRetryMoment.bestMoveSan);
    if (targetMove) {
      const pieceName =
        targetMove.piece === 'p'
          ? 'Pawn'
          : targetMove.piece === 'n'
          ? 'Knight'
          : targetMove.piece === 'b'
          ? 'Bishop'
          : targetMove.piece === 'r'
          ? 'Rook'
          : targetMove.piece === 'q'
          ? 'Queen'
          : 'King';
      setRetryHint(`Hint: Look for a key move with your ${pieceName} from square ${targetMove.from.toUpperCase()}!`);
    } else {
      setRetryHint(`Hint: Move begins on square ${currentRetryMoment.bestMoveSan.slice(0, 2).toUpperCase()}`);
    }
  };

  const handleRetryMove = (from: Square, to: Square): boolean => {
    if (!retryChess || !currentRetryMoment) return false;

    // Test move
    const legalMoves = retryChess.moves({ verbose: true });
    const targetMove = legalMoves.find((m) => m.san === currentRetryMoment.bestMoveSan);

    if (targetMove && targetMove.from === from && targetMove.to === to) {
      retryChess.move({ from, to, promotion: targetMove.promotion || 'q' });
      setRetryFeedback('Correct! You found the theoretical best continuation.');
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch {
        // non-fatal
      }
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
      setRetryHint(null);
      setShowRetryRefutation(false);
    } else {
      setIsRetryingMistakes(false);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch {
        // non-fatal
      }
    }
  };

  const currentPly = report && report.plies[activePlyIndex - 1] ? report.plies[activePlyIndex - 1] : null;

  const customArrows = useMemo(() => {
    if (isRetryingMistakes) {
      if (showRetryRefutation && currentRetryMoment?.refutation?.punishingMoveUci) {
        const uci = currentRetryMoment.refutation.punishingMoveUci;
        if (uci.from && uci.to) {
          return [{ from: uci.from as Square, to: uci.to as Square, color: 'rgba(239, 68, 68, 0.9)' }];
        }
      }
      return undefined;
    }
    if (showRefutationPly === activePlyIndex && currentPly?.refutation?.punishingMoveUci) {
      const uci = currentPly.refutation.punishingMoveUci;
      if (uci.from && uci.to) {
        return [{ from: uci.from as Square, to: uci.to as Square, color: 'rgba(239, 68, 68, 0.9)' }];
      }
    }
    return undefined;
  }, [isRetryingMistakes, showRetryRefutation, currentRetryMoment, showRefutationPly, activePlyIndex, currentPly]);

  if (!isOpen) return null;

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

        {isAnalyzing || !report ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center my-auto min-h-[380px]">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#2d3826] to-[#405036] border border-[#526645] flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-[#b2ca7c] animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analyzing Game with Engine</h3>
            <p className="text-sm text-neutral-400 max-w-md mb-6">
              Evaluating centipawn loss, uncovering brilliant moves, and identifying critical turning points...
            </p>
            <div className="w-full max-w-md bg-[#131711] rounded-full h-3.5 p-0.5 border border-[#374032] overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#8ba752] to-[#b2ca7c] rounded-full transition-all duration-150"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full max-w-md text-xs font-semibold text-neutral-400">
              <span>{Math.round((analysisProgress / 100) * moves.length)} / {moves.length} moves evaluated</span>
              <span className="text-[#b2ca7c] font-bold text-sm">{analysisProgress}%</span>
            </div>
          </div>
        ) : (
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
                {report.whitePerformance && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#b2ca7c]">
                    <Award className="h-3.5 w-3.5" />
                    <span>{report.whitePerformance.elo} ELO</span>
                    <span className="rounded bg-[#2a3325] px-1.5 py-0.5 text-[10px] text-neutral-300 font-semibold border border-[#3b4834]">
                      {report.whitePerformance.tier}
                    </span>
                  </div>
                )}
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
                {report.blackPerformance && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Award className="h-3.5 w-3.5" />
                    <span>{report.blackPerformance.elo} ELO</span>
                    <span className="rounded bg-[#2a3325] px-1.5 py-0.5 text-[10px] text-neutral-300 font-semibold border border-[#3b4834]">
                      {report.blackPerformance.tier}
                    </span>
                  </div>
                )}
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
                  customArrows={customArrows}
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

                    {/* Interactive Show Refutation button for blunders & mistakes */}
                    {currentPly.refutation && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setShowRefutationPly(showRefutationPly === currentPly.ply ? null : currentPly.ply)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/40 transition cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            {showRefutationPly === currentPly.ply
                              ? 'Hide Punishment'
                              : 'Why is this a blunder? (Show Punishment)'}
                          </span>
                        </button>
                        {showRefutationPly === currentPly.ply && (
                          <div className="mt-2 rounded-lg border border-rose-600/40 bg-[#1e1517] p-3 text-xs space-y-2 animate-fadeIn">
                            <div className="flex items-center gap-1.5 font-bold text-rose-400">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Tactical Refutation (Arrow Drawn on Board)</span>
                            </div>
                            <p className="text-neutral-200 leading-relaxed">
                              {currentPly.refutation.explanation}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                              <span className="text-rose-400 font-bold">Opponent reply:</span>
                              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-700/50 text-rose-300 font-bold">
                                {currentPly.refutation.punishingMoveSan}
                              </span>
                              {currentPly.refutation.followUpMovesSan.length > 0 && (
                                <span>
                                  {' '}then {currentPly.refutation.followUpMovesSan.join(' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
                    customArrows={customArrows}
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

                    {/* Hint & Refutation Buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleRevealRetryHint}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/40 transition cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Peek Hint</span>
                      </button>

                      {currentRetryMoment.refutation && (
                        <button
                          type="button"
                          onClick={() => setShowRetryRefutation(!showRetryRefutation)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{showRetryRefutation ? 'Hide Refutation' : 'Why did my move fail?'}</span>
                        </button>
                      )}
                    </div>

                    {retryHint && (
                      <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200 animate-fadeIn">
                        {retryHint}
                      </div>
                    )}

                    {showRetryRefutation && currentRetryMoment.refutation && (
                      <div className="mt-2 rounded-lg border border-rose-600/40 bg-[#1e1517] p-2.5 text-xs space-y-1 animate-fadeIn">
                        <div className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Tactical Punishment:</span>
                        </div>
                        <p className="text-neutral-300">{currentRetryMoment.refutation.explanation}</p>
                        <div className="text-[11px] font-mono text-neutral-400">
                          Opponent punishing move: <span className="text-rose-400 font-bold">{currentRetryMoment.refutation.punishingMoveSan}</span>
                        </div>
                      </div>
                    )}

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
        )}
      </div>
    </div>
  );
};
