import type { HskItem, HskLevel } from '../types';

export type VocabularyTuple = readonly [
  simplified: string,
  traditional: string,
  pinyin: string,
  japanese: string,
];

export function createVocabularyItems(
  level: HskLevel,
  rows: readonly VocabularyTuple[],
): HskItem[] {
  return rows.map(([simplified, traditional, pinyin, japanese], index) => ({
    id: `hsk${level}-v${String(index + 1).padStart(3, '0')}`,
    level,
    category: 'vocabulary',
    simplified,
    traditional,
    pinyin,
    japanese,
  }));
}
