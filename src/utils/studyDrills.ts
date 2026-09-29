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
  {
    id: 'lucena-position',
    title: 'The Lucena Position (Building a Bridge)',
    concept: 'Bridge Building Technique',
    difficulty: 'Intermediate',
    summary: 'The fundamental winning method in rook endgames. White lifts the rook to the 4th rank to build a bridge, shielding the king from checks and forcing promotion.',
    objective: 'Lift your rook with Rc4, step your king out with Rd4+ and Kc7, and interpose your rook with Rb4! to win.',
    fen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1',
    playerColor: 'w',
    moves: ['Rc4', 'Ra1', 'Rd4+', 'Ke7', 'Kc7', 'Rc1+', 'Kb6', 'Rb1+', 'Kc6', 'Rc1+', 'Kb5', 'Rb1+', 'Rb4'],
    keyIdeas: [
      '1. Rc4! lifts the rook to the 4th rank to prepare the cross-board bridge.',
      'Use a lateral check with Rd4+ to force the enemy king one file further away.',
      'Step the king out and interpose the rook with Rb4! when checked down the file.',
    ],
  },
  {
    id: 'philidor-defense',
    title: 'The Philidor Defense (3rd/6th Rank)',
    concept: 'Passive Rook & Distant Checks',
    difficulty: 'Intermediate',
    summary: 'The definitive defensive drawing method in rook endgames. Keep the rook on the 6th rank to block the enemy king, then drop to the 1st rank for endless checks.',
    objective: 'Hold the 6th rank with your rook until the pawn advances, then retreat to the back rank (Ra1!) to give perpetual checks.',
    fen: '4k3/R7/r7/4K3/4P3/8/8/8 b - - 0 1',
    playerColor: 'b',
    moves: ['Rb6', 'Kd5', 'Ra6', 'e5', 'Ra1', 'Ke6', 'Re1+', 'Kd6', 'Rd1+'],
    keyIdeas: [
      'Keep the rook on the 6th rank to build a horizontal barrier against the attacking king.',
      'The moment the enemy pawn advances (e5), the king loses its forward shelter.',
      'Drop the rook to the 1st rank (Ra1!) immediately and give endless checks from behind.',
    ],
  },
  {
    id: 'king-queen-mate',
    title: 'King and Queen vs King Checkmate',
    concept: 'The Shrinking Box Technique',
    difficulty: 'Beginner',
    summary: 'The queen stays a knight distance away from the enemy king, steadily shrinking the rectangular cage until the king is forced to the rim.',
    objective: 'Use the queen to shrink the boundary box, bring your king close to provide protection, and deliver checkmate on the edge.',
    fen: '8/8/8/4k3/8/8/8/QK6 w - - 0 1',
    playerColor: 'w',
    moves: ['Qd4', 'Ke6', 'Kc2', 'Kf5', 'Kd3', 'Ke6', 'Qe4+', 'Kd6', 'Kd4', 'Kd7', 'Qe5', 'Kc6', 'Qd5+', 'Kc7', 'Kc5', 'Kb8', 'Qd7', 'Ka8', 'Kb6', 'Kb8', 'Qb7#'],
    keyIdeas: [
      'Keep the queen a knight distance away from the enemy king to control escape squares without checking.',
      'Steadily shrink the box to drive the king to the edge.',
      'Beware of stalemate: never leave the enemy king with zero legal moves without delivering check.',
    ],
  },
  {
    id: 'king-rook-mate',
    title: 'King and Rook vs King Checkmate',
    concept: 'The Box and Corridor Method',
    difficulty: 'Beginner',
    summary: 'A rook cannot mate alone. Your king must oppose the enemy king to control the three transit squares while the rook slices down the file or rank.',
    objective: 'Use the rook to slice off ranks, march your king to establish direct opposition, and drive the enemy king to the rim.',
    fen: '8/8/4k3/8/8/4K3/8/R7 w - - 0 1',
    playerColor: 'w',
    moves: ['Ra5', 'Kd6', 'Ke4', 'Kc6', 'Kd4', 'Kb6', 'Rh5', 'Kc6', 'Rg5', 'Kd6', 'Rg6+', 'Ke7', 'Ke5', 'Kf7', 'Ra6', 'Kg7', 'Kf5', 'Kh7', 'Kg5', 'Kg7', 'Ra7+', 'Kf8', 'Kf6', 'Ke8', 'Ke6', 'Kd8', 'Kd6', 'Kc8', 'Rh7', 'Kb8', 'Kc6', 'Ka8', 'Kb6', 'Kb8', 'Rh8#'],
    keyIdeas: [
      'Use the rook as a barrier to cut off ranks and files.',
      'Wait with tempo moves (like Rh5-g5) when the opponent avoids opposition.',
      'When the kings stand in direct opposition, the rook check forces the king to step back.',
    ],
  },
  {
    id: 'queen-vs-pawn-7th',
    title: 'Queen vs Pawn on the 7th Rank',
    concept: 'Center Pawn Win via Triangular Advance',
    difficulty: 'Advanced',
    summary: 'When an enemy pawn reaches the 7th rank, the queen must check and pin the pawn, forcing the enemy king in front of it to gain tempi for your king to march up.',
    objective: 'Check the king, pin the pawn, force the defender in front of the pawn, and bring your king closer to deliver checkmate.',
    fen: '8/8/8/8/8/2K5/4p3/3k2Q1 w - - 0 1',
    playerColor: 'w',
    moves: ['Qd4+', 'Ke1', 'Qe3', 'Kf1', 'Qf3+', 'Ke1', 'Kd3', 'Kd1', 'Qxe2+', 'Kc1', 'Qc2#'],
    keyIdeas: [
      'Give checks until the defending king is forced onto the promotion square in front of its own pawn.',
      'When the pawn is blocked, use the free tempo to march your attacking king closer.',
      'Repeat the process until your king and queen coordinate to deliver checkmate.',
    ],
  },
];

export const getEndgameDrills = (): PuzzleRushPuzzle[] =>
  puzzleRushPuzzles.filter((puzzle) => puzzle.themes.includes('endgame'));

export const getEndgamePrincipleLessons = (): EndgamePrincipleLesson[] =>
  endgamePrincipleLessons;

export const getEndgamePrincipleLessonById = (id: string): EndgamePrincipleLesson | null =>
  endgamePrincipleLessons.find((lesson) => lesson.id === id) ?? null;
