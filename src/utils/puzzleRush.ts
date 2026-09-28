export interface PuzzleRushPuzzle {
  id: string;
  rating: number;
  theme: string;
  themes: string[];
  fen: string;
  sourceFen: string;
  opponentMove: string;
  solution: string[];
  source: 'Lichess CC0';
  sourceUrl?: string;
  gameUrl: string;
  popularity: number;
  plays: number;
}

export const puzzleRushPuzzles: PuzzleRushPuzzle[] = [
  {
    id: '0000D', rating: 1468, theme: 'Tactics', themes: ['advantage', 'endgame', 'short'],
    fen: '5rk1/1p3ppp/pq1Q1b2/8/8/1P3N2/P4PPP/3R2K1 b - - 3 27',
    sourceFen: '5rk1/1p3ppp/pq3b2/8/8/1P1Q1N2/P4PPP/3R2K1 w - - 2 27', opponentMove: 'd3d6',
    solution: ['f8d8', 'd6d8', 'f6d8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0000D',
    gameUrl: 'https://lichess.org/F8M8OS71#53', popularity: 96, plays: 37410,
  },
  {
    id: '0008Q', rating: 1383, theme: 'rookEndgame', themes: ['advantage', 'endgame', 'rookEndgame', 'short'],
    fen: '8/5R2/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 b - - 2 64',
    sourceFen: '8/4R3/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 w - - 1 64', opponentMove: 'e7f7',
    solution: ['f5e5', 'e2f1', 'e5e6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0008Q',
    gameUrl: 'https://lichess.org/MQSyb3KW#127', popularity: 92, plays: 768,
  },
  {
    id: '0009B', rating: 1084, theme: 'Tactics', themes: ['advantage', 'middlegame', 'short'],
    fen: 'r2qr1k1/b1p2ppp/p5n1/P1p1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 w - - 0 17',
    sourceFen: 'r2qr1k1/b1p2ppp/pp4n1/P1P1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 b - - 1 16', opponentMove: 'b6c5',
    solution: ['e2g4', 'h3g4', 'd1g4'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0009B',
    gameUrl: 'https://lichess.org/4MWQCxQ6/black#32', popularity: 88, plays: 610,
  },
  {
    id: '000Pw', rating: 1547, theme: 'fork', themes: ['crushing', 'endgame', 'fork', 'short'],
    fen: '6k1/5p1p/4p3/4q3/3n4/2Q3P1/PP1N1P1P/6K1 b - - 3 37',
    sourceFen: '6k1/5p1p/4p3/4q3/3nN3/2Q3P1/PP3P1P/6K1 w - - 2 37', opponentMove: 'e4d2',
    solution: ['d4e2', 'g1f1', 'e2c3'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/000Pw',
    gameUrl: 'https://lichess.org/au2lCK5o#73', popularity: 92, plays: 629,
  },
  {
    id: '000VW', rating: 2869, theme: 'Tactics', themes: ['crushing', 'endgame', 'long'],
    fen: 'r4r2/1p3pkp/p7/3R1p1Q/3P4/8/P1q2P2/3R2K1 w - - 0 26',
    sourceFen: 'r4r2/1p3pkp/p5p1/3R1N1Q/3P4/8/P1q2P2/3R2K1 b - - 3 25', opponentMove: 'g6f5',
    solution: ['d5c5', 'c2e4', 'h5g5', 'g7h8', 'g5f6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/000VW',
    gameUrl: 'https://lichess.org/e9AY2m5j/black#50', popularity: 85, plays: 320,
  },
  {
    id: '000h0', rating: 2052, theme: 'interference, kingsideAttack, veryLong',
    themes: ['advantage', 'interference', 'kingsideAttack', 'middlegame', 'veryLong'],
    fen: '5rk1/p5p1/3bRr1p/1Pp4q/3p4/1P1Q1N2/P4PPP/4R1K1 b - - 0 22',
    sourceFen: '5rk1/p5p1/3bpr1p/1Pp4q/3pR3/1P1Q1N2/P4PPP/4R1K1 w - - 4 22', opponentMove: 'e4e6',
    solution: ['f6f3', 'g2f3', 'h5h2', 'g1f1', 'h2h3', 'f1e2', 'h3e6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/000h0',
    gameUrl: 'https://lichess.org/OWe6M5dF#43', popularity: 89, plays: 199,
  },
  {
    id: '000o3', rating: 944, theme: 'pawnEndgame, zugzwang', themes: ['crushing', 'endgame', 'pawnEndgame', 'short', 'zugzwang'],
    fen: '8/2p5/3k2p1/1p1P1p2/1P3P2/3K2Pp/7P/8 w - - 2 44',
    sourceFen: '8/2p1k3/6p1/1p1P1p2/1P3P2/3K2Pp/7P/8 b - - 1 43', opponentMove: 'e7d6',
    solution: ['d3d4', 'g6g5', 'f4g5'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/000o3',
    gameUrl: 'https://lichess.org/BAY91mF3/black#86', popularity: 87, plays: 189,
  },
  {
    id: '000rZ', rating: 616, theme: 'kingsideAttack, mate, mateIn1',
    themes: ['kingsideAttack', 'mate', 'mateIn1', 'oneMove', 'opening'],
    fen: '2kr1b1r/p1p2pp1/2pqN3/7p/6n1/2NPB3/PPP2PPP/R2Q1RK1 b - - 0 13',
    sourceFen: '2kr1b1r/p1p2pp1/2pqb3/7p/3N2n1/2NPB3/PPP2PPP/R2Q1RK1 w - - 2 13', opponentMove: 'd4e6',
    solution: ['d6h2'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/000rZ',
    gameUrl: 'https://lichess.org/seIMDWkD#25', popularity: 100, plays: 628,
  },
  {
    id: '0017R', rating: 1495, theme: 'fork', themes: ['advantage', 'fork', 'long', 'middlegame'],
    fen: 'r2qk2r/pp2ppbp/1n1p2p1/3P4/2n5/2NBBP1P/PP3P2/R2QK2R w KQkq - 0 13',
    sourceFen: 'r2qk2r/pp2ppbp/1n1p2p1/3Pn3/2P5/2NBBP1P/PP3P2/R2QK2R b KQkq - 0 12', opponentMove: 'e5c4',
    solution: ['d3c4', 'b6c4', 'd1a4', 'd8d7', 'a4c4'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0017R',
    gameUrl: 'https://lichess.org/ol84k0z4/black#24', popularity: 95, plays: 6341,
  },
  {
    id: '0018P', rating: 1903, theme: 'exposedKing, rookEndgame, veryLong',
    themes: ['crushing', 'endgame', 'exposedKing', 'rookEndgame', 'veryLong'],
    fen: '5R2/1p6/p1p1k3/2P1r3/2K3p1/2P1p1P1/1P5P/8 w - - 2 45',
    sourceFen: '5R2/1p6/p1p5/2P1rk2/2K3p1/2P1p1P1/1P5P/8 b - - 1 44', opponentMove: 'f5e6',
    solution: ['f8e8', 'e6f5', 'e8e5', 'f5e5', 'c4d3', 'e5d5', 'd3e3', 'a6a5', 'e3f4', 'd5c4', 'f4g4'],
    source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0018P', gameUrl: 'https://lichess.org/Xg1Gtfjr/black#88', popularity: 91, plays: 246,
  },
  {
    id: '001KR', rating: 563, theme: 'mate, mateIn1', themes: ['mate', 'mateIn1', 'middlegame', 'oneMove'],
    fen: '6k1/p1p3pp/4N3/1p6/2q1r1n1/2B5/PP4PP/3R1R1K w - - 0 29',
    sourceFen: '6Qk/p1p3pp/4N3/1p6/2q1r1n1/2B5/PP4PP/3R1R1K b - - 0 28', opponentMove: 'h8g8',
    solution: ['f1f8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/001KR',
    gameUrl: 'https://lichess.org/TaT1Zl7z/black#56', popularity: 100, plays: 183,
  },
  {
    id: '001Wz', rating: 1118, theme: 'backRankMate, mate, mateIn2',
    themes: ['backRankMate', 'endgame', 'mate', 'mateIn2', 'short'],
    fen: '6k1/5ppp/r1p5/p1n1rP2/8/2P2N1P/2P3P1/3R2K1 w - - 0 22',
    sourceFen: '4r1k1/5ppp/r1p5/p1n1RP2/8/2P2N1P/2P3P1/3R2K1 b - - 0 21', opponentMove: 'e8e5',
    solution: ['d1d8', 'e5e8', 'd8e8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/001Wz',
    gameUrl: 'https://lichess.org/84RH3LaP/black#42', popularity: 89, plays: 86,
  },
  {
    id: '001XA', rating: 1687, theme: 'discoveredAttack, sacrifice',
    themes: ['crushing', 'discoveredAttack', 'long', 'master', 'middlegame', 'sacrifice'],
    fen: '2r2rk1/pbq1bppp/8/8/2p1N3/P1Bn2P1/2Q2PBP/1R3RK1 w - - 4 24',
    sourceFen: '1qr2rk1/pb2bppp/8/8/2p1N3/P1Bn2P1/2Q2PBP/1R3RK1 b - - 3 23', opponentMove: 'b8c7',
    solution: ['b1b7', 'c7b7', 'e4f6', 'e7f6', 'g2b7'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/001XA',
    gameUrl: 'https://lichess.org/KZRiN695/black#46', popularity: 91, plays: 1350,
  },
  {
    id: '001pC', rating: 848, theme: 'mate, mateIn1, smotheredMate',
    themes: ['mate', 'mateIn1', 'middlegame', 'oneMove', 'smotheredMate'],
    fen: 'r4rk1/pp3ppp/3b4/2p1pPB1/7N/2PP3n/PP4PP/R2Q2RK b - - 0 18',
    sourceFen: 'r4rk1/pp3ppp/3b4/2p1pPB1/7N/2PP3n/PP4PP/R2Q1RqK w - - 5 18', opponentMove: 'f1g1',
    solution: ['h3f2'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/001pC',
    gameUrl: 'https://lichess.org/d04UP3XD#35', popularity: 91, plays: 435,
  },
  {
    id: '002Ds', rating: 1992, theme: 'knightEndgame', themes: ['crushing', 'endgame', 'knightEndgame', 'long'],
    fen: '8/2p5/pp1p4/P2Pk2p/1PP1p2P/2n1K2P/3N4/8 w - - 0 46',
    sourceFen: '8/1pp5/p2p4/P2Pk2p/1PP1p2P/2n1K2P/3N4/8 b - - 0 45', opponentMove: 'b7b6',
    solution: ['b4b5', 'c3d1', 'e3e2', 'a6b5', 'a5a6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/002Ds',
    gameUrl: 'https://lichess.org/2SrvOtZN/black#90', popularity: 90, plays: 119,
  },
  {
    id: '002KJ', rating: 1619, theme: 'discoveredAttack', themes: ['crushing', 'discoveredAttack', 'middlegame', 'short'],
    fen: 'r3k2r/ppq1bppp/4pn2/2Ppn3/1P4bP/2P2N2/P3BPP1/RNBQ1RK1 w kq - 3 11',
    sourceFen: 'r3kb1r/ppq2ppp/4pn2/2Ppn3/1P4bP/2P2N2/P3BPP1/RNBQ1RK1 b kq - 2 10', opponentMove: 'f8e7',
    solution: ['f3e5', 'c7e5', 'e2g4'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/002KJ',
    gameUrl: 'https://lichess.org/2NpTzh7O/black#20', popularity: 90, plays: 1733,
  },
  {
    id: '002Mm', rating: 918, theme: 'deflection, mate, mateIn2', themes: ['deflection', 'mate', 'mateIn2', 'middlegame', 'short'],
    fen: 'rn1qrk2/ppp3pQ/3p1pP1/3Pp3/2P1P3/8/PP3PP1/R1B1K3 w Q - 3 17',
    sourceFen: 'rn1qr1k1/ppp3pQ/3p1pP1/3Pp3/2P1P3/8/PP3PP1/R1B1K3 b Q - 2 16', opponentMove: 'g8f8',
    solution: ['h7h8', 'f8e7', 'h8g7'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/002Mm',
    gameUrl: 'https://lichess.org/wAkPv4uG/black#32', popularity: 97, plays: 244,
  },
  {
    id: '002Uy', rating: 1714, theme: 'defensiveMove, rookEndgame',
    themes: ['crushing', 'defensiveMove', 'endgame', 'long', 'rookEndgame'],
    fen: '8/8/1p6/k7/P7/1KR4r/8/8 b - - 27 64',
    sourceFen: '8/8/1p6/k7/P1R5/1K5r/8/8 w - - 26 64', opponentMove: 'c4c3',
    solution: ['h3c3', 'b3c3', 'a5a4', 'c3b2', 'a4b4'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/002Uy',
    gameUrl: 'https://lichess.org/sLU7YN1A#127', popularity: 97, plays: 7242,
  },
  {
    id: '002e8', rating: 2537, theme: 'defensiveMove, pin',
    themes: ['crushing', 'defensiveMove', 'master', 'middlegame', 'pin', 'short'],
    fen: '3rnrk1/1b3pp1/4pb2/p3q3/1p1N4/3B2R1/PPPQN2P/1K4R1 w - - 2 24',
    sourceFen: 'r3nrk1/1b3pp1/4pb2/p3q3/1p1N4/3B2R1/PPPQN2P/1K4R1 b - - 1 23', opponentMove: 'a8d8',
    solution: ['d2h6', 'g7g6', 'g3h3'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/002e8',
    gameUrl: 'https://lichess.org/ygzu5djr/black#46', popularity: 92, plays: 642,
  },
  {
    id: '0030b', rating: 538, theme: 'backRankMate, mateIn2', themes: ['backRankMate', 'mate', 'mateIn2', 'middlegame', 'short'],
    fen: '6k1/5ppp/5n2/pp6/4b1rP/5N1Q/Pq2r1P1/3R2RK w - - 5 33',
    sourceFen: '6k1/5ppp/5nb1/pp6/6rP/5N1Q/Pq2r1P1/3R2RK b - - 4 32', opponentMove: 'g6e4',
    solution: ['d1d8', 'f6e8', 'd8e8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0030b',
    gameUrl: 'https://lichess.org/mhIZR6Mc/black#64', popularity: 62, plays: 195,
  },
  {
    id: '003AX', rating: 983, theme: 'kingsideAttack, mateIn1', themes: ['kingsideAttack', 'mate', 'mateIn1', 'middlegame', 'oneMove'],
    fen: '2r2rk1/5ppp/bq2p3/p2pP1N1/Pb1p2P1/1P2P2P/2QN4/2R1K2R w K - 0 19',
    sourceFen: '2r2rk1/5ppp/bq2p3/p1ppP1N1/Pb1P2P1/1P2P2P/2QN4/2R1K2R b K - 1 18', opponentMove: 'c5d4',
    solution: ['c2h7'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/003AX',
    gameUrl: 'https://lichess.org/kRgejRSt/black#36', popularity: 94, plays: 674,
  },
  {
    id: '003jb', rating: 960, theme: 'fork', themes: ['crushing', 'fork', 'master', 'middlegame', 'short'],
    fen: 'r3kb1r/p4ppp/b3p3/2pq4/3Q4/4BN2/PPP2PPP/R3K2R w KQkq - 0 12',
    sourceFen: 'r3kb1r/p4ppp/b1p1p3/3q4/3Q4/4BN2/PPP2PPP/R3K2R b KQkq - 0 11', opponentMove: 'c6c5',
    solution: ['d4a4', 'a6b5', 'a4b5'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/003jb',
    gameUrl: 'https://lichess.org/960EzUS0/black#22', popularity: 95, plays: 2682,
  },
  {
    id: '0042j', rating: 550, theme: 'backRankMate, mateIn2', themes: ['backRankMate', 'mate', 'mateIn2', 'middlegame', 'short'],
    fen: '3r2k1/4nppp/pq3b2/1p2p3/2r2P2/2P1NR2/PP1Q2BP/3R2K1 w - - 0 25',
    sourceFen: '3r2k1/4nppp/pq1p1b2/1p2P3/2r2P2/2P1NR2/PP1Q2BP/3R2K1 b - - 0 24', opponentMove: 'd6e5',
    solution: ['d2d8', 'b6d8', 'd1d8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0042j',
    gameUrl: 'https://lichess.org/DuM2FZjg/black#48', popularity: 92, plays: 1454,
  },
  {
    id: '004Ax', rating: 1999, theme: 'exposedKing, rookEndgame', themes: ['crushing', 'endgame', 'exposedKing', 'long', 'rookEndgame'],
    fen: '8/5k2/4R2p/p7/5rPK/8/7P/8 w - - 3 43',
    sourceFen: '8/8/4R1kp/p7/5rPK/8/7P/8 b - - 2 42', opponentMove: 'g6f7',
    solution: ['e6h6', 'f4f6', 'h6h7', 'f7g6', 'h7a7'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/004Ax',
    gameUrl: 'https://lichess.org/x2mMwVJD/black#84', popularity: 92, plays: 654,
  },
  {
    id: '004nd', rating: 898, theme: 'fork', themes: ['crushing', 'fork', 'middlegame', 'short'],
    fen: '3q2k1/3r4/pp3p1Q/2b1n3/P3N3/2P5/1P4PP/R6K w - - 1 25',
    sourceFen: '3q2k1/2r5/pp3p1Q/2b1n3/P3N3/2P5/1P4PP/R6K b - - 0 24', opponentMove: 'c7d7',
    solution: ['e4f6', 'd8f6', 'h6f6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/004nd',
    gameUrl: 'https://lichess.org/IajkZZBp/black#48', popularity: 83, plays: 209,
  },
  {
    id: '004sg', rating: 2436, theme: 'clearance, hangingPiece, quietMove', themes: ['advantage', 'clearance', 'endgame', 'hangingPiece', 'long', 'quietMove'],
    fen: '6k1/p3b2p/1p1pP3/2P3P1/2np3B/P6P/3Q3K/8 b - - 0 38',
    sourceFen: '6k1/p3b2p/1p1pP3/2p3P1/1Pnp3B/P6P/3Q3K/8 w - - 0 38', opponentMove: 'b4c5',
    solution: ['c4d2', 'c5c6', 'd6d5', 'g5g6', 'e7d6'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/004sg',
    gameUrl: 'https://lichess.org/pSRIvt7K#75', popularity: 90, plays: 1391,
  },
  {
    id: '0054a', rating: 1442, theme: 'Tactics', themes: ['advantage', 'middlegame', 'short'],
    fen: 'r1b2rk1/ppq2p1p/6p1/4b2Q/4R3/3B4/PP3PPP/R1B3K1 w - - 0 16',
    sourceFen: 'r1b2rk1/ppq2ppp/8/4b2Q/4R3/3B4/PP3PPP/R1B3K1 b - - 1 15', opponentMove: 'g7g6',
    solution: ['h5e5', 'c7e5', 'e4e5'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0054a',
    gameUrl: 'https://lichess.org/kZlE1pvD/black#30', popularity: 97, plays: 7909,
  },
  {
    id: '0055Y', rating: 2055, theme: 'defensiveMove', themes: ['advantage', 'defensiveMove', 'middlegame', 'short'],
    fen: 'r1b2rk1/p3pp2/2B5/2Qpq3/3N2pp/4b3/2P2PPP/1R2K2R w K - 0 24',
    sourceFen: 'r1b2rk1/p3pp2/2B4b/2Qpq3/3N2pp/4P3/2P2PPP/1R2K2R b K - 1 23', opponentMove: 'h6e3',
    solution: ['f2e3', 'e5e3', 'e1d1'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0055Y',
    gameUrl: 'https://lichess.org/7Jpwzowt/black#46', popularity: 80, plays: 149,
  },
  {
    id: '005N7', rating: 684, theme: 'backRankMate, mateIn2', themes: ['backRankMate', 'endgame', 'hangingPiece', 'mate', 'mateIn2', 'short'],
    fen: 'r6k/2q3pp/8/2p5/R1np4/7P/2PB1PP1/6K1 w - - 0 33',
    sourceFen: 'r6k/2q3pp/8/2p1n3/R1Qp4/7P/2PB1PP1/6K1 b - - 0 32', opponentMove: 'e5c4',
    solution: ['a4a8', 'c7b8', 'a8b8'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/005N7',
    gameUrl: 'https://lichess.org/jxZhmGhg/black#64', popularity: 95, plays: 1926,
  },
  {
    id: '005ws', rating: 2361, theme: 'knightEndgame, quietMove, veryLong', themes: ['crushing', 'endgame', 'knightEndgame', 'master', 'masterVsMaster', 'quietMove', 'veryLong'],
    fen: '8/8/4Kpp1/7p/3N2kP/8/8/8 b - - 3 62',
    sourceFen: '8/8/5pp1/3K3p/3N2kP/8/8/8 w - - 2 62', opponentMove: 'd5e6',
    solution: ['g6g5', 'h4g5', 'f6g5', 'e6d5', 'h5h4', 'd5e4', 'h4h3', 'd4f3', 'g4g3'], source: 'Lichess CC0',
    sourceUrl: 'https://lichess.org/training/005ws', gameUrl: 'https://lichess.org/LOwACSXb#123', popularity: 93, plays: 2488,
  },
  {
    id: '006of', rating: 2608, theme: 'kingsideAttack', themes: ['advantage', 'kingsideAttack', 'long', 'middlegame'],
    fen: 'r2qr2k/1pp2Qp1/1b4np/pP2P3/P4n2/B1N2N1P/5PP1/R3R1K1 b - - 0 20',
    sourceFen: 'r2qr2k/1pp2pp1/1b4np/pP2P3/P4n2/BQN2N1P/5PP1/R3R1K1 w - - 3 20', opponentMove: 'b3f7',
    solution: ['d8d3', 'c3e2', 'f4e2', 'e1e2', 'd3e2'], source: 'Lichess CC0',
    sourceUrl: 'https://lichess.org/training/006of', gameUrl: 'https://lichess.org/MIdWd89x#39', popularity: 89, plays: 990,
  },
  {
    id: '0072T', rating: 2299, theme: 'kingsideAttack', themes: ['advantage', 'kingsideAttack', 'master', 'middlegame', 'short'],
    fen: '3q1nk1/1bN2rpp/pp1P4/8/3Nn2b/8/PPP2PPP/R1BQ1RK1 b - - 2 16',
    sourceFen: '3q1nk1/1bN2rpp/pp1P4/1N6/4n2b/8/PPP2PPP/R1BQ1RK1 w - - 1 16', opponentMove: 'b5d4',
    solution: ['h4f2', 'f1f2', 'e4f2'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/0072T',
    gameUrl: 'https://lichess.org/aqhibPRF#31', popularity: 87, plays: 522,
  },
  {
    id: '007HB', rating: 538, theme: 'mate, mateIn1', themes: ['mate', 'mateIn1', 'middlegame', 'oneMove'],
    fen: 'rn2q1k1/pp3ppp/2pb4/3p1B2/2PN4/1Q6/PP3PPP/R1B4K b - - 0 15',
    sourceFen: 'rn2q1k1/pp3ppp/2pb4/3p1B2/2Pn4/1Q3N2/PP3PPP/R1B4K w - - 0 15', opponentMove: 'f3d4',
    solution: ['e8e1'], source: 'Lichess CC0', sourceUrl: 'https://lichess.org/training/007HB',
    gameUrl: 'https://lichess.org/prYQo0BK#29', popularity: 86, plays: 185,
  },
];

export const getPuzzlePool = (rating: number) => {
  const lower = rating - 350;
  const upper = rating + 350;
  const inBand = puzzleRushPuzzles.filter((puzzle) => puzzle.rating >= lower && puzzle.rating <= upper);
  return inBand.length > 0 ? inBand : [...puzzleRushPuzzles].sort((a, b) =>
    Math.abs(a.rating - rating) - Math.abs(b.rating - rating)
  ).slice(0, 1);
};
