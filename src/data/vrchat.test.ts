import { describe, expect, it } from 'vitest';
import {
  VRCHAT_CATEGORY_OPTIONS,
  VRCHAT_DIALOGUES,
  VRCHAT_PHRASES,
} from './vrchat';

describe('VRChat conversation content', () => {
  it('provides phrases for every category', () => {
    VRCHAT_CATEGORY_OPTIONS.forEach((category) => {
      expect(
        VRCHAT_PHRASES.filter((phrase) => phrase.category === category.id).length,
      ).toBeGreaterThanOrEqual(5);
    });
  });

  it('provides unique, complete phrase entries', () => {
    expect(new Set(VRCHAT_PHRASES.map((phrase) => phrase.id)).size).toBe(
      VRCHAT_PHRASES.length,
    );

    VRCHAT_PHRASES.forEach((phrase) => {
      expect(phrase.simplified.trim()).not.toBe('');
      expect(phrase.traditional.trim()).not.toBe('');
      expect(phrase.pinyin.trim()).not.toBe('');
      expect(phrase.japanese.trim()).not.toBe('');
      expect(phrase.nuance.trim()).not.toBe('');
    });
  });

  it('provides complete two-person dialogue examples', () => {
    expect(VRCHAT_DIALOGUES.length).toBeGreaterThanOrEqual(3);

    VRCHAT_DIALOGUES.forEach((dialogue) => {
      expect(dialogue.lines.some((line) => line.speaker === 'you')).toBe(true);
      expect(dialogue.lines.some((line) => line.speaker === 'partner')).toBe(true);
      dialogue.lines.forEach((line) => {
        expect(line.simplified.trim()).not.toBe('');
        expect(line.traditional.trim()).not.toBe('');
        expect(line.pinyin.trim()).not.toBe('');
        expect(line.japanese.trim()).not.toBe('');
      });
    });
  });
});
