import type { HskItem, HskLevel } from '../types';
import { HSK1_COUNTS, HSK1_ITEMS } from './hsk1';
import { HSK2_COUNTS, HSK2_ITEMS } from './hsk2';
import { HSK3_COUNTS, HSK3_ITEMS } from './hsk3';

export interface LevelCounts {
  vocabulary: number;
  expression: number;
  conversation: number;
  total: number;
}

export interface HskLevelContent {
  level: HskLevel;
  stage: string;
  title: string;
  shortDescription: string;
  lead: string;
  items: HskItem[];
  counts: LevelCounts;
}

export const HSK_CATALOG: Record<HskLevel, HskLevelContent> = {
  1: {
    level: 1,
    stage: 'BEGINNER',
    title: '基礎をつくる',
    shortDescription: '最初の150語',
    lead: '身近な物や数字、基本のあいさつから中国語の土台をつくろう。',
    items: HSK1_ITEMS,
    counts: HSK1_COUNTS,
  },
  2: {
    level: 2,
    stage: 'ELEMENTARY',
    title: '表現をひろげる',
    shortDescription: '累計300語',
    lead: '比較や理由、進行中の動作を使って、言えることを一気に増やそう。',
    items: HSK2_ITEMS,
    counts: HSK2_COUNTS,
  },
  3: {
    level: 3,
    stage: 'INTERMEDIATE',
    title: '日常会話へ',
    shortDescription: '累計600語',
    lead: '条件や経験、気持ちを組み合わせて、まとまりのある会話へ進もう。',
    items: HSK3_ITEMS,
    counts: HSK3_COUNTS,
  },
};

export const HSK_LEVELS = [1, 2, 3] as const;
