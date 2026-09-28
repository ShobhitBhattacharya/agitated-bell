import { describe, expect, it } from 'vitest';
import {
  getStudyStreakDays,
  loadPuzzleRushProgress,
  loadStudyProgress,
  markStudyTopicCompleted,
  recordPuzzleSolved,
  savePuzzleRushProgress,
  saveStudyProgress,
  type ProgressStorage,
} from '../utils/progressStorage';

const createMemoryStorage = (): ProgressStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

describe('local progress storage', () => {
  it('persists completed concepts and activity dates across reloads', () => {
    const storage = createMemoryStorage();
    const first = markStudyTopicCompleted(loadStudyProgress(storage), 'develop-first', '2026-09-27');
    const second = markStudyTopicCompleted(first, 'central-control', '2026-09-28');

    saveStudyProgress(second, storage);

    expect(loadStudyProgress(storage)).toEqual({
      completedTopicIds: ['develop-first', 'central-control'],
      activityDates: ['2026-09-27', '2026-09-28'],
    });
  });

  it('calculates a real consecutive-day study streak and expires old streaks', () => {
    expect(getStudyStreakDays(['2026-09-25', '2026-09-26', '2026-09-28'], '2026-09-28')).toBe(1);
    expect(getStudyStreakDays(['2026-09-25', '2026-09-26'], '2026-09-28')).toBe(0);
    expect(getStudyStreakDays(['2026-09-26', '2026-09-27'], '2026-09-28')).toBe(2);
  });

  it('keeps the best score per starting level and accumulates solved puzzles', () => {
    const storage = createMemoryStorage();
    let progress = loadPuzzleRushProgress(storage);
    progress = recordPuzzleSolved(progress, 800, 1);
    progress = recordPuzzleSolved(progress, 800, 3);
    progress = recordPuzzleSolved(progress, 1400, 2);
    savePuzzleRushProgress(progress, storage);

    expect(loadPuzzleRushProgress(storage)).toEqual({
      totalSolved: 3,
      bestByRating: { '800': 3, '1400': 2 },
    });
  });

  it('recovers cleanly from corrupt saved data', () => {
    const storage = createMemoryStorage();
    storage.setItem('chess-master-study-progress-v1', '{bad json');
    storage.setItem('chess-master-puzzle-rush-progress-v1', 'null');

    expect(loadStudyProgress(storage)).toEqual({ completedTopicIds: [], activityDates: [] });
    expect(loadPuzzleRushProgress(storage)).toEqual({ totalSolved: 0, bestByRating: {} });
  });
});
