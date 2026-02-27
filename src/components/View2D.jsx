import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

import CustomCursor from './CustomCursor';

import ParallaxBackground from './ParallaxBackground';

function AnimatedSection({ children, className = '', id }) {
  const ref = useRef();
  const inView = useInView(ref);
  return (
    <section id={id} ref={ref} className={`v2d-section ${className} ${inView ? 'in-view' : ''}`}>
      {children}
    </section>
  );
}

export default function View2D({ skills, projects, experience }) {
  const formRef = useRef();
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const view2dRef = useRef(null);
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    const heroBg = heroBgRef.current;
    const heroContent = heroContentRef.current;
    const container = view2dRef.current;
    if (!heroBg || !heroContent || !container) return;

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 10px move
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      heroBg.style.transform = `translate3d(${x * 1.5}px, ${y * 1.5}px, 0)`;
      heroContent.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    };

    const onScroll = () => {
      const scrollY = container.scrollTop;
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
      heroContent.style.opacity = 1 - Math.min(scrollY / 500, 1);
      heroContent.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    emailjs
      .sendForm('service_j9ovyx9', 'template_jlm3o95', formRef.current, 'qzrCzPgtdSbiIJl6v')
      .then(() => {
        emailjs.sendForm('service_j9ovyx9', 'template_rn5puj8', formRef.current, 'qzrCzPgtdSbiIJl6v');
        setFormStatus('sent');
        formRef.current.reset();
        setTimeout(() => setFormStatus('idle'), 4000);
      })
      .catch(() => {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      });
  };

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="view-2d" ref={view2dRef}>
      <CustomCursor />
      <ParallaxBackground containerRef={view2dRef} />
      {/* Nav */}
      <nav className="v2d-nav">
        <a href="#home" onClick={(e) => scrollTo(e, 'home')}>
          <span className="v2d-nav-icon">🏠</span>
          <span className="v2d-nav-text">Home</span>
        </a>
        <a href="#skills" onClick={(e) => scrollTo(e, 'skills')}>
          <span className="v2d-nav-icon">⚡</span>
          <span className="v2d-nav-text">Skills</span>
        </a>
        <a href="#experience" onClick={(e) => scrollTo(e, 'experience')}>
          <span className="v2d-nav-icon">💼</span>
          <span className="v2d-nav-text">Experience</span>
        </a>
        <a href="#projects" onClick={(e) => scrollTo(e, 'projects')}>
          <span className="v2d-nav-icon">🚀</span>
          <span className="v2d-nav-text">Projects</span>
        </a>
        <a href="#contact" onClick={(e) => scrollTo(e, 'contact')}>
          <span className="v2d-nav-icon">✉</span>
          <span className="v2d-nav-text">Contact</span>
        </a>
      </nav>

      {/* Hero */}
      <section id="home" className="v2d-hero">
        <div className="v2d-hero-content" ref={heroContentRef}>
          <img src="https://avatars.githubusercontent.com/u/66108270?v=4" alt="Niteesh Kamal Chaudhary" className="v2d-hero-pic" />
          <p className="v2d-greeting">Hello, I am</p>
          <h1 className="v2d-name gradient-text">Niteesh Kamal Chaudhary</h1>
          <div className="v2d-roles">
            {['Software Developer', 'Backend Developer', 'Game Developer', 'Android Developer'].map((r, i) => (
              <span key={i} className="v2d-role">{r}</span>
            ))}
          </div>
          <p className="v2d-intro">
            Hello! I am an aspiring software engineer who enjoys solving puzzles and
            problems. I have strong technical skills and an academic background in
            engineering, coding and development. I'm interested in internship roles
            in software development, full stack development and game development.
            Please feel free to get in touch with me via email at{' '}
            <a href="mailto:nkchaudhary00@gmail.com" className="v2d-email-link">nkchaudhary00@gmail.com</a>.
          </p>
          <div className="v2d-scroll-hint">↓ Scroll to explore</div>
        </div>
        <div className="v2d-hero-bg" ref={heroBgRef} />
      </section>

      {/* Skills */}
      <AnimatedSection id="skills" className="v2d-skills">
        <h2 className="v2d-section-title">⚡ Skills</h2>
        <div className="v2d-skills-grid">
          {skills?.map((skill, i) => (
            <div key={i} className="v2d-skill-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="v2d-skill-top">
                <span>{skill.name}</span>
                <span className="v2d-skill-pct">{skill.percentage}%</span>
              </div>
              <div className="v2d-skill-bar">
                <div className="v2d-skill-fill" style={{ '--pct': `${skill.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Experience */}
      <AnimatedSection id="experience" className="v2d-experience">
        <h2 className="v2d-section-title">💼 Experience</h2>
        <div className="v2d-timeline">
          {experience?.map((exp, i) => (
            <div key={i} className="v2d-timeline-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="v2d-timeline-dot" />
              <div className="v2d-timeline-card">
                {exp.image && <img src={exp.image} alt={exp.Company} className="v2d-company-logo" />}
                <div className="v2d-timeline-info">
                  <h3>{exp.role}</h3>
                  <p className="v2d-company">{exp.Company}</p>
                  <span className="v2d-time">{exp.time}</span>
                  <p className="v2d-desc">{exp.Discription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection id="projects" className="v2d-projects">
        <h2 className="v2d-section-title">🚀 Projects</h2>
        <div className="v2d-projects-grid">
          {projects?.map((project, i) => (
            <a
              key={i}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="v2d-project-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {project.thumb ? (
                <div className="v2d-project-thumb-container">
                  <img src={project.thumb} alt={project.name} className="v2d-project-thumb" />
                </div>
              ) : (
                <div className="v2d-project-icon">{project.name.charAt(0)}</div>
              )}
              <h3>{project.name}</h3>
              <span>View on GitHub →</span>
            </a>
          ))}
        </div>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection id="contact" className="v2d-contact">
        <h2 className="v2d-section-title">✉ Contact</h2>
        <form ref={formRef} className="v2d-form" onSubmit={handleSubmit}>
          <div className="v2d-form-row">
            <div className="v2d-form-group">
              <input type="text" name="user_name" required placeholder="Name" />
            </div>
            <div className="v2d-form-group">
              <input type="email" name="user_email" required placeholder="Email" />
            </div>
          </div>
          <div className="v2d-form-group">
            <textarea name="message" required placeholder="Message" rows={5} />
          </div>
          <button type="submit" className={`v2d-submit ${formStatus}`} disabled={formStatus === 'sending'}>
            {formStatus === 'idle' && 'Send Message'}
            {formStatus === 'sending' && 'Sending...'}
            {formStatus === 'sent' && 'Sent! ✓'}
            {formStatus === 'error' && 'Error — Try Again'}
          </button>
        </form>
      </AnimatedSection>

      {/* Footer */}
      <footer className="v2d-footer">
        <p>© {new Date().getFullYear()} Niteesh Kamal Chaudhary. All rights reserved.</p>
      </footer>
    </div>
  );
}
