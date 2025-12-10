// Simple mock DB using in-memory arrays + localStorage for session
const STORAGE_KEYS = { JOBS: 'jobfinder_jobs', SESSION: 'jobfinder_session' };

const defaultJobs = [
  {
    id: 'job-1',
    employerId: 'emp-1',
    companyName: 'TechNova',
    title: 'Senior React Developer',
    description: 'Experienced React developer to build modern web apps.',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹25L - ₹35L',
    type: 'FULL_TIME',
    postedDate: new Date().toISOString(),
    requirements: ['5+ years React', 'JS', 'Team leadership']
  }
];

function loadJobs() {
  const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(defaultJobs));
  return defaultJobs.slice();
}

function saveJobs(jobs) {
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
}

export function getJobs() {
  return loadJobs();
}

export function getJobById(id) {
  return loadJobs().find(j => j.id === id) || null;
}

export function createJob(job) {
  const jobs = loadJobs();
  jobs.unshift({ ...job, id: 'job-' + (Date.now()), postedDate: new Date().toISOString() });
  saveJobs(jobs);
  return jobs[0];
}

export const STORAGE_KEYS_EXPORT = STORAGE_KEYS;

export const getSession = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
  return stored ? JSON.parse(stored) : null;
};

export const setSession = (user) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};
