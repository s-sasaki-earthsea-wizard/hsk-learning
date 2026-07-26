import { describe, expect, it } from 'vitest';
import { HSK1_COUNTS, HSK1_ITEMS } from '../data/hsk1';
import { HSK2_COUNTS, HSK2_ITEMS, HSK2_NEW_VOCABULARY } from '../data/hsk2';
import { HSK3_COUNTS, HSK3_ITEMS } from '../data/hsk3';
import { HSK3_NEW_VOCABULARY } from '../data/hsk3-vocabulary';
import { createQuizSession } from './quiz';

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

describe('createQuizSession', () => {
  it('contains the official 150-word HSK 1 vocabulary set', () => {
    expect(HSK1_COUNTS.vocabulary).toBe(150);
    expect(HSK1_COUNTS.expression).toBe(18);
    expect(HSK1_COUNTS.conversation).toBe(10);
  });

  it('contains the cumulative official HSK 2 and HSK 3 vocabulary sets', () => {
    expect(HSK2_NEW_VOCABULARY).toHaveLength(150);
    expect(HSK2_COUNTS.vocabulary).toBe(300);
    expect(HSK2_COUNTS.expression).toBe(18);
    expect(HSK2_COUNTS.conversation).toBe(10);
    expect(HSK3_NEW_VOCABULARY).toHaveLength(300);
    expect(HSK3_COUNTS.vocabulary).toBe(600);
    expect(HSK3_COUNTS.expression).toBe(20);
    expect(HSK3_COUNTS.conversation).toBe(10);
  });

  it('provides complete script, pinyin, and Japanese fields for every level', () => {
    [HSK1_ITEMS, HSK2_ITEMS, HSK3_ITEMS].forEach((items) => {
      expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
      items.forEach((item) => {
        expect(item.simplified.trim()).not.toBe('');
        expect(item.traditional.trim()).not.toBe('');
        expect(item.pinyin.trim()).not.toBe('');
        expect(item.japanese.trim()).not.toBe('');
      });
    });
  });

  it('creates the requested number of unique five-choice questions', () => {
    const questions = createQuizSession(HSK1_ITEMS, 'all', 20, seededRandom(42));

    expect(questions).toHaveLength(20);
    expect(new Set(questions.map((question) => question.item.id)).size).toBe(20);
    expect(questions.every((question) => question.choices.length === 5)).toBe(true);
    expect(
      questions.every((question) =>
        question.choices.some((choice) => choice.id === question.item.id),
      ),
    ).toBe(true);
  });

  it('balances vocabulary, expressions, and conversations in all mode', () => {
    const questions = createQuizSession(HSK3_ITEMS, 'all', 20, seededRandom(73));
    const categoryCounts = questions.reduce<Record<string, number>>((counts, question) => {
      counts[question.item.category] = (counts[question.item.category] ?? 0) + 1;
      return counts;
    }, {});

    expect(categoryCounts).toEqual({ vocabulary: 12, expression: 4, conversation: 4 });
  });

  it('mixes both translation directions evenly', () => {
    const questions = createQuizSession(HSK1_ITEMS, 'vocabulary', 10, seededRandom(7));
    const directionCounts = questions.reduce<Record<string, number>>((counts, question) => {
      counts[question.direction] = (counts[question.direction] ?? 0) + 1;
      return counts;
    }, {});

    expect(directionCounts['ja-to-zh']).toBe(5);
    expect(directionCounts['zh-to-ja']).toBe(5);
  });

  it('avoids duplicate visible answers in each question', () => {
    const questions = createQuizSession(HSK1_ITEMS, 'all', 50, seededRandom(99));

    questions.forEach((question) => {
      const visibleAnswers = question.choices.map((choice) =>
        question.direction === 'zh-to-ja' ? choice.japanese : choice.simplified,
      );
      expect(new Set(visibleAnswers).size).toBe(visibleAnswers.length);
    });
  });

  it('creates unambiguous choices from the cumulative HSK 3 pool', () => {
    const questions = createQuizSession(HSK3_ITEMS, 'vocabulary', 100, seededRandom(314));

    expect(questions).toHaveLength(100);
    questions.forEach((question) => {
      expect(question.choices).toHaveLength(5);
      const visibleAnswers = question.choices.map((choice) =>
        question.direction === 'zh-to-ja'
          ? choice.japanese
          : `${choice.simplified}|${choice.traditional}`,
      );
      expect(new Set(visibleAnswers).size).toBe(visibleAnswers.length);
    });
  });
});
