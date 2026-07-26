import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (utteranceRef.current && 'speechSynthesis' in window) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setActiveId(null);
  }, []);

  useEffect(() => stop, [stop]);

  const speakWithBrowser = useCallback((text: string, slow: boolean) => {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = slow ? 0.7 : 0.95;
    const chineseVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    utterance.onend = () => {
      utteranceRef.current = null;
      setActiveId(null);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setActiveId(null);
      setError('ブラウザの音声合成で再生できなかったよ。');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const speak = useCallback(
    async (id: string, text: string, slow = false) => {
      stop();
      setActiveId(id);
      setError(null);

      try {
        const params = new URLSearchParams({ text, slow: String(slow) });
        const response = await fetch(`/api/speech?${params.toString()}`);
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? '音声を取得できなかったよ。');
        }

        const audioBlob = await response.blob();
        const objectUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(objectUrl);
        objectUrlRef.current = objectUrl;
        audioRef.current = audio;
        audio.addEventListener('ended', stop, { once: true });
        audio.addEventListener(
          'error',
          () => {
            setError('音声を再生できなかったよ。もう一度試してみてね。');
            stop();
          },
          { once: true },
        );
        await audio.play();
      } catch (speechError) {
        if (speakWithBrowser(text, slow)) {
          return;
        }
        stop();
        setError(
          speechError instanceof Error
            ? speechError.message
            : '音声を再生できなかったよ。',
        );
      }
    },
    [speakWithBrowser, stop],
  );

  return { speak, stop, activeId, error, clearError: () => setError(null) };
}
