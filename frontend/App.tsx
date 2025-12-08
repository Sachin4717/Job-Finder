import React, { useState, useEffect } from 'react';
import { User, Job, Application, UserRole, JobType, ViewState } from './types';
import * as DB from './services/mockDb';
import * as AI from './services/geminiService';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  CheckCircle, 
  Building2, 
  LayoutDashboard,
  Sparkles,
  X,
  Trash2,
  IndianRupee,
  UserPlus,
  ChevronRight,
  Save,
  ArrowLeft
} from 'lucide-react';

// --- Shared UI Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button',
  title
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'; 
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}) => {
  const base = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:brightness-110 border border-white/10",
    secondary: "bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:text-white backdrop-blur-md border border-white/5",
    outline: "border border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 bg-transparent",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/50",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      type={type}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 grayscale' : ''} ${className}`} 
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="mb-5 group">
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 group-focus-within:text-violet-400 transition-colors">{label}</label>
    <input 
      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all shadow-inner" 
      {...props} 
    />
  </div>
);

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode, color?: string }) => {
  // Map simple color names to tailwind classes for the new theme
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gray: "bg-slate-700/50 text-slate-400 border-slate-600/50"
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style} backdrop-blur-sm`}>
      {children}
    </span>
  );
};

// --- Sub Components ---

const Navbar = ({ 
  user, 
  onNavigate, 
  onLogout 
}: { 
  user: User | null; 
  onNavigate: (view: ViewState['view']) => void; 
  onLogout: () => void 
}) => (
  <nav className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-7xl rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
    <div className="px-4 sm:px-6">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('HOME')}>
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2 rounded-lg mr-3 group-hover:rotate-12 transition-transform duration-300">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight group-hover:to-violet-400 transition-all">
            Job Hut
          </span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" onClick={() => onNavigate('HOME')} className="hidden md:flex">Find Jobs</Button>
          {user ? (
            <>
              <Button variant="outline" onClick={() => onNavigate('DASHBOARD')} className="hidden sm:flex">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-700/50">
                <div 
                  className="text-sm text-right hidden md:block cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
                  onClick={() => onNavigate('PROFILE')}
                  title="View Profile"
                >
                  <p className="font-bold text-slate-200 group-hover:text-violet-400 transition-colors">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <div onClick={() => onNavigate('PROFILE')} className="md:hidden cursor-pointer p-2 bg-slate-800 rounded-full">
                  <UserIcon className="w-5 h-5 text-violet-400" />
                </div>
                <Button variant="danger" onClick={onLogout} className="!p-2.5 rounded-full" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onNavigate('LOGIN')}>Log In</Button>
              <Button variant="primary" onClick={() => onNavigate('REGISTER')}>
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const JobCard = ({ job, onClick }: { job: Job; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group relative bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-violet-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.2)]"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">{job.title}</h3>
        <p className="text-slate-400 font-medium mt-1">{job.companyName}</p>
      </div>
      <Badge color="purple">{job.type}</Badge>
    </div>
    
    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-5">
      <div className="flex items-center text-slate-400">
        <MapPin className="w-4 h-4 mr-1.5 text-cyan-500" />
        {job.location}
      </div>
      <div className="flex items-center text-slate-400">
        <IndianRupee className="w-4 h-4 mr-1.5 text-emerald-500" />
        {job.salaryRange}
      </div>
    </div>
    
    <p className="text-slate-400 line-clamp-2 text-sm mb-4 leading-relaxed">{job.description}</p>

    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
      <span className="text-xs text-slate-600 flex items-center">
         <Building2 className="w-3 h-3 mr-1" />
         {new Date(job.postedDate).toLocaleDateString()}
      </span>
      <span className="text-violet-400 text-sm font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
        View Details <ChevronRight className="w-4 h-4 ml-1" />
      </span>
    </div>
  </div>
);

const JobFilters = ({ onSearch }: { onSearch: (filters: any) => void }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    onSearch({ keyword, location, type });
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-violet-500 transition-colors" />
        <input
          type="text"
          placeholder="Job title or keywords..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="flex-1 w-full relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
        <input
          type="text"
          placeholder="Location (e.g. Bangalore)..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <select
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-violet-500/50 outline-none appearance-none cursor-pointer"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" className="bg-slate-900">All Types</option>
          {Object.values(JobType).map(t => (
            <option key={t} value={t} className="bg-slate-900">{t}</option>
          ))}
        </select>
      </div>
      <Button onClick={handleSearch} className="w-full md:w-auto min-w-[120px]">Search</Button>
    </div>
  );
};

// --- Main Pages ---

const AuthPage = ({ 
  type, 
  onSuccess,
  onNavigate
}: { 
  type: 'LOGIN' | 'REGISTER', 
  onSuccess: (user: User) => void,
  onNavigate: (view: ViewState['view']) => void
}) => {
  const isLogin = type === 'LOGIN';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = DB.getUsers();
    
    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid credentials');
      }
    } else {
      if (users.find(u => u.email === email)) {
        setError('User already exists');
        return;
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role
      };
      DB.saveUser(newUser);
      onSuccess(newUser);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)]">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Job Hut'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? 'Sign in to access your dashboard' : 'Start your professional journey today'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/20 p-3 rounded-xl">{error}</div>}
          
          <div className="space-y-4">
            {!isLogin && (
               <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
            )}
            <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setRole(UserRole.SEEKER)}
                    className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${role === UserRole.SEEKER ? 'bg-violet-600/20 border-violet-500 text-violet-300' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    Job Seeker
                  </div>
                  <div 
                    onClick={() => setRole(UserRole.EMPLOYER)}
                    className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${role === UserRole.EMPLOYER ? 'bg-violet-600/20 border-violet-500 text-violet-300' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    Employer
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full text-lg shadow-lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>
        <div className="text-center pt-4 border-t border-white/5">
          <button 
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            onClick={() => {
              onNavigate(isLogin ? 'REGISTER' : 'LOGIN');
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ 
  user, 
  onBack, 
  onLogout,
  onUpdateUser 
}: { 
  user: User, 
  onBack: () => void, 
  onLogout: () => void,
  onUpdateUser: (updatedUser: User) => void
}) => {
  const [bio, setBio] = useState(user.bio || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const updatedUser = { ...user, bio };
    DB.saveUser(updatedUser);
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      DB.deleteUser(user.id);
      onLogout();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button variant="secondary" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="relative h-32 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-80"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end">
              <div className="w-24 h-24 bg-slate-900 rounded-2xl p-1 shadow-xl">
                 <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center border border-white/10">
                    <UserIcon className="w-10 h-10 text-violet-400" />
                 </div>
              </div>
              <div className="ml-4 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-slate-400">{user.email}</p>
              </div>
            </div>
            <Badge color="purple">{user.role}</Badge>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> About Me
              </h2>
              {!isEditing ? (
                <Button variant="secondary" className="!py-1.5 !text-xs" onClick={() => setIsEditing(true)}>Edit Bio</Button>
              ) : (
                <Button variant="primary" className="!py-1.5 !text-xs" onClick={handleSave}>
                  <Save className="w-3 h-3" /> Save
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <textarea
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-violet-500/50 outline-none min-h-[150px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {user.bio || "No bio added yet. Add a bio to let employers know who you are!"}
              </p>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
             <h3 className="text-red-400 font-bold mb-2 text-sm uppercase tracking-wider">Danger Zone</h3>
             <div className="flex items-center justify-between bg-red-900/10 border border-red-500/10 p-4 rounded-xl">
               <p className="text-sm text-slate-400">Permanently delete your account and all data.</p>
               <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployerDashboard = ({ user, onPostJob }: { user: User, onPostJob: () => void }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter jobs for this employer
    const allJobs = DB.getJobs().filter(j => j.employerId === user.id);
    const allApps = DB.getApplications().filter(a => allJobs.some(j => j.id === a.jobId));
    setJobs(allJobs);
    setApplications(allApps);
    setLoading(false);
  }, [user.id]);

  const handleDelete = (id: string) => {
    if(confirm('Delete this listing?')) {
      DB.deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
    }
  }

  const handleStatusChange = (appId: string, status: Application['status']) => {
    DB.updateApplicationStatus(appId, status);
    setApplications(applications.map(a => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employer Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your listings and track candidates</p>
        </div>
        <Button onClick={onPostJob}>
          <Plus className="w-5 h-5" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            Active Listings
          </h2>
          {jobs.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl">
              <p className="text-slate-500">No active jobs posted.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="border border-white/5 bg-white/5 rounded-2xl p-5 flex justify-between items-center hover:bg-white/10 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-100">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <Button variant="danger" className="!p-2.5 rounded-lg" onClick={() => handleDelete(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
               <UserIcon className="w-5 h-5 text-emerald-400" />
            </div>
            Recent Applications
          </h2>
           {applications.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-700 rounded-2xl">
              <p className="text-slate-500">No applications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="border border-white/5 bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-100">{app.seekerName}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">For: {job?.title || 'Unknown Job'}</p>
                      </div>
                      <Badge color={app.status === 'Applied' ? 'yellow' : app.status === 'Hired' ? 'green' : app.status === 'Rejected' ? 'red' : 'blue'}>
                        {app.status}
                      </Badge>
                    </div>
                    {app.coverLetter && (
                      <div className="text-xs text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-xl border border-white/5 leading-relaxed">
                        <span className="font-bold text-violet-400">AI Summary:</span> {app.coverLetter.substring(0, 100)}...
                      </div>
                    )}
                    <div className="flex gap-3 text-xs font-medium pt-2 border-t border-white/5">
                      <button className="text-blue-400 hover:text-blue-300 hover:underline" onClick={() => handleStatusChange(app.id, 'Interviewing')}>Interview</button>
                      <button className="text-emerald-400 hover:text-emerald-300 hover:underline" onClick={() => handleStatusChange(app.id, 'Hired')}>Hire</button>
                      <button className="text-red-400 hover:text-red-300 hover:underline" onClick={() => handleStatusChange(app.id, 'Rejected')}>Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SeekerDashboard = ({ user }: { user: User }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    const apps = DB.getApplications().filter(a => a.seekerId === user.id);
    setApplications(apps);
    setAllJobs(DB.getJobs());
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-slate-400 mt-1">Track your career progress</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 bg-white/5">
          <h2 className="font-bold text-xl text-white">Application History</h2>
        </div>
        {applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            You haven't applied to any jobs yet. <br/>
            <span className="text-sm mt-2 inline-block">Start applying to see your status here!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {applications.map(app => {
              const job = allJobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="px-8 py-6 hover:bg-white/5 transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-violet-400 transition-colors">{job?.title || 'Job Unavailable'}</h3>
                      <p className="text-slate-400">{job?.companyName}</p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                      <div className="text-sm text-slate-500">
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                      <Badge color={app.status === 'Hired' ? 'green' : app.status === 'Rejected' ? 'red' : 'blue'}>
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const PostJobForm = ({ user, onCancel, onSuccess }: { user: User, onCancel: () => void, onSuccess: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState<JobType>(JobType.FULL_TIME);
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!title) return alert("Please enter a job title first.");
    setIsGenerating(true);
    const desc = await AI.generateJobDescription(title, keywords || 'general requirements');
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: `job-${Date.now()}`,
      employerId: user.id,
      companyName: user.companyName || 'Undisclosed Company',
      title,
      description,
      location,
      salaryRange: salary,
      type,
      postedDate: new Date().toISOString(),
      requirements: keywords.split(',').map(s => s.trim())
    };
    DB.saveJob(newJob);
    onSuccess();
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 my-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Post a New Job</h2>
        <button onClick={onCancel} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Senior Frontend Engineer" />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Bangalore, India" />
          <Input label="Salary Range" value={salary} onChange={(e) => setSalary(e.target.value)} required placeholder="e.g. ₹15 LPA - ₹25 LPA" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Type</label>
          <select 
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-violet-500/50 outline-none"
            value={type}
            onChange={(e) => setType(e.target.value as JobType)}
          >
            {Object.values(JobType).map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
          </select>
        </div>

        <div className="bg-violet-900/10 border border-violet-500/20 p-5 rounded-2xl">
           <label className="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-2">AI Assistant</label>
           <div className="flex gap-3">
             <input 
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-violet-500/50"
                placeholder="Keywords: React, TypeScript, Leadership..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
             />
             <Button variant="primary" onClick={handleAiGenerate} disabled={isGenerating || !title} className="!px-6">
                {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Sparkles className="w-4 h-4" />}
                <span className="hidden sm:inline">Generate</span>
             </Button>
           </div>
           <p className="text-xs text-slate-500 mt-2">Enter your title and keywords, then let AI write the description for you.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
          <textarea 
            rows={8}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-violet-500/50 outline-none leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Detailed job description..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Post Job</Button>
        </div>
      </form>
    </div>
  );
};

const JobDetails = ({ job, user, onBack, onApply }: { job: Job, user: User | null, onBack: () => void, onApply: (jobId: string, coverLetter: string) => void }) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      const apps = DB.getApplications();
      setHasApplied(apps.some(a => a.seekerId === user.id && a.jobId === job.id));
    }
  }, [user, job.id]);

  const handleAiOptimize = async () => {
    if (!user?.bio) return alert("Please update your profile bio first to use this feature.");
    setIsGenerating(true);
    const optimized = await AI.optimizeCoverLetter(job.title, user.bio);
    setCoverLetter(optimized);
    setIsGenerating(false);
  };

  const submitApplication = () => {
    onApply(job.id, coverLetter);
    setShowApplyModal(false);
    setHasApplied(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="secondary" onClick={onBack} className="mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Button>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
        {/* Header background decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 pointer-events-none"></div>

        <div className="p-8 md:p-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{job.title}</h1>
              <div className="text-xl text-violet-300 font-medium mb-6">{job.companyName}</div>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <Badge color="purple">{job.type}</Badge>
                <span className="flex items-center px-3 py-1 bg-slate-800/50 rounded-full border border-white/5"><MapPin className="w-4 h-4 mr-2 text-cyan-400"/> {job.location}</span>
                <span className="flex items-center px-3 py-1 bg-slate-800/50 rounded-full border border-white/5"><IndianRupee className="w-4 h-4 mr-2 text-emerald-400"/> {job.salaryRange}</span>
                <span className="flex items-center px-3 py-1 bg-slate-800/50 rounded-full border border-white/5"><Building2 className="w-4 h-4 mr-2 text-amber-400"/> Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[150px]">
              {user?.role === UserRole.SEEKER && (
                <Button 
                  disabled={hasApplied} 
                  onClick={() => setShowApplyModal(true)}
                  className="w-full"
                >
                  {hasApplied ? <><CheckCircle className="w-4 h-4" /> Applied</> : 'Apply Now'}
                </Button>
              )}
               {!user && (
                 <div className="text-sm text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-white/10 text-center">Log in to apply</div>
               )}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 pt-0">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>
          
          <h3 className="text-xl font-bold text-white mb-4">About the Role</h3>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 mb-8 whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
          
          {job.requirements.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-white/5">
                    <div className="min-w-[6px] h-[6px] rounded-full bg-violet-500 mt-2 mr-3"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-slate-900 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
            
            <h2 className="text-2xl font-bold text-white mb-6">Apply for {job.title}</h2>
            
            <div className="mb-6">
               <div className="flex justify-between items-center mb-3">
                 <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Cover Letter</label>
                 <button 
                  onClick={handleAiOptimize}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1.5 text-fuchsia-400 hover:text-fuchsia-300 font-medium bg-fuchsia-500/10 px-2 py-1 rounded-full transition-colors"
                 >
                   {isGenerating ? 'Generating...' : <><Sparkles className="w-3 h-3"/> AI Auto-Write</>}
                 </button>
               </div>
               <textarea
                 className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-violet-500/50 outline-none h-40 leading-relaxed"
                 value={coverLetter}
                 onChange={(e) => setCoverLetter(e.target.value)}
                 placeholder="Tell us why you are a perfect fit..."
               ></textarea>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Resume</label>
              <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/50 transition-colors group cursor-pointer">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-slate-800 rounded-full mb-2 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PDF or DOCX (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowApplyModal(false)}>Cancel</Button>
              <Button onClick={submitApplication}>Submit Application</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon used in modal
import { FileText } from 'lucide-react';

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<ViewState>({ view: 'HOME' });
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Load user from session and jobs on mount
  useEffect(() => {
    const jobs = DB.getJobs();
    setFilteredJobs(jobs);

    const currentUser = DB.getSession();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    DB.setSession(loggedInUser);
    setViewState({ view: loggedInUser.role === UserRole.EMPLOYER ? 'DASHBOARD' : 'HOME' });
  };

  const handleLogout = () => {
    setUser(null);
    DB.clearSession();
    setViewState({ view: 'HOME' });
  };

  const handleSearch = (filters: any) => {
    let jobs = DB.getJobs();
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      jobs = jobs.filter(j => j.title.toLowerCase().includes(k) || j.description.toLowerCase().includes(k));
    }
    if (filters.location) {
      jobs = jobs.filter(j => j.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.type) {
      jobs = jobs.filter(j => j.type === filters.type);
    }
    setFilteredJobs(jobs);
    setViewState({ view: 'HOME' });
  };

  const handleApply = (jobId: string, coverLetter: string) => {
    if (!user) return;
    const app: Application = {
      id: `app-${Date.now()}`,
      jobId,
      seekerId: user.id,
      seekerName: user.name,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      coverLetter
    };
    DB.saveApplication(app);
  };

  // View Router
  const renderView = () => {
    switch (viewState.view) {
      case 'HOME':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16 relative">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight relative z-10">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Next Mission</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto relative z-10 font-light">
                The most advanced portal connecting elite talent with futuristic opportunities.
              </p>
            </div>
            <div className="mb-16 relative z-10">
              <JobFilters onSearch={handleSearch} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setViewState({ view: 'JOB_DETAILS', data: job })} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <div className="text-slate-500 text-lg">No signals detected matching your criteria.</div>
                  <Button variant="ghost" className="mt-4" onClick={() => handleSearch({})}>Reset Scanners</Button>
                </div>
              )}
            </div>
          </div>
        );
      case 'LOGIN':
        return <AuthPage type="LOGIN" onSuccess={handleLogin} onNavigate={(v) => setViewState({ view: v })} />;
      case 'REGISTER':
        return <AuthPage type="REGISTER" onSuccess={handleLogin} onNavigate={(v) => setViewState({ view: v })} />;
      case 'DASHBOARD':
        if (!user) return <AuthPage type="LOGIN" onSuccess={handleLogin} onNavigate={(v) => setViewState({ view: v })} />;
        return user.role === UserRole.EMPLOYER 
          ? <EmployerDashboard user={user} onPostJob={() => setViewState({ view: 'POST_JOB' })} />
          : <SeekerDashboard user={user} />;
      case 'POST_JOB':
        if (!user || user.role !== UserRole.EMPLOYER) return null;
        return <PostJobForm user={user} onCancel={() => setViewState({ view: 'DASHBOARD' })} onSuccess={() => setViewState({ view: 'DASHBOARD' })} />;
      case 'JOB_DETAILS':
        return <JobDetails 
          job={viewState.data} 
          user={user} 
          onBack={() => setViewState({ view: 'HOME' })} 
          onApply={handleApply}
        />;
      case 'PROFILE':
        if (!user) return <AuthPage type="LOGIN" onSuccess={handleLogin} onNavigate={(v) => setViewState({ view: v })} />;
        return <ProfilePage 
          user={user} 
          onBack={() => setViewState({ view: 'HOME' })} 
          onLogout={handleLogout}
          onUpdateUser={(updated) => setUser(updated)} 
        />;
      default:
        return <div>404 View Not Found</div>;
    }
  };

  return (
    <div className="font-sans antialiased pb-20">
      <Navbar user={user} onNavigate={(v) => setViewState({ view: v })} onLogout={handleLogout} />
      <main className="pt-8">
        {renderView()}
      </main>
    </div>
  );
}