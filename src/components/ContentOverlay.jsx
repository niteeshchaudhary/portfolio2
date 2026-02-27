import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const PROFILE_IMAGE_URL = 'https://avatars.githubusercontent.com/u/66108270?v=4';

function HeroSection() {
  return (
    <div className="section-content hero-section">
      <img
        src={PROFILE_IMAGE_URL}
        alt="Niteesh Kamal Chaudhary"
        className="hero-profile-pic"
      />
      <div className="hero-greeting">Hello, I am</div>
      <h1 className="hero-name">
        <span className="gradient-text">Niteesh Kamal Chaudhary</span>
      </h1>
      <div className="hero-roles">
        <span className="role-tag">Software Developer</span>
        <span className="role-tag">Backend Developer</span>
        <span className="role-tag">Game Developer</span>
        <span className="role-tag">Android Developer</span>
      </div>
      <p className="hero-desc">
        Hello! I am an aspiring software engineer who enjoys solving puzzles and
        problems. I have strong technical skills and an academic background in
        engineering, coding and development. I'm interested in internship roles
        in software development, full stack development and game development.
        Please feel free to get in touch with me via email at{' '}
        <a href="mailto:nkchaudhary00@gmail.com" className="hero-email-link">nkchaudhary00@gmail.com</a>.
      </p>
    </div>
  );
}

function SkillsSection({ skills }) {
  if (!skills) return null;
  return (
    <div className="section-content skills-section">
      <h2 className="section-title">
        <span className="title-icon">⚡</span> Skills
      </h2>
      <div className="skills-grid">
        {skills.map((skill, i) => (
          <div key={i} className="skill-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-percent">{skill.percentage}%</span>
            </div>
            <div className="skill-bar">
              <div
                className="skill-fill"
                style={{
                  '--pct': `${skill.percentage}%`,
                  animationDelay: `${i * 0.1 + 0.3}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection({ experience }) {
  if (!experience) return null;
  return (
    <div className="section-content experience-section">
      <h2 className="section-title">
        <span className="title-icon">💼</span> Experience
      </h2>
      <div className="timeline">
        {experience.map((exp, i) => (
          <div key={i} className="timeline-item" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="timeline-dot" />
            <div className="timeline-card">
              <h3 className="timeline-role">{exp.role}</h3>
              <p className="timeline-company">{exp.Company}</p>
              <span className="timeline-period">{exp.time}</span>
              <p className="timeline-desc">{exp.Discription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects }) {
  if (!projects) return null;
  return (
    <div className="section-content projects-section">
      <h2 className="section-title">
        <span className="title-icon">🚀</span> Projects
      </h2>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <a
            key={i}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {project.thumb ? (
              <div className="project-thumb-container">
                <img src={project.thumb} alt={project.name} className="project-thumb" />
              </div>
            ) : (
              <div className="project-icon">{project.name.charAt(0)}</div>
            )}
            <div className="project-info">
              <h3 className="project-name">{project.name}</h3>
              <span className="project-link-text">View on GitHub →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  const formRef = useRef();
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    emailjs
      .sendForm('service_j9ovyx9', 'template_jlm3o95', formRef.current, 'qzrCzPgtdSbiIJl6v')
      .then(() => {
        emailjs.sendForm('service_j9ovyx9', 'template_rn5puj8', formRef.current, 'qzrCzPgtdSbiIJl6v');
        setStatus('sent');
        formRef.current.reset();
        setTimeout(() => setStatus('idle'), 4000);
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      });
  };

  return (
    <div className="section-content contact-section">
      <h2 className="section-title">
        <span className="title-icon">✉</span> Get in Touch
      </h2>
      <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input type="text" name="user_name" required placeholder=" " />
            <label>Name</label>
          </div>
          <div className="form-group">
            <input type="email" name="user_email" required placeholder=" " />
            <label>Email</label>
          </div>
        </div>
        <div className="form-group">
          <textarea name="message" required placeholder=" " rows={5} />
          <label>Message</label>
        </div>
        <button type="submit" className={`submit-btn ${status}`} disabled={status === 'sending'}>
          {status === 'idle' && 'Send Message'}
          {status === 'sending' && 'Sending...'}
          {status === 'sent' && 'Message Sent! ✓'}
          {status === 'error' && 'Error — Try Again'}
        </button>
      </form>
    </div>
  );
}

import CustomCursor from './CustomCursor';
import ParallaxBackground from './ParallaxBackground';

export default function ContentOverlay({ section, isOpen, onClose, skills, projects, experience }) {
  const scrollRef = useRef(null);

  return (
    <div className={`content-fullpage ${isOpen ? 'open' : ''}`}>
      {isOpen && <CustomCursor />}
      {isOpen && <ParallaxBackground containerRef={scrollRef} />}
      {/* Circular close button — top center */}
      <button className="content-close" onClick={onClose} aria-label="Close scroll">
        <span className="close-icon">✕</span>
      </button>

      {/* Hint at the bottom */}
      {isOpen && (
        <div className="content-hint">
          Close the scroll to continue the adventure
        </div>
      )}

      {/* Scrollable content area */}
      <div className="content-scroll-area" ref={scrollRef}>
        <div className="content-inner">
          {section === 0 && <HeroSection />}
          {section === 1 && <SkillsSection skills={skills} />}
          {section === 2 && <ExperienceSection experience={experience} />}
          {section === 3 && <ProjectsSection projects={projects} />}
          {section === 4 && <ContactSection />}
        </div>
      </div>
    </div>
  );
}
