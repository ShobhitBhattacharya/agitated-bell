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
