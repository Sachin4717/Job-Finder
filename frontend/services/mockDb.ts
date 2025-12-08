import { Job, User, Application, UserRole, JobType } from '../types';

// Initial Mock Data
const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    employerId: 'emp-1',
    companyName: 'TechNova',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to lead our frontend team. You will be working with modern stack including Next.js and Tailwind.',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹25L - ₹35L',
    type: JobType.FULL_TIME,
    postedDate: new Date().toISOString(),
    requirements: ['5+ years React', 'TypeScript expert', 'Team leadership']
  },
  {
    id: 'job-2',
    employerId: 'emp-2',
    companyName: 'GreenEarth Co.',
    title: 'Sustainability Analyst',
    description: 'Help us make the world a better place by analyzing data and providing insights on our environmental impact.',
    location: 'Remote (India)',
    salaryRange: '₹12L - ₹18L',
    type: JobType.REMOTE,
    postedDate: new Date(Date.now() - 86400000).toISOString(),
    requirements: ['Data Analysis', 'Environmental Science degree', 'SQL']
  },
  {
    id: 'job-3',
    employerId: 'emp-1',
    companyName: 'TechNova',
    title: 'UX Designer',
    description: 'Design intuitive user experiences for our enterprise clients.',
    location: 'Mumbai, Maharashtra',
    salaryRange: '₹15L - ₹22L',
    type: JobType.CONTRACT,
    postedDate: new Date(Date.now() - 172800000).toISOString(),
    requirements: ['Figma', 'User Research', 'Prototyping']
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'emp-1',
    name: 'Sarah Connor',
    email: 'sarah@technova.com',
    role: UserRole.EMPLOYER,
    password: 'password',
    companyName: 'TechNova'
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.SEEKER,
    password: 'password',
    bio: 'Passionate frontend developer with 3 years of experience in React and Node.js.'
  }
];

// Changed keys to 'jobhut_' to ensure clean slate from previous 'nexus_' data
const STORAGE_KEYS = {
  JOBS: 'jobhut_jobs',
  USERS: 'jobhut_users',
  APPS: 'jobhut_applications',
  SESSION: 'jobhut_current_user'
};

export const getJobs = (): Job[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
  return JSON.parse(stored);
};

export const saveJob = (job: Job): void => {
  const jobs = getJobs();
  jobs.unshift(job);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const deleteJob = (jobId: string): void => {
  const jobs = getJobs().filter(j => j.id !== jobId);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  // Check if update or new
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // If this is the current user, update session too
  const current = getSession();
  if (current && current.id === user.id) {
    setSession(user);
  }
};

export const deleteUser = (userId: string): void => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Clean up user's jobs and applications if needed, 
  // but for mock purposes we'll leave them or clean them loosely
  const apps = getApplications().filter(a => a.seekerId !== userId);
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
};

export const getApplications = (): Application[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.APPS);
  return stored ? JSON.parse(stored) : [];
};

export const saveApplication = (app: Application): void => {
  const apps = getApplications();
  apps.push(app);
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
};

export const updateApplicationStatus = (appId: string, status: Application['status']): void => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === appId);
  if (index !== -1) {
    apps[index].status = status;
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  }
};

// Session Management
export const getSession = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
  return stored ? JSON.parse(stored) : null;
};

export const setSession = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};