import { describe, it, expect } from 'vitest';
import {
  getKnowledgeTopicsByCategory,
  getKnowledgeTopicById,
  getStudyRoadmap,
  getNextStudyTopic,
  getStudyProgress,
  getStudyStreak,
} from '../utils/chessKnowledgeBase';
import { getStudyStreakDays, markStudyTopicCompleted } from '../utils/progressStorage';

describe('chess knowledge base', () => {
  it('returns topics for the opening principles category', () => {
    const topics = getKnowledgeTopicsByCategory('opening-principles');

    expect(topics.length).toBeGreaterThan(0);
    expect(topics.some((topic) => topic.id === 'develop-first')).toBe(true);
  });

  it('returns a topic by id with reasoning and recommended books', () => {
    const topic = getKnowledgeTopicById('central-control');

    expect(topic).toBeDefined();
    expect(topic?.whyItMatters).toContain('center');
    expect(topic?.recommendedBooks.length).toBeGreaterThan(1);
  });

  it('returns the study roadmap in a sensible progression order', () => {
    const roadmap = getStudyRoadmap();

    expect(roadmap.length).toBe(28);
    expect(roadmap[0].id).toBe('develop-first');
    expect(roadmap[1].id).toBe('central-control');
    expect(roadmap.some((t) => t.id === 'outpost-squares')).toBe(true);
    expect(roadmap.some((t) => t.id === 'anastasia-mate')).toBe(true);
    expect(roadmap.some((t) => t.id === 'king-activity')).toBe(true);
  });

  it('returns the next topic after the current one', () => {
    const next = getNextStudyTopic('central-control');

    expect(next?.id).toBe('king-safety');
  });

  it('tracks completed study progress', () => {
    const progress = getStudyProgress(['develop-first', 'central-control', 'king-safety']);

    expect(progress.completed).toBe(3);
    expect(progress.total).toBeGreaterThan(3);
  });

  it('tracks a study streak from the completed concepts', () => {
    const streak = getStudyStreak(['develop-first', 'central-control', 'king-safety']);

    expect(streak).toBeGreaterThanOrEqual(3);
  });

  it('records completion for the current topic and consecutive study dates', () => {
    const progress = markStudyTopicCompleted(
      { completedTopicIds: [], activityDates: [] },
      'passed-pawns',
      '2026-09-28'
    );

    expect(progress.completedTopicIds).toEqual(['passed-pawns']);
    expect(getStudyStreakDays(progress.activityDates, '2026-09-29')).toBe(1);
  });
});
