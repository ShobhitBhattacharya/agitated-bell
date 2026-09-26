import { describe, it, expect } from 'vitest';
import {
  getTheoryLessonById,
  getTheoryLessonsByCategory,
  getLessonProgress,
  getLessonTargetMove,
  createLessonPositionFEN,
  getAdaptiveTrainerPrompt,
  detectRecurringMistakes,
} from '../utils/studyTools';

describe('theory trainer', () => {
  it('returns the Scholar\'s Mate lesson by id', () => {
    const lesson = getTheoryLessonById('scholars-mate');

    expect(lesson).toBeDefined();
    expect(lesson?.name).toBe("Scholar's Mate");
    expect(lesson?.category).toBe('checkmate-pattern');
  });

  it('returns available openings lessons grouped by category', () => {
    const openings = getTheoryLessonsByCategory('opening');

    expect(openings.length).toBeGreaterThan(0);
    expect(openings.some((lesson) => lesson.id === 'sicilian-defense')).toBe(true);
  });

  it('tracks lesson progress from the move list', () => {
    const lesson = getTheoryLessonById('scholars-mate');
    const progress = getLessonProgress(lesson!, ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6']);

    expect(progress).toBe(6);
  });

  it('returns the correct target move for a lesson pattern', () => {
    const lesson = getTheoryLessonById('scholars-mate');
    const target = getLessonTargetMove(lesson!);

    expect(target).toBe('Qxf7#');
  });

  it('creates a lesson FEN before the final mating move', () => {
    const lesson = getTheoryLessonById('scholars-mate');
    const fen = createLessonPositionFEN(lesson!);

    expect(fen).toContain('r1bqkb1r');
    expect(fen).toContain('Q');
  });

  it('detects repeated queen-early mistakes and suggests a drill', () => {
    const moves = ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#'];
    const prompt = getAdaptiveTrainerPrompt(moves);

    expect(prompt).not.toBeNull();
    expect(prompt?.type).toBe('queen-early');
    expect(prompt?.title).toContain('queen');
  });

  it('detects recurring f7 weakness patterns', () => {
    const moves = ['f3', 'e5', 'g4', 'Qh4#', 'f3', 'e5', 'g4', 'Qh4#'];
    const mistakes = detectRecurringMistakes(moves);

    expect(mistakes.some((item) => item.type === 'f7-weakness')).toBe(true);
  });
});
