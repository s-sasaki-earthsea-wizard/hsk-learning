import { VolumeIcon } from './Icons';

interface AudioButtonProps {
  itemId: string;
  text: string;
  activeId: string | null;
  onSpeak: (id: string, text: string, slow?: boolean) => void;
  compact?: boolean;
}

export function AudioButton({
  itemId,
  text,
  activeId,
  onSpeak,
  compact = false,
}: AudioButtonProps) {
  const isActive = activeId === itemId;

  return (
    <button
      type="button"
      className={`audio-button${compact ? ' audio-button--compact' : ''}${isActive ? ' is-active' : ''}`}
      onClick={() => onSpeak(itemId, text)}
      aria-label="gTTSで中国語の発音を再生"
      title="発音を聞く"
    >
      <VolumeIcon />
      {!compact && <span>{isActive ? '再生中…' : '発音を聞く'}</span>}
    </button>
  );
}
