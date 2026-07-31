import { useState } from 'react';
import { HSK_CATALOG, HSK_LEVELS } from '../data/catalog';
import { useSpeech } from '../hooks/useSpeech';
import type { CategoryFilter, HskLevel, StudyStats } from '../types';
import { AudioButton } from './AudioButton';
import { ChineseDisplay } from './ChineseDisplay';
import {
  ArrowRightIcon,
  BookIcon,
  ChatIcon,
  CheckIcon,
  PhraseIcon,
} from './Icons';

interface HomeScreenProps {
  level: HskLevel;
  stats: StudyStats;
  onLevelChange: (level: HskLevel) => void;
  onStart: (category: CategoryFilter, questionCount: number) => void;
  onOpenVrchat: () => void;
}

export function HomeScreen({
  level,
  stats,
  onLevelChange,
  onStart,
  onOpenVrchat,
}: HomeScreenProps) {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const { speak, activeId, error, clearError } = useSpeech();
  const content = HSK_CATALOG[level];
  const categoryOptions = [
    { id: 'all' as const, label: 'バランス', detail: 'すべてをミックス', count: content.counts.total, icon: <CheckIcon /> },
    { id: 'vocabulary' as const, label: '単語', detail: '試験範囲を固める', count: content.counts.vocabulary, icon: <BookIcon /> },
    { id: 'expression' as const, label: '定型表現', detail: 'よく使うひと言', count: content.counts.expression, icon: <PhraseIcon /> },
    { id: 'conversation' as const, label: 'ミニ会話', detail: '場面ごとに覚える', count: content.counts.conversation, icon: <ChatIcon /> },
  ];
  const dailyItem = content.items[(new Date().getDate() + level * 17) % content.items.length];
  const selectedCategory = categoryOptions.find((option) => option.id === category)!;
  const actualCount = Math.min(questionCount, selectedCategory.count);
  const progress = Math.round((stats.seenIds.length / content.counts.total) * 100);
  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <main className="home-screen">
      <section className="hero-grid">
        <aside className="level-rail" aria-label="学習レベル">
          <p className="eyebrow">YOUR PATH</p>
          {HSK_LEVELS.map((optionLevel) => {
            const option = HSK_CATALOG[optionLevel];
            const isCurrent = optionLevel === level;
            return (
              <button
                type="button"
                key={optionLevel}
                className={`level-card${isCurrent ? ' is-current' : ''}`}
                onClick={() => onLevelChange(optionLevel)}
                aria-pressed={isCurrent}
              >
                <span className="level-number">0{optionLevel}</span>
                <span className="level-card-copy">
                  <strong>HSK {optionLevel}</strong>
                  <small>{option.title}</small>
                </span>
                {isCurrent ? <span className="current-dot" /> : <span className="level-word-count">{option.counts.vocabulary}</span>}
              </button>
            );
          })}
          <div className="path-divider"><span>COMMUNITY MODE</span></div>
          <button
            type="button"
            className="level-card vrchat-path-card"
            onClick={onOpenVrchat}
          >
            <span className="level-number level-number--vrchat">ALT</span>
            <span className="level-card-copy">
              <strong>VRChat 会話</strong>
              <small>日常表現・スラング</small>
            </span>
            <span className="vrchat-path-icon"><ChatIcon /></span>
          </button>
          <div className="rail-progress">
            <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
              <span>{progress}%</span>
            </div>
            <div>
              <strong>{stats.seenIds.length}</strong>
              <small> / {content.counts.total} 項目に挑戦</small>
            </div>
          </div>
        </aside>

        <div className="hero-content">
          <p className="eyebrow vermilion">HSK {level} · {content.stage}</p>
          <h1>
            ことばを選んで、
            <span>中国語の感覚</span>を育てよう。
          </h1>
          <p className="hero-lead">
            {content.lead}<br />
            簡体字・繁体字・拼音を見比べる5択トレーニング。
          </p>

          <div className="stats-strip" aria-label="学習実績">
            <div>
              <strong>{stats.sessions}</strong>
              <span>セッション</span>
            </div>
            <div>
              <strong>{stats.answered}</strong>
              <span>回答した問題</span>
            </div>
            <div>
              <strong>{accuracy}%</strong>
              <span>これまでの正答率</span>
            </div>
          </div>
        </div>
      </section>

      <section className="study-grid">
        <div className="setup-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SESSION SETUP</p>
              <h2>今日は何を練習する？</h2>
            </div>
            <span className="mix-badge">日↔中 ミックス</span>
          </div>

          <div className="category-grid">
            {categoryOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`category-option${category === option.id ? ' is-selected' : ''}`}
                onClick={() => setCategory(option.id)}
                aria-pressed={category === option.id}
              >
                <span className="category-icon">{option.icon}</span>
                <span className="category-copy">
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
                <span className="category-count">{option.count}</span>
              </button>
            ))}
          </div>

          <div className="question-count-row">
            <div>
              <span className="field-label">問題数</span>
              <small>1問ごとに翻訳方向が入れ替わるよ</small>
            </div>
            <div className="segmented-control">
              {[10, 20].map((count) => (
                <button
                  type="button"
                  key={count}
                  className={questionCount === count ? 'is-selected' : ''}
                  onClick={() => setQuestionCount(count)}
                >
                  {count}問
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="primary-button start-session-button"
            onClick={() => onStart(category, actualCount)}
          >
            <span>{actualCount}問のトレーニングを始める</span>
            <ArrowRightIcon />
          </button>
        </div>

        <aside className="daily-card">
          <div className="daily-card-topline">
            <div>
              <p className="eyebrow">TODAY'S PICK</p>
              <h2>今日のひとこと</h2>
            </div>
            <span className="red-seal" aria-hidden="true">学</span>
          </div>
          <ChineseDisplay item={dailyItem} size="large" />
          <div className="daily-meaning">
            <span>日本語</span>
            <strong className="preserve-lines">{dailyItem.japanese}</strong>
          </div>
          <AudioButton
            itemId={`daily-${dailyItem.id}`}
            text={dailyItem.audioText ?? dailyItem.simplified}
            activeId={activeId}
            onSpeak={speak}
          />
          {error && (
            <button type="button" className="audio-error" onClick={clearError}>
              {error} <span>×</span>
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
