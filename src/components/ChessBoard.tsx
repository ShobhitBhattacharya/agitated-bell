import React, { useState, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { PieceColor, PieceType, BoardTheme } from '../types/chess';
import { ChessPieceIcon } from '../utils/pieces';

interface ChessBoardProps {
  chess: Chess;
  orientation: PieceColor;
  theme: BoardTheme;
  interactive: boolean;
  showLegalMoves: boolean;
  lastMove?: { from: Square; to: Square } | null;
  onMove: (from: Square, to: Square, promotion?: PieceType) => boolean;
  onRequestPromotion: (from: Square, to: Square) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  orientation,
  theme,
  interactive,
  showLegalMoves,
  lastMove,
  onMove,
  onRequestPromotion,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

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

  return (
    <div
      className={`board-theme-${theme} aspect-square w-full max-w-[620px] rounded-lg shadow-2xl overflow-hidden grid grid-cols-8 grid-rows-8 border-4 border-[#2b2723] select-none touch-none`}
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
    </div>
  );
};
