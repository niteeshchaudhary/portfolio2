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

function NavDots({ section, onNavigate, is3D }) {
  if (!is3D) return null;
  const labels = ['Welcome', 'Skills', 'Experience', 'Projects', 'Contact'];
  return (
    <nav className="nav-dots">
      {labels.map((label, i) => (
        <button
          key={i}
          className={`nav-dot ${section === i ? 'active' : ''}`}
          onClick={() => onNavigate(i)}
          aria-label={label}
        >
          <span className="dot-label">{label}</span>
        </button>
      ))}
    </nav>
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
  const [showLoading, setShowLoading] = useState(true);
  const scrollTarget = useRef(0);
  const touchStartY = useRef(0);

  const navigateToSection = useCallback((index) => {
    scrollTarget.current = index / 4;
  }, []);

  useEffect(() => {
    if (!is3D) return;

    const onWheel = (e) => {
      e.preventDefault();
      scrollTarget.current = clamp(scrollTarget.current + e.deltaY * 0.00035, 0, 1);
    };

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const delta = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      scrollTarget.current = clamp(scrollTarget.current + delta * 0.002, 0, 1);
    };

    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollTarget.current = clamp(scrollTarget.current + 0.05, 0, 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollTarget.current = clamp(scrollTarget.current - 0.05, 0, 1);
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
  }, [is3D]);

  if (showLoading || loading) {
    return <LoadingScreen onFinished={() => setShowLoading(false)} />;
  }

  return (
    <div className="app">
      {is3D ? (
        <>
          <Scene3D scrollTarget={scrollTarget} onSectionChange={setActiveSection} />
          <ContentOverlay
            section={activeSection}
            skills={skills}
            projects={projects}
            experience={experience}
          />
        </>
      ) : (
        <View2D skills={skills} projects={projects} experience={experience} />
      )}

      <NavDots section={activeSection} onNavigate={navigateToSection} is3D={is3D} />
      <ViewToggle is3D={is3D} onToggle={() => setIs3D(prev => !prev)} />

      <header className="site-header">
        <span className="site-logo">NKC</span>
      </header>
    </div>
  );
}
