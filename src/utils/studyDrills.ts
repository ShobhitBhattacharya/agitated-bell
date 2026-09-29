import { puzzleRushPuzzles, PuzzleRushPuzzle } from './puzzleRush';

export interface EndgamePrincipleLesson {
  id: string;
  title: string;
  concept: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objective: string;
  fen: string;
  playerColor: 'w' | 'b';
  moves: string[]; // SAN moves
  keyIdeas: string[];
}

export const endgamePrincipleLessons: EndgamePrincipleLesson[] = [
  {
    id: 'direct-opposition',
    title: 'The Direct Opposition',
    concept: 'Opposition',
    difficulty: 'Beginner',
    summary: 'When kings face each other with one square between, the side not having to move has the opposition and controls key squares.',
    objective: 'Take the opposition with your king on the 6th rank, outflank Black, and escort your pawn to queen.',
    fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
    playerColor: 'w',
    moves: ['Kd6', 'Kd8', 'e6', 'Ke8', 'e7', 'Kf7', 'Kd7', 'Kf6', 'e8=Q'],
    keyIdeas: [
      'Advance the pawn to the 7th rank without checking the defender.',
      'Control the promotion square with the attacking king.',
      'Do not stalemate the defending king.',
    ],
  },
  {
    id: 'square-of-the-pawn',
    title: 'The Square of the Pawn',
    concept: 'Rule of the Square',
    difficulty: 'Beginner',
    summary: 'Draw a mental square from the passed pawn to its promotion square. If the enemy king cannot enter this square, the pawn promotes unaided.',
    objective: 'Push the outside passed pawn to promotion before the enemy king can enter the square.',
    fen: '8/8/8/5k2/P7/8/8/4K3 w - - 0 1',
    playerColor: 'w',
    moves: ['a5', 'Ke6', 'a6', 'Kd7', 'a7', 'Kc7', 'a8=Q'],
    keyIdeas: [
      'Each pawn advance shrinks the boundary square by one rank.',
      'An unaccompanied passed pawn wins when the defender is outside the square.',
      'Avoid wasting tempi with unnecessary king moves when the pawn is clear.',
    ],
  },
  {
    id: 'rook-behind-passed-pawn',
    title: 'Rook Behind Passed Pawn',
    concept: 'Tarrasch Principle',
    difficulty: 'Intermediate',
    summary: 'Rooks belong behind passed pawns—supporting their advance and clearing the path for the king to escort promotion.',
    objective: 'Support the passed pawn, use lateral rook checks to deflect the defending king, and win.',
    fen: 'r7/3kP3/5K2/8/8/8/8/4R3 w - - 0 1',
    playerColor: 'w',
    moves: ['Kf7', 'Re8', 'Rd1+', 'Kc7', 'Kxe8', 'Kc6', 'Kd8'],
    keyIdeas: [
      'Place the rook behind the pawn to maximize file control.',
      'Use lateral checks to force the defender away from the promotion square.',
      'Capture the blocking rook to ensure decisive promotion.',
    ],
  },
  {
    id: 'pawn-breakthrough',
    title: 'The Pawn Breakthrough',
    concept: 'Pawn Structure Sacrifice',
    difficulty: 'Advanced',
    summary: 'In equal pawn structures, a sacrificial thrust can blow open a file to create an unstoppable passed pawn.',
    objective: 'Sacrifice the center pawn to force open a flank and queen your outside passed pawn.',
    fen: '7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1',
    playerColor: 'w',
    moves: ['b6', 'axb6', 'c6', 'bxc6', 'a6', 'b5', 'a7', 'b4', 'a8=Q+'],
    keyIdeas: [
      '1. b6! threatens both bxa7 and bxc7, forcing a capture.',
      'Sacrifice the second pawn to eliminate the remaining defender.',
      'The outside pawn marches unobstructed to become a queen.',
    ],
  },
];

export const getEndgameDrills = (): PuzzleRushPuzzle[] =>
  puzzleRushPuzzles.filter((puzzle) => puzzle.themes.includes('endgame'));

export const getEndgamePrincipleLessons = (): EndgamePrincipleLesson[] =>
  endgamePrincipleLessons;

export const getEndgamePrincipleLessonById = (id: string): EndgamePrincipleLesson | null =>
  endgamePrincipleLessons.find((lesson) => lesson.id === id) ?? null;
