import { useCallback, useEffect, useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import type { AnswerRecord, HskItem, QuizQuestion } from '../types';
import { AudioButton } from './AudioButton';
import { ChineseDisplay } from './ChineseDisplay';
import { ArrowRightIcon, CheckIcon, CloseIcon } from './Icons';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onFinish: (records: AnswerRecord[]) => void;
}

const categoryLabels = {
  vocabulary: '単語',
  expression: '定型表現',
  conversation: 'ミニ会話',
};

function ChoiceContent({ choice, direction }: { choice: HskItem; direction: QuizQuestion['direction'] }) {
  if (direction === 'zh-to-ja') {
    return <span className="choice-japanese preserve-lines">{choice.japanese}</span>;
  }

  return (
    <span className="choice-chinese">
      <span className="choice-hanzi preserve-lines" lang="zh-Hans">{choice.simplified}</span>
      <span className="choice-meta">
        <span lang="zh-Hant">繁：{choice.traditional}</span>
        <span lang="zh-Latn">{choice.pinyin}</span>
      </span>
    </span>
  );
}

export function QuizScreen({ questions, onFinish }: QuizScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const { speak, activeId, error, clearError } = useSpeech();
  const question = questions[questionIndex];
  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === question.item.id;
  const correctCount = records.filter((record) => record.isCorrect).length + (isAnswered && isCorrect ? 1 : 0);

  const selectChoice = useCallback(
    (choiceId: string) => {
      if (selectedId !== null) return;
      setSelectedId(choiceId);
    },
    [selectedId],
  );

  const goNext = useCallback(() => {
    if (selectedId === null) return;
    const record: AnswerRecord = {
      question,
      selectedId,
      isCorrect: selectedId === question.item.id,
    };
    const nextRecords = [...records, record];

    if (questionIndex === questions.length - 1) {
      onFinish(nextRecords);
      return;
    }

    setRecords(nextRecords);
    setQuestionIndex((current) => current + 1);
    setSelectedId(null);
  }, [onFinish, question, questionIndex, questions.length, records, selectedId]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (!isAnswered && /^[1-5]$/.test(event.key)) {
        const choice = question.choices[Number(event.key) - 1];
        if (choice) selectChoice(choice.id);
      }
      if (isAnswered && event.key === 'Enter') {
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [goNext, isAnswered, question.choices, selectChoice]);

  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <main className="quiz-screen">
      <div className="quiz-statusbar">
        <div className="quiz-status-copy">
          <span>QUESTION {String(questionIndex + 1).padStart(2, '0')}</span>
          <strong>{questionIndex + 1} / {questions.length}</strong>
        </div>
        <div className="quiz-progress" aria-label={`進捗 ${Math.round(progress)}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="live-score">
          <span>正解</span>
          <strong>{correctCount}</strong>
        </div>
      </div>

      <section className="question-stage">
        <div className="question-kicker">
          <span className="category-chip">{categoryLabels[question.item.category]}</span>
          <span className="direction-copy">
            {question.direction === 'ja-to-zh' ? '日本語 → 中国語' : '中国語 → 日本語'}
          </span>
        </div>

        <div className="question-prompt">
          <p>次の意味として正しいものを選ぼう</p>
          {question.direction === 'ja-to-zh' ? (
            <h1 className="japanese-prompt preserve-lines">{question.item.japanese}</h1>
          ) : (
            <div className="chinese-prompt">
              <ChineseDisplay item={question.item} size="large" />
              <AudioButton
                itemId={`question-${question.item.id}`}
                text={question.item.audioText ?? question.item.simplified}
                activeId={activeId}
                onSpeak={speak}
                compact
              />
            </div>
          )}
        </div>

        <div className="choices-grid" aria-label="選択肢">
          {question.choices.map((choice, index) => {
            const isSelected = selectedId === choice.id;
            const isCorrectChoice = choice.id === question.item.id;
            const stateClass = isAnswered
              ? isCorrectChoice
                ? ' is-correct'
                : isSelected
                  ? ' is-incorrect'
                  : ' is-muted'
              : '';

            return (
              <button
                type="button"
                key={choice.id}
                className={`choice-button${stateClass}`}
                onClick={() => selectChoice(choice.id)}
                disabled={isAnswered}
              >
                <span className="choice-index">{index + 1}</span>
                <ChoiceContent choice={choice} direction={question.direction} />
                {isAnswered && isCorrectChoice && <CheckIcon className="choice-state-icon" />}
                {isAnswered && isSelected && !isCorrectChoice && <CloseIcon className="choice-state-icon" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`answer-feedback${isCorrect ? ' is-correct' : ' is-incorrect'}`}>
            <div className="feedback-heading">
              <span className="feedback-icon">
                {isCorrect ? <CheckIcon /> : <CloseIcon />}
              </span>
              <div>
                <p>{isCorrect ? 'その調子！' : 'ここで覚えれば大丈夫。'}</p>
                <strong>{isCorrect ? '正解' : '正解はこちら'}</strong>
              </div>
            </div>
            <div className="feedback-answer">
              <ChineseDisplay item={question.item} size="small" />
              <div className="feedback-japanese preserve-lines">{question.item.japanese}</div>
              {question.item.note && <p className="study-note">MEMO · {question.item.note}</p>}
            </div>
            <div className="feedback-actions">
              <AudioButton
                itemId={`feedback-${question.item.id}`}
                text={question.item.audioText ?? question.item.simplified}
                activeId={activeId}
                onSpeak={speak}
                compact
              />
              <button type="button" className="next-button" onClick={goNext} autoFocus>
                <span>{questionIndex === questions.length - 1 ? '結果を見る' : '次の問題'}</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}
      </section>
      <p className="keyboard-hint">キーボードの 1–5 でも選択できるよ</p>
      {error && (
        <button type="button" className="audio-error audio-error--floating" onClick={clearError}>
          {error} <span>×</span>
        </button>
      )}
    </main>
  );
}
