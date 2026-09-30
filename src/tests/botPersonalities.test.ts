import { describe, it, expect } from 'vitest';
import {
  BOT_PERSONALITIES,
  BOT_LIST,
  getBotById,
  getRandomBanter,
  BotPersonalityId,
} from '../utils/botPersonalities';

describe('Bot Personalities & Banter System', () => {
  it('contains all 4 expected distinct personality bots', () => {
    expect(BOT_LIST).toHaveLength(4);
    const ids = BOT_LIST.map((b) => b.id);
    expect(ids).toContain('mikhail');
    expect(ids).toContain('elena');
    expect(ids).toContain('viktor');
    expect(ids).toContain('magnus');
  });

  it('correctly maps ratings and difficulties to each bot', () => {
    expect(BOT_PERSONALITIES.mikhail.rating).toBe(1100);
    expect(BOT_PERSONALITIES.mikhail.difficulty).toBe('easy');

    expect(BOT_PERSONALITIES.elena.rating).toBe(1500);
    expect(BOT_PERSONALITIES.elena.difficulty).toBe('medium');

    expect(BOT_PERSONALITIES.viktor.rating).toBe(1800);
    expect(BOT_PERSONALITIES.viktor.difficulty).toBe('hard');

    expect(BOT_PERSONALITIES.magnus.rating).toBe(2400);
    expect(BOT_PERSONALITIES.magnus.difficulty).toBe('master');
  });

  it('provides rich quote categories for every bot', () => {
    for (const bot of BOT_LIST) {
      expect(bot.quotes.start.length).toBeGreaterThan(0);
      expect(bot.quotes.onBlunder.length).toBeGreaterThan(0);
      expect(bot.quotes.onCheck.length).toBeGreaterThan(0);
      expect(bot.quotes.onCaptureQueen.length).toBeGreaterThan(0);
      expect(bot.quotes.onPlayerGreatMove.length).toBeGreaterThan(0);
      expect(bot.quotes.onWin.length).toBeGreaterThan(0);
      expect(bot.quotes.onLoss.length).toBeGreaterThan(0);
      expect(bot.quotes.onDraw.length).toBeGreaterThan(0);
      expect(bot.openings.length).toBeGreaterThan(0);
    }
  });

  it('safely resolves bot by ID and provides a fallback for unknown IDs', () => {
    expect(getBotById('mikhail').name).toBe('Mikhail');
    expect(getBotById('viktor').name).toBe('Viktor');
    expect(getBotById(undefined).name).toBe('Elena');
    expect(getBotById('non-existent' as BotPersonalityId).name).toBe('Elena');
  });

  it('extracts random banter quotes cleanly and handles empty lists gracefully', () => {
    const quotes = ['Quote 1', 'Quote 2', 'Quote 3'];
    const chosen = getRandomBanter(quotes);
    expect(quotes).toContain(chosen);
    expect(getRandomBanter([])).toBe('');
  });
});
