import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearGameArchive,
  deleteArchivedGame,
  getArchivedGameById,
  getArchivedGames,
  getArchiveStats,
  saveGameToArchive,
} from '../utils/gameArchive';

describe('Game Archive Storage', () => {
  beforeEach(() => {
    clearGameArchive();
  });

  it('saves and retrieves archived games', () => {
    expect(getArchivedGames()).toHaveLength(0);

    const saved = saveGameToArchive({
      whiteName: 'Player',
      blackName: 'Stockfish Junior',
      playerColor: 'w',
      mode: 'vs-ai',
      result: '1-0',
      termination: 'checkmate',
      movesCount: 15,
      openingName: 'Italian Game',
      openingEco: 'C50',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    });

    expect(saved.id).toBeDefined();
    expect(saved.date).toBeDefined();

    const games = getArchivedGames();
    expect(games).toHaveLength(1);
    expect(games[0].id).toBe(saved.id);
    expect(games[0].openingName).toBe('Italian Game');
  });

  it('retrieves a game by id', () => {
    const saved = saveGameToArchive({
      whiteName: 'Alice',
      blackName: 'Bob',
      playerColor: 'w',
      mode: 'pass-and-play',
      result: '1/2-1/2',
      termination: 'stalemate',
      movesCount: 30,
      pgn: '',
      moves: [],
    });

    const fetched = getArchivedGameById(saved.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.whiteName).toBe('Alice');

    expect(getArchivedGameById('non-existent-id')).toBeNull();
  });

  it('deletes an archived game by id', () => {
    const saved1 = saveGameToArchive({
      whiteName: 'Player 1',
      blackName: 'AI',
      playerColor: 'w',
      mode: 'vs-ai',
      result: '1-0',
      termination: 'checkmate',
      movesCount: 10,
      pgn: '',
      moves: [],
    });

    const saved2 = saveGameToArchive({
      whiteName: 'Player 2',
      blackName: 'AI',
      playerColor: 'w',
      mode: 'vs-ai',
      result: '0-1',
      termination: 'resignation',
      movesCount: 20,
      pgn: '',
      moves: [],
    });

    expect(getArchivedGames()).toHaveLength(2);

    deleteArchivedGame(saved1.id);
    const remaining = getArchivedGames();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(saved2.id);
  });

  it('calculates archive statistics accurately', () => {
    saveGameToArchive({
      whiteName: 'You',
      blackName: 'AI',
      playerColor: 'w',
      mode: 'vs-ai',
      result: '1-0',
      termination: 'checkmate',
      movesCount: 20,
      openingName: 'Sicilian Defense',
      pgn: '',
      moves: [],
    });

    saveGameToArchive({
      whiteName: 'AI',
      blackName: 'You',
      playerColor: 'b',
      mode: 'vs-ai',
      result: '1-0', // AI won, player lost
      termination: 'timeout',
      movesCount: 25,
      openingName: 'Sicilian Defense',
      pgn: '',
      moves: [],
    });

    saveGameToArchive({
      whiteName: 'You',
      blackName: 'AI',
      playerColor: 'w',
      mode: 'vs-ai',
      result: '1/2-1/2',
      termination: 'draw_agreement',
      movesCount: 40,
      openingName: 'Ruy Lopez',
      pgn: '',
      moves: [],
    });

    const stats = getArchiveStats();
    expect(stats.totalGames).toBe(3);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(1);
    expect(stats.draws).toBe(1);
    expect(stats.winRate).toBe(33); // 1 / 3 = 33%
    expect(stats.favoriteOpening).toBe('Sicilian Defense');
  });
});
