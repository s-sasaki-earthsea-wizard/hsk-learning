import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { HSK_CATALOG } from './data/catalog';
import type {
  AnswerRecord,
  CategoryFilter,
  HskLevel,
  QuizQuestion,
  Screen,
  StudyStats,
  StudyStatsByLevel,
} from './types';
import { createQuizSession } from './utils/quiz';

const INITIAL_STATS: StudyStats = {
  sessions: 0,
  answered: 0,
  correct: 0,
  seenIds: [],
};

function createInitialStats(): StudyStatsByLevel {
  return {
    1: { ...INITIAL_STATS, seenIds: [] },
    2: { ...INITIAL_STATS, seenIds: [] },
    3: { ...INITIAL_STATS, seenIds: [] },
  };
}

function loadStats(): StudyStatsByLevel {
  try {
    const initial = createInitialStats();
    const stored = localStorage.getItem('hanzi-step:stats');
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<StudyStatsByLevel>;
      return {
        1: { ...initial[1], ...parsed[1] },
        2: { ...initial[2], ...parsed[2] },
        3: { ...initial[3], ...parsed[3] },
      };
    }

    const legacy = localStorage.getItem('hanzi-step:hsk1-stats');
    if (legacy) {
      return { ...initial, 1: { ...initial[1], ...JSON.parse(legacy) } as StudyStats };
    }
    return initial;
  } catch {
    return createInitialStats();
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>(1);
  const [statsByLevel, setStatsByLevel] = useState<StudyStatsByLevel>(loadStats);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [lastSetup, setLastSetup] = useState<{
    level: HskLevel;
    category: CategoryFilter;
    count: number;
  }>({
    level: 1,
    category: 'all',
    count: 10,
  });

  const startSession = (level: HskLevel, category: CategoryFilter, count: number) => {
    setSelectedLevel(level);
    setLastSetup({ level, category, count });
    setQuestions(createQuizSession(HSK_CATALOG[level].items, category, count));
    setRecords([]);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishSession = (completedRecords: AnswerRecord[]) => {
    const stats = statsByLevel[selectedLevel];
    const nextStats: StudyStats = {
      sessions: stats.sessions + 1,
      answered: stats.answered + completedRecords.length,
      correct: stats.correct + completedRecords.filter((record) => record.isCorrect).length,
      seenIds: Array.from(
        new Set([...stats.seenIds, ...completedRecords.map((record) => record.question.item.id)]),
      ),
    };
    const nextStatsByLevel = { ...statsByLevel, [selectedLevel]: nextStats };
    setStatsByLevel(nextStatsByLevel);
    localStorage.setItem('hanzi-step:stats', JSON.stringify(nextStatsByLevel));
    setRecords(completedRecords);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <AppHeader screen={screen} level={selectedLevel} onHome={goHome} />
      {screen === 'home' && (
        <HomeScreen
          level={selectedLevel}
          stats={statsByLevel[selectedLevel]}
          onLevelChange={setSelectedLevel}
          onStart={(category, count) => startSession(selectedLevel, category, count)}
        />
      )}
      {screen === 'quiz' && questions.length > 0 && (
        <QuizScreen questions={questions} onFinish={finishSession} />
      )}
      {screen === 'result' && records.length > 0 && (
        <ResultScreen
          records={records}
          onRetry={() => startSession(lastSetup.level, lastSetup.category, lastSetup.count)}
          onHome={goHome}
        />
      )}
      <footer className="app-footer">
        <span>HANZI STEP</span>
        <p>簡体字 · 繁体字 · 拼音をひとつずつ。</p>
        <small>HSK {selectedLevel} · Japanese learner edition</small>
      </footer>
    </div>
  );
}

export default App;
