export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface StudyProgressRecord {
  completedTopicIds: string[];
  activityDates: string[];
}

export interface PuzzleRushProgressRecord {
  totalSolved: number;
  bestByRating: Record<string, number>;
}

export const EMPTY_STUDY_PROGRESS: StudyProgressRecord = {
  completedTopicIds: [],
  activityDates: [],
};

export const EMPTY_PUZZLE_RUSH_PROGRESS: PuzzleRushProgressRecord = {
  totalSolved: 0,
  bestByRating: {},
};

const STUDY_PROGRESS_KEY = 'chess-master-study-progress-v1';
const PUZZLE_RUSH_PROGRESS_KEY = 'chess-master-puzzle-rush-progress-v1';

const getBrowserStorage = (): ProgressStorage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

const readJson = (storage: ProgressStorage | null, key: string): unknown => {
  try {
    const value = storage?.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const isValidDateKey = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
};

export const getLocalDateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const loadStudyProgress = (storage = getBrowserStorage()): StudyProgressRecord => {
  const stored = readJson(storage, STUDY_PROGRESS_KEY);
  if (!stored || typeof stored !== 'object') return { ...EMPTY_STUDY_PROGRESS };

  const data = stored as Partial<StudyProgressRecord>;
  return {
    completedTopicIds: Array.isArray(data.completedTopicIds)
      ? [...new Set(data.completedTopicIds.filter((id): id is string => typeof id === 'string'))]
      : [],
    activityDates: Array.isArray(data.activityDates)
      ? [...new Set(data.activityDates.filter(isValidDateKey))].sort()
      : [],
  };
};

export const saveStudyProgress = (
  progress: StudyProgressRecord,
  storage = getBrowserStorage()
): void => {
  try {
    storage?.setItem(STUDY_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Progress remains available for the current session if storage is unavailable.
  }
};

export const markStudyTopicCompleted = (
  progress: StudyProgressRecord,
  topicId: string,
  dateKey = getLocalDateKey()
): StudyProgressRecord => ({
  completedTopicIds: progress.completedTopicIds.includes(topicId)
    ? progress.completedTopicIds
    : [...progress.completedTopicIds, topicId],
  activityDates: [...new Set([...progress.activityDates, dateKey])].sort(),
});

const dateKeyToDayNumber = (dateKey: string): number => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
};

export const getStudyStreakDays = (activityDates: string[], today = getLocalDateKey()): number => {
  if (!isValidDateKey(today)) return 0;
  const activeDays = new Set(activityDates.filter(isValidDateKey).map(dateKeyToDayNumber));
  const todayNumber = dateKeyToDayNumber(today);
  let currentDay = activeDays.has(todayNumber) ? todayNumber : todayNumber - 1;
  if (!activeDays.has(currentDay)) return 0;

  let streak = 0;
  while (activeDays.has(currentDay)) {
    streak += 1;
    currentDay -= 1;
  }
  return streak;
};

export const loadPuzzleRushProgress = (
  storage = getBrowserStorage()
): PuzzleRushProgressRecord => {
  const stored = readJson(storage, PUZZLE_RUSH_PROGRESS_KEY);
  if (!stored || typeof stored !== 'object') return { ...EMPTY_PUZZLE_RUSH_PROGRESS };

  const data = stored as Partial<PuzzleRushProgressRecord>;
  const bestByRating: Record<string, number> = {};
  if (data.bestByRating && typeof data.bestByRating === 'object') {
    Object.entries(data.bestByRating).forEach(([rating, score]) => {
      if (/^\d+$/.test(rating) && Number.isInteger(score) && Number(score) >= 0) {
        bestByRating[rating] = Number(score);
      }
    });
  }

  return {
    totalSolved: Number.isInteger(data.totalSolved) && Number(data.totalSolved) >= 0 ? Number(data.totalSolved) : 0,
    bestByRating,
  };
};

export const savePuzzleRushProgress = (
  progress: PuzzleRushProgressRecord,
  storage = getBrowserStorage()
): void => {
  try {
    storage?.setItem(PUZZLE_RUSH_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Progress remains available for the current session if storage is unavailable.
  }
};

export const recordPuzzleSolved = (
  progress: PuzzleRushProgressRecord,
  startingRating: number,
  runScore: number
): PuzzleRushProgressRecord => {
  const key = String(startingRating);
  return {
    totalSolved: progress.totalSolved + 1,
    bestByRating: {
      ...progress.bestByRating,
      [key]: Math.max(progress.bestByRating[key] ?? 0, runScore),
    },
  };
};
