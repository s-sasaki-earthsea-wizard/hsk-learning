import type { HskLevel, Screen } from '../types';
import { HomeIcon } from './Icons';

interface AppHeaderProps {
  screen: Screen;
  level: HskLevel;
  onHome: () => void;
}

export function AppHeader({ screen, level, onHome }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={onHome} aria-label="ホームへ戻る">
        <span className="brand-seal" aria-hidden="true">字</span>
        <span className="brand-copy">
          <strong>HANZI STEP</strong>
          <small>中国語の小さな一歩</small>
        </span>
      </button>
      <div className="header-actions">
        {screen !== 'home' && (
          <button type="button" className="header-home-button" onClick={onHome}>
            <HomeIcon />
            <span>ホーム</span>
          </button>
        )}
        <span className="level-pill">HSK {level}</span>
      </div>
    </header>
  );
}
