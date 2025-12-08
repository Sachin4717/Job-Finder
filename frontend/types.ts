export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER'
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  REMOTE = 'Remote',
  INTERNSHIP = 'Internship'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
  bio?: string;
  resumeUrl?: string; // Mock URL
  companyName?: string;
  title?: string;
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  type: JobType;
  postedDate: string;
  requirements: string[];
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  seekerName: string;
  status: 'Applied' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Hired';
  appliedDate: string;
  coverLetter?: string;
}

export interface ViewState {
  view: 'HOME' | 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'JOB_DETAILS' | 'POST_JOB' | 'PROFILE';
  data?: any;
}