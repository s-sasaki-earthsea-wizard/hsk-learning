import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setActiveId(null);
  }, []);

  useEffect(() => stop, [stop]);

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
        stop();
        setError(
          speechError instanceof Error
            ? speechError.message
            : '音声を再生できなかったよ。',
        );
      }
    },
    [stop],
  );

  return { speak, stop, activeId, error, clearError: () => setError(null) };
}
