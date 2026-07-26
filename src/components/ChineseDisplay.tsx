import type { HskItem } from '../types';

interface ChineseDisplayProps {
  item: HskItem;
  size?: 'large' | 'medium' | 'small';
  showLabels?: boolean;
}

export function ChineseDisplay({
  item,
  size = 'medium',
  showLabels = true,
}: ChineseDisplayProps) {
  return (
    <div className={`chinese-display chinese-display--${size}`}>
      <div className="script-row script-row--primary">
        {showLabels && <span className="script-label">簡体</span>}
        <span className="hanzi preserve-lines" lang="zh-Hans">{item.simplified}</span>
      </div>
      <div className="script-row">
        {showLabels && <span className="script-label">繁体</span>}
        <span className="traditional preserve-lines" lang="zh-Hant">{item.traditional}</span>
      </div>
      <div className="script-row">
        {showLabels && <span className="script-label">拼音</span>}
        <span className="pinyin preserve-lines" lang="zh-Latn">{item.pinyin}</span>
      </div>
    </div>
  );
}
