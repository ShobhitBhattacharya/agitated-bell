export interface ShareCardData {
  whiteName: string;
  blackName: string;
  whiteAccuracy?: number;
  blackAccuracy?: number;
  whitePerformanceElo?: number;
  blackPerformanceElo?: number;
  result: string;
  openingName?: string;
  movesCount: number;
  fen?: string;
}

export function parseFenToBoard(fen?: string): (string | null)[][] {
  const board: (string | null)[][] = [];
  const placement = (fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR').split(' ')[0];
  const rows = placement.split('/');
  for (let r = 0; r < 8; r++) {
    const row: (string | null)[] = [];
    const rowStr = rows[r] || '8';
    for (const ch of rowStr) {
      if (ch >= '1' && ch <= '8') {
        const emptyCount = parseInt(ch, 10);
        for (let e = 0; e < emptyCount; e++) {
          row.push(null);
        }
      } else {
        row.push(ch);
      }
    }
    board.push(row);
  }
  return board;
}

export const PIECE_GLYPHS: Record<string, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

export function renderShareCardToCanvas(
  canvas: HTMLCanvasElement,
  data: ShareCardData
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 700;
  const height = 840;
  canvas.width = width;
  canvas.height = height;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#1a1f16');
  bgGrad.addColorStop(0.4, '#141812');
  bgGrad.addColorStop(1, '#0e110c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer border with accent
  ctx.strokeStyle = '#81b64c';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Top header brand
  ctx.font = '900 20px sans-serif';
  ctx.fillStyle = '#81b64c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('♞ CHESS MASTER', 32, 28);

  // Result badge in top right
  const resultText = data.result || '*';
  ctx.font = 'bold 14px sans-serif';
  const badgeWidth = ctx.measureText(resultText).width + 24;
  ctx.fillStyle = '#232920';
  ctx.fillRect(width - 32 - badgeWidth, 24, badgeWidth, 30);
  ctx.strokeStyle = '#81b64c';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(width - 32 - badgeWidth, 24, badgeWidth, 30);

  ctx.fillStyle = '#b2ca7c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(resultText, width - 32 - badgeWidth / 2, 39);

  // Match stats banner (White vs Black)
  const statsY = 70;
  ctx.fillStyle = '#1c2219';
  ctx.fillRect(32, statsY, width - 64, 82);
  ctx.strokeStyle = '#323a2d';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, statsY, width - 64, 82);

  // White Player
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#8e9987';
  ctx.fillText('WHITE', 50, statsY + 14);

  ctx.font = 'bold 17px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(data.whiteName || 'White', 50, statsY + 30);

  if (data.whiteAccuracy !== undefined || data.whitePerformanceElo !== undefined) {
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#b2ca7c';
    const text = data.whitePerformanceElo
      ? `${data.whitePerformanceElo} ELO • ${data.whiteAccuracy}%`
      : `${data.whiteAccuracy}% Accuracy`;
    ctx.fillText(text, 50, statsY + 54);
  }

  // VS text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#65705e';
  ctx.fillText('VS', width / 2, statsY + 41);

  // Black Player
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#8e9987';
  ctx.fillText('BLACK', width - 50, statsY + 14);

  ctx.font = 'bold 17px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(data.blackName || 'Black', width - 50, statsY + 30);

  if (data.blackAccuracy !== undefined || data.blackPerformanceElo !== undefined) {
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f59e0b';
    const text = data.blackPerformanceElo
      ? `${data.blackPerformanceElo} ELO • ${data.blackAccuracy}%`
      : `${data.blackAccuracy}% Accuracy`;
    ctx.fillText(text, width - 50, statsY + 54);
  }

  // Chessboard diagram
  const boardSize = 464;
  const squareSize = boardSize / 8;
  const boardX = (width - boardSize) / 2;
  const boardY = 172;

  // Board background & border
  ctx.fillStyle = '#1c2219';
  ctx.fillRect(boardX - 4, boardY - 4, boardSize + 8, boardSize + 8);
  ctx.strokeStyle = '#434e3c';
  ctx.lineWidth = 3;
  ctx.strokeRect(boardX - 4, boardY - 4, boardSize + 8, boardSize + 8);

  const board = parseFenToBoard(data.fen);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      ctx.fillStyle = isLight ? '#eeeed2' : '#769656';
      ctx.fillRect(boardX + c * squareSize, boardY + r * squareSize, squareSize, squareSize);

      const piece = board[r][c];
      if (piece) {
        const isWhite = piece === piece.toUpperCase();
        const glyph = PIECE_GLYPHS[piece.toLowerCase()] || piece;
        const centerX = boardX + c * squareSize + squareSize / 2;
        const centerY = boardY + r * squareSize + squareSize / 2 + 2;

        ctx.font = 'bold 38px "Segoe UI Symbol", "Apple Color Emoji", "Noto Sans Symbols", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isWhite) {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#222222';
          ctx.lineWidth = 3;
          ctx.strokeText(glyph, centerX, centerY);
          ctx.fillText(glyph, centerX, centerY);
        } else {
          ctx.fillStyle = '#181b16';
          ctx.strokeStyle = '#e0e6d8';
          ctx.lineWidth = 1.5;
          ctx.strokeText(glyph, centerX, centerY);
          ctx.fillText(glyph, centerX, centerY);
        }
      }
    }
  }

  // Ranks (1-8) and files (a-h) labels inside squares
  ctx.font = 'bold 10px sans-serif';
  for (let i = 0; i < 8; i++) {
    // files along bottom rank
    const isLightBottom = (7 + i) % 2 === 0;
    ctx.fillStyle = isLightBottom ? '#769656' : '#eeeed2';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      String.fromCharCode(97 + i),
      boardX + (i + 1) * squareSize - 3,
      boardY + 8 * squareSize - 2
    );

    // ranks along left file
    const isLightLeft = i % 2 === 0;
    ctx.fillStyle = isLightLeft ? '#769656' : '#eeeed2';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(String(8 - i), boardX + 3, boardY + i * squareSize + 2);
  }

  // Bottom info section
  const bottomY = boardY + boardSize + 18;

  // Opening Name
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(data.openingName || 'Standard Chess Match', width / 2, bottomY);

  // Moves count and Result
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#9ca893';
  ctx.fillText(
    `${data.movesCount} Moves • Final Result: ${data.result || '*'}`,
    width / 2,
    bottomY + 26
  );

  // Footer Tagline
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#81b64c';
  ctx.fillText('Play & Master Chess • chessmaster.app', width / 2, bottomY + 50);
}
