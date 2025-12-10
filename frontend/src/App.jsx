import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import EmployerDashboard from './components/EmployerDashboard';
import SeekerDashboard from './components/SeekerDashboard';
import PostJobForm from './components/PostJobForm';
import JobDetails from './components/JobDetails';
import * as DB from './mockDb';

export default function App(){
  const [user,setUser]=useState(null);
  const [view,setView]=useState({view:'HOME', data:null});
  const [jobs,setJobs]=useState([]);
  useEffect(()=>{
    setJobs(DB.getJobs());
    const s = DB.getSession();
    if(s) setUser(s);
  },[]);

  const handleLogin = (u) => { setUser(u); DB.setSession(u); setView({view: 'HOME'}); setJobs(DB.getJobs()); };
  const handleLogout = () => { setUser(null); DB.clearSession(); setView({view:'HOME'}); };

  const handleSearch = (filters)=>{
    let res = DB.getJobs();
    if(filters.keyword) res = res.filter(j=> j.title.toLowerCase().includes(filters.keyword.toLowerCase()) || j.description.toLowerCase().includes(filters.keyword.toLowerCase()));
    if(filters.location) res = res.filter(j=> j.location.toLowerCase().includes(filters.location.toLowerCase()));
    setJobs(res);
    setView({view:'HOME'});
  };

  const handleApply = (jobId, cover) => {
    if(!user) return alert('Login required');
    const job = DB.getJobById(jobId);
    const app = { id:`app-${Date.now()}`, jobId, seekerId:user.id, seekerName:user.name, jobTitle: job.title, status:'Applied', appliedDate: new Date().toISOString(), coverLetter: cover };
    DB.saveApplication(app);
    alert('Application submitted');
  };

  return (
    <div className="font-sans antialiased pb-20">
      <Navbar user={user} onNavigate={(v)=>setView({view:v})} onLogout={handleLogout} />
      <main className="pt-8">
        {view.view==='HOME' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-white">Find Your Next Mission</h1>
              <p className="text-slate-400">Connect with top companies and apply quickly.</p>
            </div>
            <div className="mb-8"><JobFilters onSearch={handleSearch} /></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.length>0? jobs.map(j=>(<JobCard key={j.id} job={j} onClick={()=>setView({view:'JOB_DETAILS', data:j.id})}/>)) : (<div className="col-span-full text-center py-10 bg-slate-900/40 rounded-3xl">No jobs</div>)}
            </div>
          </div>
        )}

        {view.view==='LOGIN' && <AuthPage type="LOGIN" onSuccess={handleLogin} onNavigate={(v)=>setView({view:v})} />}
        {view.view==='REGISTER' && <AuthPage type="REGISTER" onSuccess={handleLogin} onNavigate={(v)=>setView({view:v})} />}
        {view.view==='PROFILE' && user && <ProfilePage user={user} onBack={()=>setView({view:'HOME'})} onLogout={handleLogout} onUpdateUser={(u)=>{setUser(u); DB.setSession(u);}} />}
        {view.view==='DASHBOARD' && user && (user.role==='EMPLOYER' ? <EmployerDashboard user={user} onPostJob={()=>setView({view:'POST_JOB'})} /> : <SeekerDashboard user={user} />)}
        {view.view==='POST_JOB' && user && <PostJobForm user={user} onCancel={()=>setView({view:'DASHBOARD'})} onSuccess={()=>{ setJobs(DB.getJobs()); setView({view:'DASHBOARD'}); }} />}
        {view.view==='JOB_DETAILS' && <JobDetails jobId={view.data} user={user} onBack={()=>setView({view:'HOME'})} />}
      </main>
    </div>
  );
}