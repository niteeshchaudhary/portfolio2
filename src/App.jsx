import { useState, useEffect, useRef, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import ContentOverlay from './components/ContentOverlay';
import View2D from './components/View2D';
import LoadingScreen from './components/LoadingScreen';
import { useFirebaseData } from './hooks/useFirebaseData';
import './App.css';

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

const SECTION_NAMES = ['Welcome', 'Skills', 'Experience', 'Projects', 'Contact'];
const TOTAL_SECTIONS = 5;

function GameHUD({ section, isContentOpen, is3D }) {
  if (!is3D) return null;
  return (
    <div className="game-hud">
      {!isContentOpen && <div className="crosshair" />}

      {!isContentOpen && (
        <div className="hud-objective">
          <span className="hud-label">OBJECTIVE</span>
          <span className="hud-value">{SECTION_NAMES[section] || ''}</span>
        </div>
      )}

      <div className={`hud-progress ${isContentOpen ? 'dim' : ''}`}>
        {SECTION_NAMES.map((name, i) => (
          <div key={i} className={`hud-step ${section >= i ? 'reached' : ''} ${section === i ? 'current' : ''}`}>
            <div className="hud-step-dot" />
            <span className="hud-step-label">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewToggle({ is3D, onToggle }) {
  return (
    <button className="view-toggle" onClick={onToggle} aria-label="Toggle view mode">
      <span className={`toggle-option ${is3D ? 'active' : ''}`}>3D</span>
      <span className="toggle-divider">/</span>
      <span className={`toggle-option ${!is3D ? 'active' : ''}`}>2D</span>
    </button>
  );
}

export default function App() {
  const { skills, projects, experience, loading } = useFirebaseData();
  const [is3D, setIs3D] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const scrollTarget = useRef(0);
  const touchStartY = useRef(0);
  const openTimerRef = useRef(null);
  const unlockedRef = useRef(0);
  const initialOpenDone = useRef(false);

  const handleCloseContent = useCallback(() => {
    setIsContentOpen(false);
    unlockedRef.current = Math.max(unlockedRef.current, activeSection + 1);
  }, [activeSection]);

  // Open initial section after loading completes
  useEffect(() => {
    if (showLoading || loading || initialOpenDone.current) return;
    initialOpenDone.current = true;
    openTimerRef.current = setTimeout(() => {
      setIsContentOpen(true);
    }, 800);
    return () => clearTimeout(openTimerRef.current);
  }, [showLoading, loading]);

  // Auto-open content when activeSection changes (after the initial one)
  useEffect(() => {
    if (!initialOpenDone.current) return;
    setIsContentOpen(false);
    clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setIsContentOpen(true);
    }, 500);
    return () => clearTimeout(openTimerRef.current);
  }, [activeSection]);

  // Scroll input — only when content is CLOSED and in 3D mode
  useEffect(() => {
    if (!is3D || isContentOpen) return;

    const fullyUnlocked = () => unlockedRef.current >= TOTAL_SECTIONS;
    const maxProgress = () => Math.min(unlockedRef.current / TOTAL_SECTIONS, 1);

    const applyDelta = (rawDelta) => {
      // Limit the delta to prevent runaway scrolling and normalize speed
      const cappedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 0.02);

      if (fullyUnlocked()) {
        scrollTarget.current += cappedDelta;
      } else {
        scrollTarget.current = clamp(scrollTarget.current + cappedDelta, 0, maxProgress());
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      applyDelta(e.deltaY * 0.001);
    };
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      e.preventDefault();
      const d = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      applyDelta(d * 0.005);
    };
    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        applyDelta(0.04);
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        applyDelta(-0.04);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [is3D, isContentOpen]);

  // Escape key to close content
  useEffect(() => {
    if (!isContentOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsContentOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isContentOpen]);

  if (showLoading || loading) {
    return <LoadingScreen onFinished={() => setShowLoading(false)} />;
  }

  return (
    <div className="app">
      {is3D ? (
        <>
          <Scene3D
            scrollTarget={scrollTarget}
            onSectionChange={setActiveSection}
            isContentOpen={isContentOpen}
          />
          <ContentOverlay
            section={activeSection}
            isOpen={isContentOpen}
            onClose={handleCloseContent}
            skills={skills}
            projects={projects}
            experience={experience}
          />
          <GameHUD section={activeSection} isContentOpen={isContentOpen} is3D={is3D} />
        </>
      ) : (
        <View2D skills={skills} projects={projects} experience={experience} />
      )}

      <ViewToggle is3D={is3D} onToggle={() => setIs3D(prev => !prev)} />

      <header className="site-header">
        <span className="site-logo">NKC</span>
      </header>
    </div>
  );
}
