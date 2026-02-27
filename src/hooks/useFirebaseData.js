import { useState, useEffect } from 'react';
import { getDatabase, ref, child, get } from 'firebase/database';
import { app } from '../assets/firebase';
import { fallbackSkills, fallbackProjects, fallbackExperience } from '../data/fallbackData';

export function useFirebaseData() {
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(getDatabase(app));

    Promise.all([
      get(child(dbRef, 'skills')).then(snap => snap.exists() ? snap.val() : null),
      get(child(dbRef, 'projects')).then(snap => snap.exists() ? snap.val() : null),
      get(child(dbRef, 'experience')).then(snap => snap.exists() ? snap.val() : null),
    ])
      .then(([skillsData, projectsData, experienceData]) => {
        const toArray = d => (d && !Array.isArray(d)) ? Object.values(d) : d;
        setSkills(toArray(skillsData) || fallbackSkills);
        setProjects(toArray(projectsData) || fallbackProjects);
        setExperience(toArray(experienceData) || fallbackExperience);
      })
      .catch(() => {
        setSkills(fallbackSkills);
        setProjects(fallbackProjects);
        setExperience(fallbackExperience);
      })
      .finally(() => setLoading(false));
  }, []);

  return { skills, projects, experience, loading };
}
