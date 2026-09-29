export type StudyOpening = {
  id: string;
  name: string;
  eco: string;
  summary: string;
  keyIdeas: string[];
  sampleMoves: string[];
};

export type StudyMatePattern = {
  id: string;
  name: string;
  motif: string;
  summary: string;
  keyMoves: string[];
  theme: string;
};

export type TheoryLessonCategory = 'opening' | 'checkmate-pattern';

export type AdaptiveTrainerPrompt = {
  type: 'f7-weakness' | 'queen-early' | 'development-lag';
  title: string;
  message: string;
  lessonId: string;
  suggestedPractice: string;
  count: number;
};

export type TheoryLesson = {
  id: string;
  category: TheoryLessonCategory;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objective: string;
  keyIdeas: string[];
  keyMoves: string[];
  theme: string;
  eco?: string;
};

const openingCatalog: StudyOpening[] = [
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    eco: 'B20-B99',
    summary: 'A counterattacking opening where Black challenges White in the center and creates asymmetry.',
    keyIdeas: ['Counterplay on c5', 'Asymmetrical structure', 'Dynamic queenside pressure'],
    sampleMoves: ['e4', 'c5', 'Nf3', 'd6'],
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    eco: 'D06-D69',
    summary: 'White offers a pawn to gain central control and long-term pressure on the queenside.',
    keyIdeas: ['Central tension', 'd4 and c4 setup', 'Queenside minority attack'],
    sampleMoves: ['d4', 'd5', 'c4'],
  },
  {
    id: 'italian-game',
    name: 'Italian Game',
    eco: 'C50-C59',
    summary: 'One of the most straightforward openings with rapid development and kingside pressure.',
    keyIdeas: ['Bishop on c4', 'Rapid development', 'Fianchetto ideas'],
    sampleMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
  },
  {
    id: 'kings-indian-defense',
    name: "King's Indian Defense",
    eco: 'E60-E99',
    summary: 'Black fianchettoes the kingside bishop and prepares a dynamic kingside counterattack.',
    keyIdeas: ['Fianchetto', 'Hypermodern defense', 'Central break d5'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'g6'],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    eco: 'C60-C99',
    summary: 'One of the oldest and classical openings, putting immediate pressure on Black\'s central defender.',
    keyIdeas: ['Pressure on c6 knight', 'Pawn center d4', 'Flexible bishop maneuver Bb5-a4-b3'],
    sampleMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  },
  {
    id: 'french-defense',
    name: 'French Defense',
    eco: 'C10-C14',
    summary: 'Solid positional defense where Black accepts a cramped position to counterattack White\'s d4 pawn chain.',
    keyIdeas: ['Solid pawn chain', 'Counterattack with ...c5', 'Bad light-squared bishop challenge'],
    sampleMoves: ['e4', 'e6', 'd4', 'd5'],
  },
  {
    id: 'caro-kann-defense',
    name: 'Caro-Kann Defense',
    eco: 'B10-B19',
    summary: 'Extremely resilient defense supporting ...d5 with ...c6 without trapping Black\'s light-squared bishop.',
    keyIdeas: ['Active light-squared bishop', 'Solid pawn structure', 'Endgame resilience'],
    sampleMoves: ['e4', 'c6', 'd4', 'd5'],
  },
  {
    id: 'scandinavian-defense',
    name: 'Scandinavian Defense',
    eco: 'B01',
    summary: 'Black immediately challenges White\'s e4 pawn on move 1, forcing an open center and rapid development.',
    keyIdeas: ['Immediate central confrontation', 'Queen retreat to a5/d6', 'Open center lines'],
    sampleMoves: ['e4', 'd5', 'exd5', 'Qxd5'],
  },
  {
    id: 'english-opening',
    name: 'English Opening',
    eco: 'A10-A39',
    summary: 'Flank opening playing c4 on move 1 to control d5 and establish flexible positional pressure.',
    keyIdeas: ['Flank control of d5', 'Kingside fianchetto Bg2', 'Reversed Sicilian structures'],
    sampleMoves: ['c4', 'e5', 'Nc3', 'Nf6'],
  },
  {
    id: 'london-system',
    name: 'London System',
    eco: 'D02',
    summary: 'Reliable, universal setup with d4, Nf3, and early Bf4 outside the pawn chain before playing e3.',
    keyIdeas: ['Bishop outside the pawn chain', 'Solid pyramid pawn structure', 'Harmonious development'],
    sampleMoves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
  },
  {
    id: 'nimzo-indian-defense',
    name: 'Nimzo-Indian Defense',
    eco: 'E20-E59',
    summary: 'Hypermodern defense where Black pins White\'s c3 knight with ...Bb4 to disrupt White\'s pawn center.',
    keyIdeas: ['Pinning the c3 knight', 'Inflicting doubled c-pawns on White', 'Control of e4'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
  },
  {
    id: 'vienna-game',
    name: 'Vienna Game',
    eco: 'C25-C29',
    summary: 'Dynamic opening keeping options open by playing Nc3 before deciding on f4 or rapid kingside expansion.',
    keyIdeas: ['Flexible 2. Nc3 development', 'Vienna Gambit with f4', 'Kingside attacking chances'],
    sampleMoves: ['e4', 'e5', 'Nc3'],
  },
];

const matePatternCatalog: StudyMatePattern[] = [
  {
    id: 'fools-mate',
    name: "Fool's Mate",
    motif: 'Checkmate with queen and bishop on f7',
    summary: 'The fastest possible checkmate in chess, using the queen and bishop to attack the f7 square.',
    keyMoves: ['f3', 'e5', 'g4', 'Qh4#'],
    theme: 'Fastest mate',
  },
  {
    id: 'scholars-mate',
    name: "Scholar's Mate",
    motif: 'Queen and bishop battery on f7',
    summary: 'A classic pattern where the queen and bishop combine to deliver mate on f7.',
    keyMoves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Queen battery',
  },
  {
    id: 'legal-mate',
    name: "Legal's Mate",
    motif: 'Knight and queen combination',
    summary: 'A known mating pattern built on tactical ideas with the queen and knight.',
    keyMoves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'h6', 'Nc3', 'c6', 'Nxe5', 'dxe5', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Knight support',
  },
  {
    id: 'smothered-mate',
    name: 'Smothered Mate',
    motif: 'Queen and knight restrict the king',
    summary: 'The king is trapped by friendly pieces and cannot move because the escape squares are controlled.',
    keyMoves: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qd2', 'Bxc6', 'Qxf3', 'Nc6'],
    theme: 'King trapped',
  },
];

export const theoryLessons: TheoryLesson[] = [
  {
    id: 'scholars-mate',
    category: 'checkmate-pattern',
    name: "Scholar's Mate",
    difficulty: 'Beginner',
    summary: 'Use the queen and bishop together to attack the vulnerable f7 square.',
    objective: 'Deliver a fast checkmate using the queen-bishop battery.',
    keyIdeas: ['Develop the bishop to c4', 'Push the queen to h5', 'Exploit the f7 weakness'],
    keyMoves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Queen battery',
  },
  {
    id: 'fools-mate',
    category: 'checkmate-pattern',
    name: "Fool's Mate",
    difficulty: 'Beginner',
    summary: 'The fastest possible checkmate happens when the kingside is left unguarded.',
    objective: 'Defend your king before the queen and bishop finish the attack.',
    keyIdeas: ['Do not move the f-pawn early', 'Protect the vulnerable f7 square', 'Use development before attacking'],
    keyMoves: ['f3', 'e5', 'g4', 'Qh4#'],
    theme: 'Fastest mate',
  },
  {
    id: 'sicilian-defense',
    category: 'opening',
    name: 'Sicilian Defense',
    difficulty: 'Intermediate',
    summary: 'Black challenges White in the center and creates a complex asymmetric structure.',
    objective: 'Counter White’s central pawn advance with c5 and develop active pieces.',
    keyIdeas: ['Counterplay on c5', 'Asymmetrical structure', 'Dynamic queenside pressure'],
    keyMoves: ['e4', 'c5', 'Nf3', 'd6'],
    theme: 'Counterattacking',
    eco: 'B20-B99',
  },
  {
    id: 'queens-gambit',
    category: 'opening',
    name: "Queen's Gambit",
    difficulty: 'Intermediate',
    summary: 'White offers a pawn to gain central control and long-term pressure.',
    objective: 'Use the c4 break and central tension to weaken Black’s structure.',
    keyIdeas: ['Central tension', 'd4 and c4 setup', 'Queenside minority attack'],
    keyMoves: ['d4', 'd5', 'c4'],
    theme: 'Central tension',
    eco: 'D06-D69',
  },
  {
    id: 'italian-game',
    category: 'opening',
    name: 'Italian Game',
    difficulty: 'Beginner',
    summary: 'A straightforward opening with quick development and a strong bishop on c4.',
    objective: 'Develop rapidly and create pressure on the f7 square.',
    keyIdeas: ['Bishop on c4', 'Rapid development', 'Fianchetto ideas'],
    keyMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    theme: 'Development',
    eco: 'C50-C59',
  },
  {
    id: 'kings-indian-defense',
    category: 'opening',
    name: "King's Indian Defense",
    difficulty: 'Advanced',
    summary: 'Black invites White to build a big center before attacking it with counterplay.',
    objective: 'Prepare active piece play and punish a central advance with counterplay.',
    keyIdeas: ['Fianchetto', 'Hypermodern defense', 'Central break d5'],
    keyMoves: ['d4', 'Nf6', 'c4', 'g6'],
    theme: 'Hypermodern',
    eco: 'E60-E99',
  },
  {
    id: 'ruy-lopez',
    category: 'opening',
    name: 'Ruy Lopez',
    difficulty: 'Intermediate',
    summary: 'One of the deepest and most enduring openings in chess, testing Black\'s center immediately.',
    objective: 'Pressure Black\'s e5 pawn by threatening the knight defender on c6 and castle rapidly.',
    keyIdeas: ['Pressure on c6 knight', 'Pawn center d4', 'Flexible bishop maneuver Bb5-a4-b3'],
    keyMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O'],
    theme: 'Classical pressure',
    eco: 'C60-C99',
  },
  {
    id: 'french-defense',
    category: 'opening',
    name: 'French Defense',
    difficulty: 'Intermediate',
    summary: 'Solid counterattacking system creating asymmetrical pawn chains and central tension.',
    objective: 'Challenge White\'s center with ...d5 and undermine the d4 pawn base with ...c5.',
    keyIdeas: ['Solid pawn chain', 'Counterattack with ...c5', 'Bad light-squared bishop challenge'],
    keyMoves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Be7'],
    theme: 'Pawn chain counterplay',
    eco: 'C10-C14',
  },
  {
    id: 'caro-kann-defense',
    category: 'opening',
    name: 'Caro-Kann Defense',
    difficulty: 'Intermediate',
    summary: 'A rock-solid defense preparing ...d5 while leaving the c8-h3 diagonal open for Black\'s bishop.',
    objective: 'Establish a safe pawn structure, develop the light-squared bishop to f5, and reach a favorable endgame.',
    keyIdeas: ['Active light-squared bishop', 'Solid pawn structure', 'Endgame resilience'],
    keyMoves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5'],
    theme: 'Positional solidity',
    eco: 'B10-B19',
  },
  {
    id: 'scandinavian-defense',
    category: 'opening',
    name: 'Scandinavian Defense',
    difficulty: 'Beginner',
    summary: 'Directly strikes at White\'s e4 pawn on move 1, eliminating White\'s central pawn advantage.',
    objective: 'Force open the d-file, castle queenside, and maintain active piece pressure.',
    keyIdeas: ['Immediate central confrontation', 'Queen retreat to a5/d6', 'Open center lines'],
    keyMoves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6'],
    theme: 'Direct challenge',
    eco: 'B01',
  },
  {
    id: 'english-opening',
    category: 'opening',
    name: 'English Opening',
    difficulty: 'Advanced',
    summary: 'Flank strategy controlling the d5 square with the c-pawn, creating flexible multi-piece plans.',
    objective: 'Control d5 from the flank, fianchetto on g2, and pressure the queenside.',
    keyIdeas: ['Flank control of d5', 'Kingside fianchetto Bg2', 'Reversed Sicilian structures'],
    keyMoves: ['c4', 'e5', 'Nc3', 'Nf6', 'g3', 'd5', 'cxd5', 'Nxd5'],
    theme: 'Flank strategy',
    eco: 'A10-A39',
  },
  {
    id: 'london-system',
    category: 'opening',
    name: 'London System',
    difficulty: 'Beginner',
    summary: 'Universal pawn structure that can be played against virtually any Black defense.',
    objective: 'Develop the dark-squared bishop to f4 before locking the center with e3 and c3.',
    keyIdeas: ['Bishop outside the pawn chain', 'Solid pyramid pawn structure', 'Harmonious development'],
    keyMoves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4', 'c5', 'e3', 'Nc6'],
    theme: 'System development',
    eco: 'D02',
  },
  {
    id: 'nimzo-indian-defense',
    category: 'opening',
    name: 'Nimzo-Indian Defense',
    difficulty: 'Advanced',
    summary: 'Pins White\'s knight on c3 to prevent e4 and challenge White\'s queenside pawn structure.',
    objective: 'Pin and exchange on c3 to double White\'s c-pawns, targeting the doubled pawn weakness.',
    keyIdeas: ['Pinning the c3 knight', 'Inflicting doubled c-pawns on White', 'Control of e4'],
    keyMoves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O'],
    theme: 'Imbalance & structural fight',
    eco: 'E20-E59',
  },
  {
    id: 'vienna-game',
    category: 'opening',
    name: 'Vienna Game',
    difficulty: 'Intermediate',
    summary: 'Classical open game aiming to strike with f4 while preventing early counterpunches with Nc3.',
    objective: 'Disrupt Black\'s center with f4 and mount a rapid kingside offensive.',
    keyIdeas: ['Flexible 2. Nc3 development', 'Vienna Gambit with f4', 'Kingside attacking chances'],
    keyMoves: ['e4', 'e5', 'Nc3', 'Nf6', 'f4', 'd5', 'fxe5', 'Nxe4'],
    theme: 'Tactical gambit play',
    eco: 'C25-C29',
  },
];

const normalizeMove = (move: string) => move.trim().toLowerCase().replace(/\s+/g, ' ');

const matchSequence = (moveList: string[], pattern: string[]) => {
  if (pattern.length === 0) return true;
  if (moveList.length < pattern.length) return false;

  for (let i = 0; i < pattern.length; i++) {
    if (normalizeMove(moveList[i]) !== normalizeMove(pattern[i])) {
      return false;
    }
  }

  return true;
};

export const detectOpeningFromMoves = (moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);

  for (const opening of openingCatalog) {
    if (matchSequence(normalizedMoves, opening.sampleMoves)) {
      return opening;
    }
  }

  return null;
};

export const detectMatePatternFromMoves = (moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);

  for (const pattern of matePatternCatalog) {
    if (matchSequence(normalizedMoves, pattern.keyMoves)) {
      return pattern;
    }
  }

  return null;
};

export const getTheoryLessonsByCategory = (category: TheoryLessonCategory) =>
  theoryLessons.filter((lesson) => lesson.category === category);

export const getTheoryLessonById = (id: string) =>
  theoryLessons.find((lesson) => lesson.id === id) ?? null;

export const getLessonProgress = (lesson: TheoryLesson, moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);
  let matched = 0;

  for (let i = 0; i < lesson.keyMoves.length; i++) {
    const expected = normalizeMove(lesson.keyMoves[i]);
    const actual = normalizedMoves[i];

    if (actual === expected) {
      matched += 1;
    } else {
      break;
    }
  }

  return matched;
};

export const getLessonTargetMove = (lesson: TheoryLesson) => lesson.keyMoves[lesson.keyMoves.length - 1] ?? null;

export const createLessonPositionFEN = (lesson: TheoryLesson) => {
  const fenMap: Record<string, string> = {
    'scholars-mate': 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 6',
    'fools-mate': 'rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    'sicilian-defense': 'rnbqkbnr/1p1ppppp/p1n5/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3',
    'queens-gambit': 'rnbqkbnr/ppp1pppp/8/3p4/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',
    'italian-game': 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
    'kings-indian-defense': 'rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',
  };

  return fenMap[lesson.id] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
};

export const detectRecurringMistakes = (moves: string[]): AdaptiveTrainerPrompt[] => {
  const normalized = moves.map(normalizeMove);
  const mistakes: AdaptiveTrainerPrompt[] = [];

  const queenEarlyCount = normalized.slice(0, 8).filter((move) => /^[q]/.test(move)).length;
  if (queenEarlyCount >= 1) {
    mistakes.push({
      type: 'queen-early',
      title: 'You are moving the queen out too early',
      message: 'Early queen sorties often create tactical vulnerabilities and give your opponent time to attack your king.',
      lessonId: 'scholars-mate',
      suggestedPractice: 'Develop minor pieces first and keep the queen for a tactical finish.',
      count: queenEarlyCount,
    });
  }

  const f7WeaknessSignals = normalized.filter(
    (move) => move === 'f3' || move === 'g4' || move.startsWith('qh4') || move.includes('qxf7')
  );
  if (f7WeaknessSignals.length >= 2) {
    mistakes.push({
      type: 'f7-weakness',
      title: 'You keep leaving the f7 square weak',
      message: 'The f7 square is a classic target. Repeated early pawn moves and queen checks often make it easier for the opponent to attack.',
      lessonId: 'fools-mate',
      suggestedPractice: 'Protect the king and avoid weakening the f7 square before development is complete.',
      count: f7WeaknessSignals.length,
    });
  }

  const developmentLag = normalized.slice(0, 8).filter((move) => !/^(e4|e5|d4|d5|c4|c5|nf3|nc3|bc4|bb5|f3|g4)$/.test(move));
  if (developmentLag.length >= 2) {
    mistakes.push({
      type: 'development-lag',
      title: 'Your development is lagging behind',
      message: 'A slow opening often turns into tactical trouble. Try to develop pieces and castle before chasing long-term threats.',
      lessonId: 'italian-game',
      suggestedPractice: 'Develop your knights and bishops before making extra pawn moves.',
      count: developmentLag.length,
    });
  }

  return mistakes;
};

export const getAdaptiveTrainerPrompt = (moves: string[]) => {
  const mistakes = detectRecurringMistakes(moves);
  if (mistakes.length === 0) return null;

  const severityOrder: Record<string, number> = {
    'f7-weakness': 3,
    'queen-early': 2,
    'development-lag': 1,
  };

  const bestMatch = mistakes.sort((a, b) => {
    const severityDelta = (severityOrder[b.type] ?? 0) - (severityOrder[a.type] ?? 0);
    if (severityDelta !== 0) return severityDelta;
    return b.count - a.count;
  })[0];

  return bestMatch;
};
