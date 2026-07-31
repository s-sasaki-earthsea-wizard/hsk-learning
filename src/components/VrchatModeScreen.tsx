import { useState } from 'react';
import {
  PHRASE_TONE_LABELS,
  VRCHAT_CATEGORY_OPTIONS,
  VRCHAT_DIALOGUES,
  VRCHAT_PHRASES,
} from '../data/vrchat';
import { useSpeech } from '../hooks/useSpeech';
import type { VrchatPhraseCategory } from '../types';
import { AudioButton } from './AudioButton';
import { ChineseDisplay } from './ChineseDisplay';
import { ChatIcon, PhraseIcon } from './Icons';

const QUICK_PHRASE_IDS = [
  'vrc-starter-learning',
  'vrc-help-slower',
  'vrc-vrchat-friend',
];

export function VrchatModeScreen() {
  const [category, setCategory] = useState<VrchatPhraseCategory>('starter');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const { speak, activeId, error, clearError } = useSpeech();
  const quickPhrases = QUICK_PHRASE_IDS.map(
    (id) => VRCHAT_PHRASES.find((phrase) => phrase.id === id)!,
  );
  const visiblePhrases = VRCHAT_PHRASES.filter((phrase) => phrase.category === category);
  const currentCategory = VRCHAT_CATEGORY_OPTIONS.find((option) => option.id === category)!;
  const currentDialogue = VRCHAT_DIALOGUES[dialogueIndex];

  return (
    <main className="vrchat-screen">
      <section className="vrchat-hero">
        <div className="vrchat-hero-copy">
          <div className="vrchat-live-label">
            <span aria-hidden="true" />
            LIVE CONVERSATION MODE
          </div>
          <p className="eyebrow vrchat-eyebrow">OUTSIDE THE TEXTBOOK</p>
          <h1>
            教科書を出て、
            <span>会話の輪</span>へ。
          </h1>
          <p className="vrchat-hero-lead">
            VRChatの語学交流ワールドで、そのまま口に出せる中国語。
            試験の上品な表現とは少し違う、距離の縮まる言い方と会話の流れを覚えよう。
          </p>
          <div className="vrchat-feature-list" aria-label="モードの特徴">
            <span>26フレーズ</span>
            <span>距離感メモ付き</span>
            <span>3つの会話シーン</span>
          </div>
        </div>

        <aside className="survival-card">
          <div className="survival-card-heading">
            <div>
              <p className="eyebrow">QUICK LOADOUT</p>
              <h2>まずは、この3つ。</h2>
            </div>
            <span className="headset-mark" aria-hidden="true"><ChatIcon /></span>
          </div>
          <div className="survival-phrase-list">
            {quickPhrases.map((phrase, index) => (
              <article key={phrase.id} className="survival-phrase">
                <span className="survival-number">0{index + 1}</span>
                <div>
                  <strong lang="zh-Hans">{phrase.simplified}</strong>
                  <span>{phrase.pinyin}</span>
                  <small>{phrase.japanese}</small>
                </div>
                <AudioButton
                  itemId={`quick-${phrase.id}`}
                  text={phrase.audioText ?? phrase.simplified}
                  activeId={activeId}
                  onSpeak={speak}
                  compact
                />
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="phrase-library" aria-labelledby="phrase-library-title">
        <div className="vrchat-section-heading">
          <div>
            <p className="eyebrow vrchat-eyebrow">PHRASE DECK</p>
            <h2 id="phrase-library-title">場面からフレーズを選ぶ</h2>
            <p>まずは意味を見ながら音読。慣れたら日本語を隠して言ってみよう。</p>
          </div>
          <span className="phrase-total">{VRCHAT_PHRASES.length} PHRASES</span>
        </div>

        <div className="phrase-category-tabs" role="tablist" aria-label="フレーズの場面">
          {VRCHAT_CATEGORY_OPTIONS.map((option) => (
            <button
              type="button"
              role="tab"
              key={option.id}
              className={category === option.id ? 'is-selected' : ''}
              aria-selected={category === option.id}
              onClick={() => setCategory(option.id)}
            >
              <span>{option.shortLabel}</span>
              <small>{option.description}</small>
            </button>
          ))}
        </div>

        <div className="phrase-panel" role="tabpanel">
          <div className="phrase-panel-heading">
            <div>
              <span>{String(visiblePhrases.length).padStart(2, '0')}</span>
              <div>
                <h3>{currentCategory.label}</h3>
                <p>{currentCategory.description}</p>
              </div>
            </div>
            {category === 'slang' && (
              <p className="slang-caution">
                <strong>温度感に注意</strong>
                強さに迷ったら「太牛了！」が使いやすい。
              </p>
            )}
          </div>

          <div className="phrase-card-grid">
            {visiblePhrases.map((phrase, index) => (
              <article className="vrc-phrase-card" key={phrase.id}>
                <div className="phrase-card-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className={`tone-badge tone-badge--${phrase.tone}`}>
                    {PHRASE_TONE_LABELS[phrase.tone]}
                  </span>
                </div>
                <ChineseDisplay item={phrase} size="small" />
                <p className="vrc-phrase-japanese">{phrase.japanese}</p>
                <p className="vrc-nuance"><strong>USE</strong>{phrase.nuance}</p>
                <AudioButton
                  itemId={`phrase-${phrase.id}`}
                  text={phrase.audioText ?? phrase.simplified}
                  activeId={activeId}
                  onSpeak={speak}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dialogue-section" aria-labelledby="dialogue-title">
        <div className="vrchat-section-heading dialogue-heading">
          <div>
            <p className="eyebrow vrchat-eyebrow">CONVERSATION FLOW</p>
            <h2 id="dialogue-title">ひと言の先まで練習する</h2>
            <p>自分側の台詞を声に出して、相手の返事までひとまとまりで覚えよう。</p>
          </div>
          <PhraseIcon />
        </div>

        <div className="dialogue-layout">
          <nav className="dialogue-selector" aria-label="会話シーン">
            {VRCHAT_DIALOGUES.map((dialogue, index) => (
              <button
                type="button"
                key={dialogue.id}
                className={dialogueIndex === index ? 'is-selected' : ''}
                aria-pressed={dialogueIndex === index}
                onClick={() => setDialogueIndex(index)}
              >
                <span>SCENE {String(index + 1).padStart(2, '0')}</span>
                <strong>{dialogue.title}</strong>
                <small>{dialogue.situation}</small>
              </button>
            ))}
          </nav>

          <article className="dialogue-stage">
            <header>
              <div>
                <span>SCENE {String(dialogueIndex + 1).padStart(2, '0')}</span>
                <h3>{currentDialogue.title}</h3>
              </div>
              <small>あなたの台詞</small>
            </header>
            <div className="dialogue-lines">
              {currentDialogue.lines.map((line, index) => {
                const itemId = `dialogue-${currentDialogue.id}-${index}`;
                return (
                  <div
                    className={`dialogue-line dialogue-line--${line.speaker}`}
                    key={itemId}
                  >
                    <span className="dialogue-speaker">
                      {line.speaker === 'you' ? 'YOU' : 'PARTNER'}
                    </span>
                    <div className="dialogue-bubble">
                      <div className="dialogue-primary">
                        <strong lang="zh-Hans">{line.simplified}</strong>
                        <AudioButton
                          itemId={itemId}
                          text={line.audioText ?? line.simplified}
                          activeId={activeId}
                          onSpeak={speak}
                          compact
                        />
                      </div>
                      <span className="dialogue-traditional" lang="zh-Hant">
                        {line.traditional}
                      </span>
                      <span className="dialogue-pinyin">{line.pinyin}</span>
                      <p>{line.japanese}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </section>

      <aside className="vrchat-field-note">
        <span>FIELD NOTE</span>
        <div>
          <strong>通じることより、会話を止めないこと。</strong>
          <p>
            聞き取れない時は推測で流さず「你能说慢一点吗？」と頼めば大丈夫。
            スラングは相手が使った表現を少しずつ返すくらいが、ちょうどいい距離感だよ。
          </p>
        </div>
      </aside>

      {error && (
        <button type="button" className="audio-error audio-error--floating" onClick={clearError}>
          {error} <span>×</span>
        </button>
      )}
    </main>
  );
}
