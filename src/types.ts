export type LearningCategory = 'vocabulary' | 'expression' | 'conversation';

export type HskLevel = 1 | 2 | 3;

export type CategoryFilter = LearningCategory | 'all';

export type QuizDirection = 'ja-to-zh' | 'zh-to-ja';

export type Screen = 'home' | 'quiz' | 'result' | 'vrchat';

export interface ChineseText {
  simplified: string;
  traditional: string;
  pinyin: string;
  japanese: string;
  audioText?: string;
}

export interface HskItem extends ChineseText {
  id: string;
  level?: HskLevel;
  category: LearningCategory;
  note?: string;
}

export type VrchatPhraseCategory =
  | 'starter'
  | 'reaction'
  | 'help'
  | 'vrchat'
  | 'slang';

export type PhraseTone = 'safe' | 'casual' | 'strong';

export interface VrchatPhrase extends ChineseText {
  id: string;
  category: VrchatPhraseCategory;
  tone: PhraseTone;
  nuance: string;
}

export interface VrchatDialogueLine extends ChineseText {
  speaker: 'you' | 'partner';
}

export interface VrchatDialogue {
  id: string;
  title: string;
  situation: string;
  lines: VrchatDialogueLine[];
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
