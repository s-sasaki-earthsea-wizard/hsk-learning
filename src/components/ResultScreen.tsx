import { useSpeech } from '../hooks/useSpeech';
import type { AnswerRecord } from '../types';
import { AudioButton } from './AudioButton';
import { ChineseDisplay } from './ChineseDisplay';
import { ArrowRightIcon, HomeIcon, RotateIcon, TrophyIcon } from './Icons';

interface ResultScreenProps {
  records: AnswerRecord[];
  onRetry: () => void;
  onHome: () => void;
}

export function ResultScreen({ records, onRetry, onHome }: ResultScreenProps) {
  const { speak, activeId, error, clearError } = useSpeech();
  const correctCount = records.filter((record) => record.isCorrect).length;
  const accuracy = Math.round((correctCount / records.length) * 100);
  const wrongRecords = records.filter((record) => !record.isCorrect);
  const message = accuracy === 100
    ? '完璧！この調子で次の語彙へ進もう。'
    : accuracy >= 80
      ? 'かなり身についているね。あと一歩！'
      : accuracy >= 60
        ? 'いいペース。間違えた項目をもう一度見よう。'
        : '最初はここから。繰り返すほど定着するよ。';

  return (
    <main className="result-screen">
      <section className="result-hero">
        <div className="result-trophy"><TrophyIcon /></div>
        <p className="eyebrow vermilion">SESSION COMPLETE</p>
        <h1>トレーニング完了！</h1>
        <p>{message}</p>

        <div className="score-orbit" style={{ '--score': `${accuracy * 3.6}deg` } as React.CSSProperties}>
          <div>
            <strong>{accuracy}</strong>
            <span>%</span>
            <small>正答率</small>
          </div>
        </div>

        <div className="result-stats">
          <div><span>正解</span><strong>{correctCount}</strong></div>
          <div><span>不正解</span><strong>{records.length - correctCount}</strong></div>
          <div><span>全問題</span><strong>{records.length}</strong></div>
        </div>

        <div className="result-actions">
          <button type="button" className="secondary-button" onClick={onHome}>
            <HomeIcon />
            ホームへ
          </button>
          <button type="button" className="primary-button" onClick={onRetry}>
            <RotateIcon />
            もう一度挑戦
          </button>
        </div>
      </section>

      {wrongRecords.length > 0 ? (
        <section className="review-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">QUICK REVIEW</p>
              <h2>間違えた項目を復習</h2>
            </div>
            <span className="review-count">{wrongRecords.length} ITEMS</span>
          </div>
          <div className="review-list">
            {wrongRecords.map((record, index) => {
              const selected = record.question.choices.find(
                (choice) => choice.id === record.selectedId,
              );
              const item = record.question.item;

              return (
                <article className="review-item" key={`${item.id}-${index}`}>
                  <span className="review-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="review-main">
                    <ChineseDisplay item={item} size="small" />
                    <p className="review-meaning preserve-lines">{item.japanese}</p>
                    {selected && (
                      <p className="your-answer">
                        選んだ答え：
                        <span className="preserve-lines">
                          {record.question.direction === 'zh-to-ja'
                            ? selected.japanese
                            : `${selected.simplified}（${selected.pinyin}）`}
                        </span>
                      </p>
                    )}
                  </div>
                  <AudioButton
                    itemId={`review-${item.id}-${index}`}
                    text={item.audioText ?? item.simplified}
                    activeId={activeId}
                    onSpeak={speak}
                    compact
                  />
                </article>
              );
            })}
          </div>
          <button type="button" className="review-retry-button" onClick={onRetry}>
            間違いを意識して再挑戦
            <ArrowRightIcon />
          </button>
        </section>
      ) : (
        <section className="perfect-card">
          <span>満点</span>
          <h2>全問正解、お見事！</h2>
          <p>新しい項目を混ぜて、もう一周してみよう。</p>
        </section>
      )}

      {error && (
        <button type="button" className="audio-error audio-error--floating" onClick={clearError}>
          {error} <span>×</span>
        </button>
      )}
    </main>
  );
}
