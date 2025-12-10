// Simple mock DB using localStorage. Designed for demo/testing only.
const KEYS = {
  JOBS: 'jf_jobs_v1',
  USERS: 'jf_users_v1',
  APPS: 'jf_apps_v1',
  SESSION: 'jf_session_v1'
};

const defaultJobs = [
  {
    id: 'job-1',
    employerId: 'emp-1',
    companyName: 'TechNova',
    title: 'Senior React Developer',
    description: 'Experienced React developer to build modern web apps.',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹25L - ₹35L',
    type: 'Full-time',
    postedDate: new Date().toISOString(),
    requirements: ['5+ years React', 'JS', 'Team leadership']
  }
];

function read(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback || []));
    return JSON.parse(JSON.stringify(fallback || []));
  }
  try { return JSON.parse(raw); } catch(e){ return fallback || []; }
}
function write(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

export function getJobs() { return read(KEYS.JOBS, defaultJobs); }
export function getJobById(id) { return getJobs().find(j=>j.id===id) || null; }
export function saveJob(job) {
  const jobs = getJobs();
  jobs.unshift(job);
  write(KEYS.JOBS, jobs);
  return job;
}
export function deleteJob(id) {
  const jobs = getJobs().filter(j=>j.id!==id);
  write(KEYS.JOBS, jobs);
}
export function updateJob(id, patch) {
  const jobs = getJobs().map(j => j.id===id?({...j, ...patch}):j);
  write(KEYS.JOBS, jobs);
}

// Users
export function getUsers() { return read(KEYS.USERS, [{id:'emp-1', name:'TechNova HR', email:'hr@technova.com', password:'password', role:'EMPLOYER', companyName:'TechNova'}]); }
export function getUserByEmail(email) { return getUsers().find(u=>u.email===email) || null; }
export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  write(KEYS.USERS, users);
  return user;
}
export function updateUser(id, patch) {
  const users = getUsers().map(u => u.id===id?({...u, ...patch}):u);
  write(KEYS.USERS, users);
}

// Applications
export function getApplications() { return read(KEYS.APPS, []); }
export function saveApplication(app) {
  const apps = getApplications();
  apps.unshift(app);
  write(KEYS.APPS, apps);
  return app;
}
export function updateApplicationStatus(id, status) {
  const apps = getApplications().map(a=>a.id===id?({...a, status}):a);
  write(KEYS.APPS, apps);
}

// Session helpers
export function getSession() { return read(KEYS.SESSION, null); }
export function setSession(user) { localStorage.setItem(KEYS.SESSION, JSON.stringify(user)); }
export function clearSession() { localStorage.removeItem(KEYS.SESSION); }