import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function HeroSection() {
  return (
    <div className="section-content hero-section">
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
        Passionate about building creative software experiences.
        Welcome to my interactive 3D portfolio — scroll to explore my journey!
      </p>
      <div className="scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>
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
                  width: `${skill.percentage}%`,
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
              <div className="timeline-header">
                <div className="timeline-info">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <p className="timeline-company">{exp.Company}</p>
                  <span className="timeline-period">{exp.time}</span>
                </div>
              </div>
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
            <div className="project-icon">
              {project.name.charAt(0)}
            </div>
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
          <textarea name="message" required placeholder=" " rows={4} />
          <label>Message</label>
        </div>
        <button
          type="submit"
          className={`submit-btn ${status}`}
          disabled={status === 'sending'}
        >
          {status === 'idle' && 'Send Message'}
          {status === 'sending' && 'Sending...'}
          {status === 'sent' && 'Message Sent! ✓'}
          {status === 'error' && 'Error — Try Again'}
        </button>
      </form>
    </div>
  );
}

export default function ContentOverlay({ section, skills, projects, experience }) {
  return (
    <div className="content-overlay">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`overlay-panel ${section === i ? 'active' : ''}`}>
          <div className="scroll-paper">
            {i === 0 && <HeroSection />}
            {i === 1 && <SkillsSection skills={skills} />}
            {i === 2 && <ExperienceSection experience={experience} />}
            {i === 3 && <ProjectsSection projects={projects} />}
            {i === 4 && <ContactSection />}
          </div>
        </div>
      ))}
    </div>
  );
}
