import { GameMode, GameTermination, PieceColor } from '../types/chess';

export interface ArchivedGame {
  id: string;
  date: string; // ISO string
  whiteName: string;
  blackName: string;
  playerColor: PieceColor;
  mode: GameMode;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  termination: GameTermination;
  movesCount: number;
  openingName?: string;
  openingEco?: string;
  whiteAccuracy?: number;
  blackAccuracy?: number;
  pgn: string;
  moves: string[]; // SAN list
}

const STORAGE_KEY = 'chess-master-game-archive-v1';

let memoryStore: Record<string, string> = {};

function getSafeStorage() {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.setItem('__test__', '1');
      window.localStorage.removeItem('__test__');
      return window.localStorage;
    } catch {
      // ignore
    }
  }
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined') {
    try {
      (globalThis as any).localStorage.setItem('__test__', '1');
      (globalThis as any).localStorage.removeItem('__test__');
      return (globalThis as any).localStorage;
    } catch {
      // ignore
    }
  }
  return {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete memoryStore[key];
    },
  };
}

export function getArchivedGames(): ArchivedGame[] {
  try {
    const raw = getSafeStorage().getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGameToArchive(
  gameData: Omit<ArchivedGame, 'id' | 'date'>
): ArchivedGame {
  const games = getArchivedGames();
  const newGame: ArchivedGame = {
    ...gameData,
    id: `game-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };

  // Keep most recent 100 games
  const updated = [newGame, ...games].slice(0, 100);

  try {
    getSafeStorage().setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save game to archive:', err);
  }

  return newGame;
}

export function getArchivedGameById(id: string): ArchivedGame | null {
  const games = getArchivedGames();
  return games.find((g) => g.id === id) ?? null;
}

export function deleteArchivedGame(id: string): boolean {
  const games = getArchivedGames();
  const filtered = games.filter((g) => g.id !== id);
  if (filtered.length === games.length) return false;

  try {
    getSafeStorage().setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function clearGameArchive(): void {
  try {
    getSafeStorage().removeItem(STORAGE_KEY);
    memoryStore = {};
  } catch {
    // safe fallback
  }
}

export function getArchiveStats() {
  const games = getArchivedGames();
  if (games.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      favoriteOpening: 'None',
    };
  }

  let wins = 0;
  let losses = 0;
  let draws = 0;
  const openingCounts: Record<string, number> = {};

  for (const g of games) {
    if (g.openingName) {
      openingCounts[g.openingName] = (openingCounts[g.openingName] || 0) + 1;
    }

    if (g.result === '1/2-1/2') {
      draws++;
    } else if (g.mode === 'vs-ai') {
      const humanWon =
        (g.result === '1-0' && g.playerColor === 'w') ||
        (g.result === '0-1' && g.playerColor === 'b');
      if (humanWon) wins++;
      else losses++;
    } else {
      if (g.result === '1-0') wins++;
      else if (g.result === '0-1') losses++;
    }
  }

  let favoriteOpening = 'None';
  let maxCount = 0;
  for (const [name, count] of Object.entries(openingCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteOpening = name;
    }
  }

  const decisive = wins + losses;
  const winRate = decisive > 0 ? Math.round((wins / games.length) * 100) : 0;

  return {
    totalGames: games.length,
    wins,
    losses,
    draws,
    winRate,
    favoriteOpening,
  };
}
