export type LearningCategory = 'vocabulary' | 'expression' | 'conversation';

export type HskLevel = 1 | 2 | 3;

export type CategoryFilter = LearningCategory | 'all';

export type QuizDirection = 'ja-to-zh' | 'zh-to-ja';

export type Screen = 'home' | 'quiz' | 'result';

export interface HskItem {
  id: string;
  level?: HskLevel;
  category: LearningCategory;
  simplified: string;
  traditional: string;
  pinyin: string;
  japanese: string;
  note?: string;
  audioText?: string;
}

export interface QuizQuestion {
  item: HskItem;
  direction: QuizDirection;
  choices: HskItem[];
}

export interface AnswerRecord {
  question: QuizQuestion;
  selectedId: string;
  isCorrect: boolean;
}

export interface StudyStats {
  sessions: number;
  answered: number;
  correct: number;
  seenIds: string[];
}

export type StudyStatsByLevel = Record<HskLevel, StudyStats>;
