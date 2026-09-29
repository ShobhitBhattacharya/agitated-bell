import { describe, it, expect } from 'vitest';
import {
  detectOpeningFromMoves,
  detectOpeningWithVariations,
  detectMatePatternFromMoves,
  openingCatalog,
  theoryLessons,
  getOpeningsByPlaystyle,
  getOpeningVariations,
  formatMoveSequence,
  OpeningPlaystyle,
} from '../utils/studyTools';

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

  it('detects openings: Scotch, King\'s Gambit, Slav, Grünfeld, Dutch, Benoni, Vienna', () => {
    const scotch = detectOpeningFromMoves(['e4', 'e5', 'Nf3', 'Nc6', 'd4']);
    expect(scotch?.id).toBe('scotch-game');

    const kingsGambit = detectOpeningFromMoves(['e4', 'e5', 'f4']);
    expect(kingsGambit?.id).toBe('kings-gambit');

    const slav = detectOpeningFromMoves(['d4', 'd5', 'c4', 'c6']);
    expect(slav?.id).toBe('slav-defense');

    const grunfeld = detectOpeningFromMoves(['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5']);
    expect(grunfeld?.id).toBe('grunfeld-defense');

    const dutch = detectOpeningFromMoves(['d4', 'f5']);
    expect(dutch?.id).toBe('dutch-defense');

    const benoni = detectOpeningFromMoves(['d4', 'Nf6', 'c4', 'c5']);
    expect(benoni?.id).toBe('modern-benoni');

    const vienna = detectOpeningFromMoves(['e4', 'e5', 'Nc3']);
    expect(vienna?.id).toBe('vienna-game');
  });

  it('verifies opening catalog contains 18 openings with deep lines (>= 10 plies), variations, and playstyle classification', () => {
    expect(openingCatalog.length).toBe(18);

    const validPlaystyles: OpeningPlaystyle[] = [
      'Aggressive / Tactical',
      'Solid / Defensive',
      'Positional / Strategic',
      'Dynamic / Counterattacking',
    ];

    for (const opening of openingCatalog) {
      expect(opening.id).toBeTruthy();
      expect(opening.name).toBeTruthy();
      expect(opening.eco).toBeTruthy();
      expect(opening.playerBenefit).toBeTruthy();
      expect(validPlaystyles).toContain(opening.playstyle);

      // Verify deep best lines (at least 10 plies / 5 full moves)
      expect(opening.bestLine.length).toBeGreaterThanOrEqual(10);

      // Verify each opening has variations
      expect(opening.variations.length).toBeGreaterThanOrEqual(1);
      for (const variation of opening.variations) {
        expect(variation.id).toBeTruthy();
        expect(variation.name).toBeTruthy();
        expect(variation.eco).toBeTruthy();
        expect(validPlaystyles).toContain(variation.playstyle);
        expect(variation.playerBenefit).toBeTruthy();
        expect(variation.moves.length).toBeGreaterThanOrEqual(8);
      }
    }
  });

  it('detectOpeningWithVariations detects best line, next best move, and candidate variations', () => {
    const moves = ['e4', 'c5'];
    const detected = detectOpeningWithVariations(moves);

    expect(detected).not.toBeNull();
    expect(detected?.opening.id).toBe('sicilian-defense');
    expect(detected?.isFollowingBestLine).toBe(true);
    expect(detected?.nextBestMove).toBe('Nf3');
    expect(detected?.candidateVariations.length).toBeGreaterThanOrEqual(3);
  });

  it('detectOpeningWithVariations detects active variation line when played', () => {
    // Play moves into the Sicilian Dragon variation
    const dragonMoves = [
      'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6',
    ];
    const detected = detectOpeningWithVariations(dragonMoves);

    expect(detected).not.toBeNull();
    expect(detected?.opening.id).toBe('sicilian-defense');
    expect(detected?.activeVariation?.id).toBe('sicilian-dragon');
    expect(detected?.playstyle).toBe('Aggressive / Tactical');
    expect(detected?.nextBestMove).toBe('Be3');
  });

  it('getOpeningsByPlaystyle filters openings accurately', () => {
    const all = getOpeningsByPlaystyle('All');
    expect(all.length).toBe(18);

    const aggressive = getOpeningsByPlaystyle('Aggressive / Tactical');
    expect(aggressive.length).toBeGreaterThan(0);
    expect(aggressive.every((o) => o.playstyle === 'Aggressive / Tactical')).toBe(true);

    const solid = getOpeningsByPlaystyle('Solid / Defensive');
    expect(solid.length).toBeGreaterThan(0);
    expect(solid.every((o) => o.playstyle === 'Solid / Defensive')).toBe(true);

    const positional = getOpeningsByPlaystyle('Positional / Strategic');
    expect(positional.length).toBeGreaterThan(0);
    expect(positional.every((o) => o.playstyle === 'Positional / Strategic')).toBe(true);

    const dynamic = getOpeningsByPlaystyle('Dynamic / Counterattacking');
    expect(dynamic.length).toBeGreaterThan(0);
    expect(dynamic.every((o) => o.playstyle === 'Dynamic / Counterattacking')).toBe(true);
  });

  it('getOpeningVariations returns named variations for an opening', () => {
    const variations = getOpeningVariations('sicilian-defense');
    expect(variations.length).toBe(3);
    const dragon = variations.find((v) => v.id === 'sicilian-dragon');
    expect(dragon).toBeDefined();
    expect(dragon?.name).toBe('Sicilian Dragon');
  });

  it('formatMoveSequence formats moves with move numbers cleanly', () => {
    const moves = ['e4', 'c5', 'Nf3', 'd6', 'd4'];
    const formatted = formatMoveSequence(moves);
    expect(formatted).toBe('1. e4 c5 2. Nf3 d6 3. d4');
  });
});
