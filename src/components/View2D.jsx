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

function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !cursorDot || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Trail points for air wave
    const points = [];
    const maxPoints = 40;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instantly update inner dot
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Smooth animation loop for the outer ring and canvas trail
    let animationFrameId;
    const render = () => {
      cursorX += (mouseX - cursorX) * 0.2; // Ease amount
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

      // Update trail points
      points.push({ x: mouseX, y: mouseY });
      if (points.length > maxPoints) {
        points.shift();
      }

      // Draw air wave trail
      ctx.clearRect(0, 0, width, height);
      if (points.length > 2) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const pt = points[i];
          const nextPt = points[i + 1];
          const xc = (pt.x + nextPt.x) / 2;
          const yc = (pt.y + nextPt.y) / 2;
          ctx.quadraticCurveTo(pt.x, pt.y, xc, yc);
        }

        // Final point
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);

        // Styling the air wave
        const gradient = ctx.createLinearGradient(points[0].x, points[0].y, last.x, last.y);
        gradient.addColorStop(0, "rgba(168, 85, 247, 0)"); // fading tail end
        gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.4)");
        gradient.addColorStop(1, "rgba(168, 85, 247, 0.8)"); // bright head end

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 14;

        // Optional: composite operation to make it look "glowing" or airy
        ctx.globalCompositeOperation = "screen";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"; // Reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('nav-dot')
      ) {
        setIsHovering(true);
      }
    };

    const onMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="v2d-cursor-canvas" />
      <div ref={cursorRef} className={`v2d-cursor ${isHovering ? 'hover' : ''}`} />
      <div ref={cursorDotRef} className={`v2d-cursor-dot ${isHovering ? 'hover' : ''}`} />
    </>
  );
}

function ParallaxBackground({ containerRef }) {
  const bgRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    const container = containerRef.current;
    if (!bg || !container) return;

    // We'll use CSS variables to pass scroll and mouse data
    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
      const progress = scrollY / maxScroll;
      bg.style.setProperty('--scroll-p', progress);
    };

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      bg.style.setProperty('--mouse-x', x);
      bg.style.setProperty('--mouse-y', y);
    };

    // Initialize once
    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);

  return (
    <div className="v2d-parallax-bg" ref={bgRef}>
      <div className="v2d-layer v2d-layer-sky" />
      <div className="v2d-layer v2d-layer-stars" />
      <div className="v2d-layer v2d-layer-moon" />
      <div className="v2d-layer v2d-layer-clouds-back" />
      <div className="v2d-layer v2d-layer-clouds-front" />
      <div className="v2d-layer v2d-layer-mountains-back" />
      <div className="v2d-layer v2d-layer-mountains-front" />
      <div className="v2d-layer v2d-layer-trees-back" />
      <div className="v2d-layer v2d-layer-trees-front" />
    </div>
  );
}

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
