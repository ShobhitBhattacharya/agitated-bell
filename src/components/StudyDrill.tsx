import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCcw, X, GitBranch, Sparkles, Brain, Lightbulb, Trophy, Heart } from 'lucide-react';
import { Chess, Color, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import { ChessBoard } from './ChessBoard';
import { PuzzleRushPuzzle } from '../utils/puzzleRush';
import { OpeningVariation } from '../utils/studyTools';

export type DrillRecallMode = 'guided' | 'blind_easy' | 'blind_hard';

export interface StudyDrillProps {
  title: string;
  kind: 'opening' | 'endgame';
  openingMoves?: string[];
  variations?: OpeningVariation[];
  initialVariationId?: string;
  initialFen?: string;
  puzzle?: PuzzleRushPuzzle;
  explanation?: string;
  onClose: () => void;
}

interface PositionState {
  chess: Chess;
  moveIndex: number;
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const createPosition = (
  kind: StudyDrillProps['kind'],
  openingMoves: string[],
  puzzle: PuzzleRushPuzzle | undefined,
  initialFen: string | undefined,
  color: Color
): PositionState => {
  if (kind === 'endgame' && puzzle) return { chess: new Chess(puzzle.fen), moveIndex: 0 };
  if (initialFen) {
    const chess = new Chess(initialFen);
    let moveIndex = 0;
    if (color !== chess.turn() && openingMoves[moveIndex]) {
      chess.move(openingMoves[moveIndex]);
      moveIndex += 1;
    }
    return { chess, moveIndex };
  }
  const chess = new Chess(INITIAL_FEN);
  let moveIndex = 0;
  if (color === 'b' && openingMoves[moveIndex]) {
    chess.move(openingMoves[moveIndex]);
    moveIndex += 1;
  }
  return { chess, moveIndex };
};

export const StudyDrill: React.FC<StudyDrillProps> = ({
  title,
  kind,
  openingMoves = [],
  variations = [],
  initialVariationId,
  initialFen,
  puzzle,
  explanation,
  onClose,
}) => {
  const [activeVariationId, setActiveVariationId] = useState<string | null>(initialVariationId ?? null);

  const activeMoves = useMemo(() => {
    if (kind === 'opening' && activeVariationId && variations.length > 0) {
      const found = variations.find((v) => v.id === activeVariationId);
      if (found) return found.moves;
    }
    return openingMoves;
  }, [kind, activeVariationId, variations, openingMoves]);

  const activeVariation = useMemo(() => {
    if (!activeVariationId || variations.length === 0) return null;
    return variations.find((v) => v.id === activeVariationId) ?? null;
  }, [activeVariationId, variations]);

  const initialTurn: Color = initialFen
    ? (new Chess(initialFen).turn() as Color)
    : 'w';
  const [playerColor, setPlayerColor] = useState<Color>(initialTurn);
  const [recallMode, setRecallMode] = useState<DrillRecallMode>('guided');
  const [strikesLeft, setStrikesLeft] = useState<number>(3);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);

  const [position, setPosition] = useState<PositionState>(() =>
    createPosition(kind, activeMoves, puzzle, initialFen, initialTurn)
  );
  const [fen, setFen] = useState(position.chess.fen());
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState(
    kind === 'opening'
      ? activeVariation
        ? `Play the ${activeVariation.name} moves as ${initialTurn === 'w' ? 'White' : 'Black'}.`
        : `Play the best line moves for your side.`
      : initialFen
      ? 'Find the winning endgame technique.'
      : 'Find the best endgame move.'
  );

  const reset = (color = playerColor, movesToUse = activeMoves, targetRecallMode = recallMode) => {
    const next = createPosition(kind, movesToUse, puzzle, initialFen, color);
    setPlayerColor(color);
    setPosition(next);
    setFen(next.chess.fen());
    setLastMove(null);
    setIsSolved(false);
    setStrikesLeft(targetRecallMode === 'blind_hard' ? 1 : 3);
    setRevealedHint(null);
    setFeedback(
      targetRecallMode === 'blind_hard'
        ? 'Hard Blind Recall: 1 mistake resets the drill. Play strictly from memory!'
        : targetRecallMode === 'blind_easy'
        ? 'Easy Blind Recall: 3 attempts allowed. Tap Hint if you need help!'
        : kind === 'opening'
        ? `Play the theoretical moves as ${color === 'w' ? 'White' : 'Black'}.`
        : initialFen
        ? 'Find the winning endgame technique.'
        : 'Find the best endgame move.'
    );
  };

  const handleSelectVariation = (varId: string | null) => {
    setActiveVariationId(varId);
    let targetMoves = openingMoves;
    let varName = 'Main Best Line';
    if (varId && variations.length > 0) {
      const v = variations.find((item) => item.id === varId);
      if (v) {
        targetMoves = v.moves;
        varName = v.name;
      }
    }
    reset(playerColor, targetMoves);
    setFeedback(`Switched to ${varName}. Play as ${playerColor === 'w' ? 'White' : 'Black'}.`);
  };

  const targetSolution = useMemo(() => {
    return activeMoves && activeMoves.length > 0 ? activeMoves : (puzzle?.solution ?? []);
  }, [activeMoves, puzzle]);

  const handleRevealHint = () => {
    const isSanMoves = activeMoves && activeMoves.length > 0;
    const solution = targetSolution;
    const expected = solution[position.moveIndex];
    if (!expected) return;

    const expectedMove = isSanMoves
      ? position.chess.moves({ verbose: true }).find((m) => m.san === expected)
      : undefined;

    if (expectedMove) {
      const pieceName =
        expectedMove.piece === 'p'
          ? 'Pawn'
          : expectedMove.piece === 'n'
          ? 'Knight'
          : expectedMove.piece === 'b'
          ? 'Bishop'
          : expectedMove.piece === 'r'
          ? 'Rook'
          : expectedMove.piece === 'q'
          ? 'Queen'
          : 'King';
      setRevealedHint(`Hint: Move your ${pieceName} from ${expectedMove.from.toUpperCase()}`);
    } else {
      setRevealedHint(`Hint: Next move starts from square ${expected.slice(0, 2).toUpperCase()}`);
    }
  };

  const handleMove = (from: Square, to: Square): boolean => {
    if (isSolved) return false;
    const isSanMoves = activeMoves && activeMoves.length > 0;
    const solution = isSanMoves ? activeMoves : puzzle?.solution ?? [];
    const expected = solution[position.moveIndex];
    if (!expected) return false;

    const expectedMove = isSanMoves
      ? position.chess.moves({ verbose: true }).find((move) => move.san === expected)
      : undefined;
    const expectedFrom = isSanMoves ? expectedMove?.from : expected.slice(0, 2);
    const expectedTo = isSanMoves ? expectedMove?.to : expected.slice(2, 4);

    if (expectedFrom !== from || expectedTo !== to) {
      if (recallMode === 'blind_hard') {
        const next = createPosition(kind, activeMoves, puzzle, initialFen, playerColor);
        setPosition(next);
        setFen(next.chess.fen());
        setLastMove(null);
        setRevealedHint(null);
        setFeedback(`❌ Mistake (${expected} was correct). In Hard Blind mode, 1 error resets the line. Try again!`);
        return false;
      }

      if (recallMode === 'blind_easy') {
        const remaining = strikesLeft - 1;
        setStrikesLeft(remaining);
        if (remaining <= 0) {
          const next = createPosition(kind, activeMoves, puzzle, initialFen, playerColor);
          setPosition(next);
          setFen(next.chess.fen());
          setLastMove(null);
          setStrikesLeft(3);
          setRevealedHint(null);
          setFeedback(`Out of attempts! The move was ${expected}. Drill reset — try again from move 1!`);
        } else {
          setFeedback(`Incorrect move from memory. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
        }
        return false;
      }

      setFeedback(
        isSanMoves
          ? `Not the theoretical move here. Look for ${expected}.`
          : 'Not the solution. Try another move.'
      );
      return false;
    }

    try {
      const playedMove = isSanMoves
        ? position.chess.move({ from, to, promotion: expectedMove?.promotion || 'q' })
        : position.chess.move({ from, to, promotion: expected[4] ?? 'q' });
      if (!playedMove) return false;

      let nextMoveIndex = position.moveIndex + 1;
      let resultingLastMove: { from: Square; to: Square } = { from, to };
      const opponentMove = solution[nextMoveIndex];
      const opponentToMove = isSanMoves
        ? position.chess.turn() !== playerColor
        : Boolean(opponentMove);

      if (opponentMove && opponentToMove) {
        const reply = isSanMoves
          ? position.chess.move(opponentMove)
          : position.chess.move({
              from: opponentMove.slice(0, 2) as Square,
              to: opponentMove.slice(2, 4) as Square,
              promotion: opponentMove[4] ?? 'q',
            });
        if (reply) {
          resultingLastMove = { from: reply.from, to: reply.to };
          nextMoveIndex += 1;
        }
      }

      setPosition({ chess: position.chess, moveIndex: nextMoveIndex });
      setFen(position.chess.fen());
      setLastMove(resultingLastMove);
      setRevealedHint(null);

      if (nextMoveIndex >= solution.length) {
        setIsSolved(true);
        if (recallMode !== 'guided') {
          try {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
          } catch {
            // non-fatal
          }
        }
        setFeedback(
          recallMode === 'blind_hard'
            ? '🏆 Grandmaster Memory! You mastered the entire line blindly with zero mistakes!'
            : recallMode === 'blind_easy'
            ? `🎯 Repertoire Mastered! Completed blind recall with ${strikesLeft}/3 lives remaining!`
            : kind === 'opening'
            ? `${activeVariation ? activeVariation.name : 'Model line'} complete (${solution.length} plies)!`
            : initialFen
            ? 'Endgame technique mastered!'
            : 'Correct. Endgame line solved.'
        );
      } else {
        setFeedback(
          recallMode !== 'guided'
            ? 'Correct! Next move from memory...'
            : kind === 'opening'
            ? 'Good. Continue the theoretical line.'
            : initialFen
            ? 'Correct move. Continue the technique.'
            : 'Correct. Continue the forcing line.'
        );
      }
      return true;
    } catch {
      setFeedback('That move is not legal in this position.');
      return false;
    }
  };

  const orientation = initialFen
    ? playerColor
    : kind === 'opening'
    ? playerColor
    : puzzle?.fen.split(' ')[1] === 'b'
    ? 'b'
    : 'w';

  const content =
    explanation ||
    (activeMoves.length > 0 ? activeMoves.join(' · ') : puzzle?.themes.join(' · '));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} practice`}
    >
      <div className="mx-auto max-w-5xl rounded-lg border border-[#46503f] bg-[#1b201a] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#343a32] px-4 py-3 sm:px-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[#dce2d4] hover:bg-[#30372d]"
          >
            <ArrowLeft className="h-4 w-4" /> Library
          </button>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
              {kind === 'opening'
                ? activeVariation
                  ? `Variation Drill · ${activeVariation.eco}`
                  : 'Opening Best Line Drill'
                : initialFen
                ? 'Endgame Principle Drill'
                : `Endgame drill · ${puzzle?.rating ?? ''}`}
            </div>
            <h2 className="text-sm font-bold text-white">
              {title}
              {activeVariation && ` : ${activeVariation.name}`}
            </h2>
          </div>
        </header>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,620px)_1fr]">
          <section>
            {/* Opening Variations */}
            {kind === 'opening' && variations.length > 0 && (
              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9db879]">
                  <GitBranch className="h-3 w-3" />
                  <span>Choose Variation / Line</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectVariation(null)}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      activeVariationId === null
                        ? 'bg-[#b2ca7c] text-[#1b201a] font-bold shadow'
                        : 'bg-[#222720] text-[#c6ccbf] border border-[#3b4334] hover:bg-[#2b3228]'
                    }`}
                  >
                    Main Best Line ({openingMoves.length} plies)
                  </button>
                  {variations.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariation(v.id)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition flex items-center gap-1 ${
                        activeVariationId === v.id
                          ? 'bg-[#b2ca7c] text-[#1b201a] font-bold shadow'
                          : 'bg-[#222720] text-[#c6ccbf] border border-[#3b4334] hover:bg-[#2b3228]'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="text-[10px] opacity-75">({v.moves.length}p)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Drill Mode Toolbar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#343a32] bg-[#1d221c] p-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#aeb5a5] mr-1">
                  Drill Mode:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRecallMode('guided');
                    reset(playerColor, activeMoves, 'guided');
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                    recallMode === 'guided'
                      ? 'bg-[#b2ca7c] text-[#1b201a] shadow'
                      : 'bg-[#222720] text-[#c6ccbf] border border-[#3b4334] hover:bg-[#2b3228]'
                  }`}
                >
                  Guided
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecallMode('blind_easy');
                    reset(playerColor, activeMoves, 'blind_easy');
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                    recallMode === 'blind_easy'
                      ? 'bg-amber-500 text-neutral-900 shadow'
                      : 'bg-[#222720] text-amber-400 border border-[#3b4334] hover:bg-[#2b3228]'
                  }`}
                  title="Recall moves with 3 lives and optional piece hints"
                >
                  <Brain className="w-3 h-3" />
                  <span>Blind (Easy)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecallMode('blind_hard');
                    reset(playerColor, activeMoves, 'blind_hard');
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                    recallMode === 'blind_hard'
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-[#222720] text-rose-400 border border-[#3b4334] hover:bg-[#2b3228]'
                  }`}
                  title="Strict 1-strike sudden death from memory"
                >
                  <Trophy className="w-3 h-3" />
                  <span>Blind (Hard)</span>
                </button>
              </div>

              {kind === 'opening' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#aeb5a5]">
                    Play as
                  </span>
                  <div
                    className="inline-flex rounded-md border border-[#454c40] bg-[#222720] p-1"
                    role="group"
                    aria-label="Choose opening side"
                  >
                    {(['w', 'b'] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => reset(color)}
                        aria-pressed={playerColor === color}
                        className={`rounded px-3 py-1.5 text-xs font-bold ${
                          playerColor === color
                            ? 'bg-[#b2ca7c] text-[#20251b]'
                            : 'text-[#b6bead] hover:text-white'
                        }`}
                      >
                        {color === 'w' ? 'White' : 'Black'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ChessBoard
              key={`${kind}-${title}-${fen}-${playerColor}-${activeVariationId ?? 'main'}`}
              chess={position.chess}
              orientation={orientation}
              theme="chesscom"
              interactive={!isSolved}
              showLegalMoves
              lastMove={lastMove}
              onMove={handleMove}
              onRequestPromotion={(from, to) => handleMove(from, to)}
            />
            <div
              className="mt-3 flex min-h-12 items-center gap-2 rounded-md border border-[#343a32] bg-[#222720] px-4 py-3 text-sm text-[#d8dfd1]"
              aria-live="polite"
            >
              {isSolved ? (
                <Check className="h-4 w-4 text-[#b2ca7c]" />
              ) : feedback.startsWith('Not') ? (
                <X className="h-4 w-4 text-[#e49a84]" />
              ) : null}
              {feedback}
            </div>
          </section>

          <aside className="space-y-4 lg:pt-8">
            {activeVariation && (
              <div className="rounded-md border border-[#373d35] bg-[#222720] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                    Active Variation
                  </span>
                  <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-300">
                    {activeVariation.playstyle}
                  </span>
                </div>
                <div className="text-base font-bold text-white">{activeVariation.name}</div>
                <div className="text-xs text-[#b2ca7c]">What this opening does for you:</div>
                <p className="text-xs text-[#c6ccbf] leading-relaxed">
                  {activeVariation.playerBenefit}
                </p>
              </div>
            )}

            {recallMode !== 'guided' ? (
              <div className="rounded-md border border-[#373d35] bg-[#222720] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#31362e] pb-2">
                  <div className="flex items-center gap-2">
                    {recallMode === 'blind_easy' ? (
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <Brain className="h-4 w-4" />
                        <span>Blind Recall (Easy)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                        <Trophy className="h-4 w-4" />
                        <span>Blind Recall (Hard)</span>
                      </div>
                    )}
                  </div>

                  {recallMode === 'blind_easy' ? (
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <span className="text-[#a0a89a] text-[10px] uppercase mr-0.5">Lives:</span>
                      {[0, 1, 2].map((i) => (
                        <Heart
                          key={i}
                          className={`h-3.5 w-3.5 transition-colors ${
                            i < strikesLeft
                              ? 'text-rose-500 fill-rose-500'
                              : 'text-neutral-600 fill-neutral-800'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-[11px] text-[#c6ccbf]">({strikesLeft}/3)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 rounded bg-rose-950/70 border border-rose-800/50 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      <span>💀 Sudden Death</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#b2ca7c] font-semibold text-[11px] uppercase tracking-wider">
                      Memory Progress
                    </span>
                    <span className="font-mono text-[#d8dfd1] text-xs">
                      {position.moveIndex} / {targetSolution.length} plies (
                      {Math.round(
                        (position.moveIndex / Math.max(1, targetSolution.length)) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-[#161a15] h-2 rounded-full overflow-hidden border border-[#2e352b]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        recallMode === 'blind_hard' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (position.moveIndex / Math.max(1, targetSolution.length)) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Masked Moves Display */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9db879] mb-1.5">
                    Move Sequence
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded bg-[#181c17] border border-[#2d3329]">
                    {targetSolution.map((m, idx) => {
                      const isPlayed = idx < position.moveIndex;
                      const isCurrent = idx === position.moveIndex;
                      return (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded text-xs font-mono transition ${
                            isPlayed
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold'
                              : isCurrent
                              ? 'bg-amber-500/20 border border-amber-400 text-amber-300 font-extrabold animate-pulse'
                              : 'bg-neutral-900/60 border border-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isPlayed ? m : isCurrent ? '???' : '•••'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Peek Hint button for Easy mode */}
                {recallMode === 'blind_easy' && !isSolved && (
                  <div className="pt-1">
                    {revealedHint ? (
                      <div className="rounded border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>{revealedHint}</div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRevealHint}
                        className="inline-flex items-center gap-1.5 rounded border border-amber-600/50 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Peek Hint (Piece & Square)
                      </button>
                    )}
                  </div>
                )}

                {recallMode === 'blind_hard' && (
                  <p className="text-[11px] text-neutral-400 italic">
                    Strict GM rules: No hints allowed. 1 error resets from ply 1.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-[#373d35] bg-[#222720] p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                  {activeMoves.length > 0 ? (activeVariation ? 'Variation Moves' : 'Model Best Line') : 'Themes'}
                </div>
                <p className="mt-2 text-xs font-mono leading-6 text-[#e0e6d8] break-words">{content}</p>
              </div>
            )}

            {kind === 'endgame' && puzzle?.sourceUrl && (
              <p className="text-xs text-[#8e9787]">
                Lichess puzzle rating: {puzzle.rating} · CC0 ·{' '}
                <a
                  className="underline underline-offset-2 hover:text-white"
                  href={puzzle.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View puzzle source
                </a>
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => reset()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#4b5247] px-4 py-3 text-sm font-semibold text-[#c4cbbd] hover:bg-[#292f27]"
              >
                <RotateCcw className="h-4 w-4" /> Restart drill
              </button>
              <button
                onClick={onClose}
                className="rounded-md bg-[#b2ca7c] px-4 py-3 text-sm font-extrabold text-[#20251b] hover:bg-[#c4d894]"
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
