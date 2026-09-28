import { puzzleRushPuzzles, PuzzleRushPuzzle } from './puzzleRush';

export const getEndgameDrills = (): PuzzleRushPuzzle[] =>
  puzzleRushPuzzles.filter((puzzle) => puzzle.themes.includes('endgame'));
