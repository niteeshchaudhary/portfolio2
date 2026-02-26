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

function AnimatedSection({ children, className = '' }) {
  const ref = useRef();
  const inView = useInView(ref);
  return (
    <section ref={ref} className={`v2d-section ${className} ${inView ? 'in-view' : ''}`}>
      {children}
    </section>
  );
}

export default function View2D({ skills, projects, experience }) {
  const formRef = useRef();
  const [formStatus, setFormStatus] = useState('idle');

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

  return (
    <div className="view-2d">
      {/* Hero */}
      <section className="v2d-hero">
        <div className="v2d-hero-content">
          <p className="v2d-greeting">Hello, I am</p>
          <h1 className="v2d-name gradient-text">Niteesh Kamal Chaudhary</h1>
          <div className="v2d-roles">
            {['Software Developer', 'Backend Developer', 'Game Developer', 'Android Developer'].map((r, i) => (
              <span key={i} className="v2d-role">{r}</span>
            ))}
          </div>
          <p className="v2d-intro">
            Passionate about building creative software experiences. Explore my skills, experience, and projects below.
          </p>
          <div className="v2d-scroll-hint">↓ Scroll to explore</div>
        </div>
        <div className="v2d-hero-bg" />
      </section>

      {/* Skills */}
      <AnimatedSection className="v2d-skills">
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
      <AnimatedSection className="v2d-experience">
        <h2 className="v2d-section-title">💼 Experience</h2>
        <div className="v2d-timeline">
          {experience?.map((exp, i) => (
            <div key={i} className="v2d-timeline-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="v2d-timeline-dot" />
              <div className="v2d-timeline-card">
                <h3>{exp.role}</h3>
                <p className="v2d-company">{exp.Company}</p>
                <span className="v2d-time">{exp.time}</span>
                <p className="v2d-desc">{exp.Discription}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection className="v2d-projects">
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
              <div className="v2d-project-icon">{project.name.charAt(0)}</div>
              <h3>{project.name}</h3>
              <span>View on GitHub →</span>
            </a>
          ))}
        </div>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection className="v2d-contact">
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
