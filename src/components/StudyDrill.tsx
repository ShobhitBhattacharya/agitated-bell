import React, { useState } from 'react';
import { ArrowLeft, Check, RotateCcw, X } from 'lucide-react';
import { Chess, Color, Square } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { PuzzleRushPuzzle } from '../utils/puzzleRush';

interface StudyDrillProps {
  title: string;
  kind: 'opening' | 'endgame';
  openingMoves?: string[];
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
  initialFen,
  puzzle,
  explanation,
  onClose,
}) => {
  const initialTurn: Color = initialFen
    ? (new Chess(initialFen).turn() as Color)
    : 'w';
  const [playerColor, setPlayerColor] = useState<Color>(initialTurn);
  const [position, setPosition] = useState<PositionState>(() =>
    createPosition(kind, openingMoves, puzzle, initialFen, initialTurn)
  );
  const [fen, setFen] = useState(position.chess.fen());
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState(
    kind === 'opening'
      ? 'Play the model moves for your side.'
      : initialFen
      ? 'Find the winning endgame technique.'
      : 'Find the best endgame move.'
  );

  const reset = (color = playerColor) => {
    const next = createPosition(kind, openingMoves, puzzle, initialFen, color);
    setPlayerColor(color);
    setPosition(next);
    setFen(next.chess.fen());
    setLastMove(null);
    setIsSolved(false);
    setFeedback(
      kind === 'opening'
        ? `Play the model moves as ${color === 'w' ? 'White' : 'Black'}.`
        : initialFen
        ? 'Find the winning endgame technique.'
        : 'Find the best endgame move.'
    );
  };

  const handleMove = (from: Square, to: Square): boolean => {
    if (isSolved) return false;
    const isSanMoves = openingMoves && openingMoves.length > 0;
    const solution = isSanMoves ? openingMoves : puzzle?.solution ?? [];
    const expected = solution[position.moveIndex];
    if (!expected) return false;

    const expectedMove = isSanMoves
      ? position.chess.moves({ verbose: true }).find((move) => move.san === expected)
      : undefined;
    const expectedFrom = isSanMoves ? expectedMove?.from : expected.slice(0, 2);
    const expectedTo = isSanMoves ? expectedMove?.to : expected.slice(2, 4);

    if (expectedFrom !== from || expectedTo !== to) {
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

      if (nextMoveIndex >= solution.length) {
        setIsSolved(true);
        setFeedback(
          kind === 'opening'
            ? 'Model line complete.'
            : initialFen
            ? 'Endgame technique mastered!'
            : 'Correct. Endgame line solved.'
        );
      } else {
        setFeedback(
          kind === 'opening'
            ? 'Good. Continue the model line.'
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
    (openingMoves.length > 0 ? openingMoves.join(' · ') : puzzle?.themes.join(' · '));

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
                ? 'Opening drill'
                : initialFen
                ? 'Endgame Principle Drill'
                : `Endgame drill · ${puzzle?.rating ?? ''}`}
            </div>
            <h2 className="text-sm font-bold text-white">{title}</h2>
          </div>
        </header>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,620px)_1fr]">
          <section>
            {kind === 'opening' && (
              <div className="mb-3 flex items-center justify-between gap-3">
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
            <ChessBoard
              key={`${kind}-${title}-${fen}-${playerColor}`}
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
            <div className="rounded-md border border-[#373d35] bg-[#222720] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                {openingMoves.length > 0 ? 'Model line' : 'Themes'}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#e0e6d8]">{content}</p>
            </div>
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
