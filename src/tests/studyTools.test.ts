import { describe, it, expect } from 'vitest';
import { detectOpeningFromMoves, detectMatePatternFromMoves } from '../utils/studyTools';

describe('study tools', () => {
  it('detects Fool\'s Mate from the classic early attack', () => {
    const result = detectMatePatternFromMoves(['f3', 'e5', 'g4', 'Qh4#']);

    expect(result).toBeDefined();
    expect(result?.id).toBe('fools-mate');
    expect(result?.name).toBe("Fool's Mate");
  });

  it('detects Scholar\'s Mate from the famous mating pattern', () => {
    const result = detectMatePatternFromMoves(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#']);

    expect(result).toBeDefined();
    expect(result?.id).toBe('scholars-mate');
  });

  it('detects the Sicilian Defense from the opening move order', () => {
    const result = detectOpeningFromMoves(['e4', 'c5', 'Nf3', 'd6']);

    expect(result).toBeDefined();
    expect(result?.id).toBe('sicilian-defense');
    expect(result?.name).toBe('Sicilian Defense');
  });

  it('detects the Queen\'s Gambit from the opening move order', () => {
    const result = detectOpeningFromMoves(['d4', 'd5', 'c4']);

    expect(result).toBeDefined();
    expect(result?.id).toBe('queens-gambit');
  });

  it('detects Ruy Lopez, French Defense, and London System', () => {
    const ruy = detectOpeningFromMoves(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
    expect(ruy).toBeDefined();
    expect(ruy?.id).toBe('ruy-lopez');

    const french = detectOpeningFromMoves(['e4', 'e6', 'd4', 'd5']);
    expect(french).toBeDefined();
    expect(french?.id).toBe('french-defense');

    const london = detectOpeningFromMoves(['d4', 'd5', 'Nf3', 'Nf6', 'Bf4']);
    expect(london).toBeDefined();
    expect(london?.id).toBe('london-system');
  });
});
