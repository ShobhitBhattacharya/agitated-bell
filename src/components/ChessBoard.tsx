import React, { useState, useMemo, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { PieceColor, PieceType, BoardTheme } from '../types/chess';
import { ChessPieceIcon } from '../utils/pieces';

export interface BoardArrow {
  from: Square;
  to: Square;
  color?: string;
}

interface ChessBoardProps {
  chess: Chess;
  orientation: PieceColor;
  theme: BoardTheme;
  interactive: boolean;
  showLegalMoves: boolean;
  lastMove?: { from: Square; to: Square } | null;
  onMove: (from: Square, to: Square, promotion?: PieceType) => boolean;
  onRequestPromotion: (from: Square, to: Square) => void;
  customArrows?: BoardArrow[];
  customHighlights?: Partial<Record<Square, string>>;
  enableRightClickDraw?: boolean;
}

const ChessBoardComponent: React.FC<ChessBoardProps> = ({
  chess,
  orientation,
  theme,
  interactive,
  showLegalMoves,
  lastMove,
  onMove,
  onRequestPromotion,
  customArrows,
  customHighlights,
  enableRightClickDraw = true,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const [drawnArrows, setDrawnArrows] = useState<BoardArrow[]>([]);
  const [drawnHighlights, setDrawnHighlights] = useState<Partial<Record<Square, string>>>({});
  const rightClickStartRef = useRef<Square | null>(null);

  // Compute legal moves from the selected square
  const legalMovesFromSelected = useMemo(() => {
    if (!selectedSquare || !showLegalMoves || !interactive) return [];
    try {
      return chess.moves({ square: selectedSquare, verbose: true });
    } catch {
      return [];
    }
  }, [chess, selectedSquare, showLegalMoves, interactive]);

  // Target squares mapped for quick lookup
  const legalTargetsMap = useMemo(() => {
    const map = new Map<Square, Move>();
    for (const m of legalMovesFromSelected) {
      map.set(m.to as Square, m);
    }
    return map;
  }, [legalMovesFromSelected]);

  // King square in check
  const inCheckKingSquare = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          const file = String.fromCharCode(97 + c);
          const rank = String(8 - r);
          return `${file}${rank}` as Square;
        }
      }
    }
    return null;
  }, [chess]);

  // Files and ranks according to orientation
  const files = orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = orientation === 'w' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'];

  // Handle square click
  const handleSquareClick = (square: Square) => {
    if (!interactive) return;

    const piece = chess.get(square);

    // If a square is already selected
    if (selectedSquare) {
      // If clicking the same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      // Check if clicked square is a legal move
      const targetMove = legalTargetsMap.get(square);
      if (targetMove) {
        const fromPiece = chess.get(selectedSquare);
        const isPromotion =
          fromPiece &&
          fromPiece.type === 'p' &&
          ((fromPiece.color === 'w' && square[1] === '8') ||
            (fromPiece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          onRequestPromotion(selectedSquare, square);
        } else {
          onMove(selectedSquare, square);
        }
        setSelectedSquare(null);
        return;
      }

      // If clicking another piece of current player's color, switch selection
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        return;
      }

      // Otherwise deselect
      setSelectedSquare(null);
      return;
    }

    // No square selected yet: select if it's the current player's piece
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (!interactive) {
      e.preventDefault();
      return;
    }
    const piece = chess.get(square);
    if (!piece || piece.color !== chess.turn()) {
      e.preventDefault();
      return;
    }

    setDraggedSquare(square);
    setSelectedSquare(square);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    const fromSquare = (e.dataTransfer.getData('text/plain') as Square) || draggedSquare;
    setDraggedSquare(null);

    if (!fromSquare || fromSquare === targetSquare) return;

    // Check legality
    const moves = chess.moves({ square: fromSquare, verbose: true });
    const isLegal = moves.some((m) => m.to === targetSquare);

    if (!isLegal) {
      setSelectedSquare(null);
      return;
    }

    const fromPiece = chess.get(fromSquare);
    const isPromotion =
      fromPiece &&
      fromPiece.type === 'p' &&
      ((fromPiece.color === 'w' && targetSquare[1] === '8') ||
        (fromPiece.color === 'b' && targetSquare[1] === '1'));

    if (isPromotion) {
      onRequestPromotion(fromSquare, targetSquare);
    } else {
      onMove(fromSquare, targetSquare);
    }
    setSelectedSquare(null);
  };

  const handleSquareMouseDown = (e: React.MouseEvent, square: Square) => {
    if (!enableRightClickDraw) return;
    if (e.button === 2) {
      e.preventDefault();
      rightClickStartRef.current = square;
    } else if (e.button === 0) {
      if (drawnArrows.length > 0 || Object.keys(drawnHighlights).length > 0) {
        setDrawnArrows([]);
        setDrawnHighlights({});
      }
    }
  };

  const handleSquareMouseUp = (e: React.MouseEvent, square: Square) => {
    if (!enableRightClickDraw) return;
    if (e.button === 2) {
      e.preventDefault();
      const startSquare = rightClickStartRef.current;
      rightClickStartRef.current = null;
      if (!startSquare) return;

      if (startSquare === square) {
        setDrawnHighlights((prev) => {
          const next = { ...prev };
          if (next[square]) {
            delete next[square];
          } else {
            next[square] = 'rgba(239, 68, 68, 0.4)';
          }
          return next;
        });
      } else {
        setDrawnArrows((prev) => {
          const exists = prev.some((a) => a.from === startSquare && a.to === square);
          if (exists) {
            return prev.filter((a) => !(a.from === startSquare && a.to === square));
          } else {
            return [...prev, { from: startSquare, to: square, color: '#81b64c' }];
          }
        });
      }
    }
  };

  const allArrows = useMemo(() => {
    return [...(customArrows || []), ...drawnArrows];
  }, [customArrows, drawnArrows]);

  const allHighlights = useMemo(() => {
    return { ...drawnHighlights, ...(customHighlights || {}) };
  }, [drawnHighlights, customHighlights]);

  const getArrowCoords = (from: Square, to: Square) => {
    const col1 = files.indexOf(from[0]);
    const row1 = ranks.indexOf(from[1]);
    const col2 = files.indexOf(to[0]);
    const row2 = ranks.indexOf(to[1]);
    if (col1 === -1 || row1 === -1 || col2 === -1 || row2 === -1) return null;

    const x1 = col1 * 100 + 50;
    const y1 = row1 * 100 + 50;
    const x2 = col2 * 100 + 50;
    const y2 = row2 * 100 + 50;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return null;

    const ux = dx / dist;
    const uy = dy / dist;

    return {
      x1: x1 + ux * 18,
      y1: y1 + uy * 18,
      x2: x2 - ux * 28,
      y2: y2 - uy * 28,
    };
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`board-theme-${theme} relative aspect-square w-full max-w-[620px] rounded-lg shadow-2xl overflow-hidden grid grid-cols-8 grid-rows-8 border-4 border-[#2b2723] select-none touch-none`}
    >
      {ranks.map((rank, rankIdx) =>
        files.map((file, fileIdx) => {
          const square = `${file}${rank}` as Square;
          const piece = chess.get(square);

          // Standard chess light/dark pattern
          const fileNum = file.charCodeAt(0) - 97;
          const rankNum = parseInt(rank, 10) - 1;
          const isLight = (fileNum + rankNum) % 2 !== 0;

          // Highlights
          const isSelected = selectedSquare === square;
          const isLastMoveFrom = lastMove?.from === square;
          const isLastMoveTo = lastMove?.to === square;
          const isInCheck = inCheckKingSquare === square;
          const isLegalTarget = legalTargetsMap.has(square);
          const isCaptureTarget = isLegalTarget && piece !== null;

          // Corner coordinate labels
          const showFileCoord = rankIdx === 7;
          const showRankCoord = fileIdx === 0;

          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              onMouseDown={(e) => handleSquareMouseDown(e, square)}
              onMouseUp={(e) => handleSquareMouseUp(e, square)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, square)}
              className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                isLight ? 'square-light' : 'square-dark'
              } ${isSelected ? 'highlight-selected' : ''} ${
                isLastMoveFrom || isLastMoveTo ? 'highlight-last-move' : ''
              } ${isInCheck ? 'highlight-check pulse-check' : ''}`}
            >
              {/* Coordinate: Rank on left column */}
              {showRankCoord && (
                <span
                  className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold pointer-events-none select-none ${
                    isLight ? 'text-[#779556] opacity-80' : 'text-[#ebecd0] opacity-80'
                  }`}
                >
                  {rank}
                </span>
              )}

              {/* Coordinate: File on bottom row */}
              {showFileCoord && (
                <span
                  className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold pointer-events-none select-none ${
                    isLight ? 'text-[#779556] opacity-80' : 'text-[#ebecd0] opacity-80'
                  }`}
                >
                  {file}
                </span>
              )}

              {/* Legal Move Indicator: Dot for empty, Ring for capture */}
              {isLegalTarget && !isCaptureTarget && (
                <div className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/25 pointer-events-none z-10 animate-pop-in" />
              )}
              {isCaptureTarget && (
                <div className="absolute inset-1 rounded-full border-4 sm:border-[5px] border-black/20 pointer-events-none z-10 animate-pop-in" />
              )}

              {/* Piece Rendering */}
              {piece && (
                <div
                  draggable={interactive && piece.color === chess.turn()}
                  onDragStart={(e) => handleDragStart(e, square)}
                  className={`w-[86%] h-[86%] flex items-center justify-center z-5 transition-transform duration-100 ${
                    interactive && piece.color === chess.turn()
                      ? 'cursor-grab active:cursor-grabbing hover:scale-105'
                      : ''
                  }`}
                >
                  <ChessPieceIcon type={piece.type} color={piece.color} />
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Visual Overlay: SVG Arrows and Square Highlights */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 800 800"
      >
        <defs>
          <marker
            id="arrow-green"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#81b64c" />
          </marker>
          <marker
            id="arrow-orange"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
          <marker
            id="arrow-blue"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
          </marker>
          <marker
            id="arrow-red"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Square Highlights */}
        {Object.entries(allHighlights).map(([sq, color]) => {
          const col = files.indexOf(sq[0]);
          const row = ranks.indexOf(sq[1]);
          if (col === -1 || row === -1) return null;
          return (
            <rect
              key={sq}
              x={col * 100}
              y={row * 100}
              width={100}
              height={100}
              fill={color || 'rgba(239, 68, 68, 0.4)'}
            />
          );
        })}

        {/* Directional Arrows */}
        {allArrows.map((arrow, idx) => {
          const coords = getArrowCoords(arrow.from, arrow.to);
          if (!coords) return null;
          const color = arrow.color || '#81b64c';
          const markerId =
            color.includes('3b82f6') || color === 'blue'
              ? 'arrow-blue'
              : color.includes('ef4444') || color === 'red'
              ? 'arrow-red'
              : color.includes('f59e0b') || color === 'orange'
              ? 'arrow-orange'
              : 'arrow-green';

          return (
            <line
              key={`${arrow.from}-${arrow.to}-${idx}`}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
              opacity="0.88"
            />
          );
        })}
      </svg>
    </div>
  );
};

export const ChessBoard = React.memo(ChessBoardComponent, (prevProps, nextProps) => {
  if (prevProps.chess.fen() !== nextProps.chess.fen()) return false;
  if (prevProps.orientation !== nextProps.orientation) return false;
  if (prevProps.theme !== nextProps.theme) return false;
  if (prevProps.interactive !== nextProps.interactive) return false;
  if (prevProps.showLegalMoves !== nextProps.showLegalMoves) return false;
  if (prevProps.enableRightClickDraw !== nextProps.enableRightClickDraw) return false;

  const prevLast = prevProps.lastMove;
  const nextLast = nextProps.lastMove;
  if (prevLast?.from !== nextLast?.from || prevLast?.to !== nextLast?.to) return false;

  if (prevProps.customArrows !== nextProps.customArrows) return false;
  if (prevProps.customHighlights !== nextProps.customHighlights) return false;

  return true;
});
