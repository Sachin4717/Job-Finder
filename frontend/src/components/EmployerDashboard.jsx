import React, {useEffect, useState} from 'react';
import * as DB from '../mockDb';

export default function EmployerDashboard({user, onPostJob}){
  const [jobs, setJobs]=useState([]);
  const [apps, setApps]=useState([]);
  useEffect(()=>{
    const all = DB.getJobs().filter(j=>j.employerId===user.id);
    setJobs(all);
    const allApps = DB.getApplications().filter(a=> all.some(j=>j.id===a.jobId));
    setApps(allApps);
  },[user.id]);
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Employer Dashboard</h1>
        <button onClick={onPostJob} className="bg-violet-600 px-3 py-2 rounded-xl text-white">Post Job</button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/60 p-4 rounded-2xl">
          <h3 className="font-bold text-white mb-3">Your Jobs</h3>
          {jobs.length===0 ? <div className="text-slate-400">No jobs</div> : jobs.map(j=>(<div key={j.id} className="p-3 border rounded-lg mb-2 flex justify-between"><div><b>{j.title}</b><div className="text-sm text-slate-400">{j.companyName}</div></div><button onClick={()=>{ if(confirm('Delete?')){ DB.deleteJob(j.id); setJobs(jobs.filter(x=>x.id!==j.id)); } }} className="text-red-400">Delete</button></div>))}
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl">
          <h3 className="font-bold text-white mb-3">Applications</h3>
          {apps.length===0 ? <div className="text-slate-400">No applications</div> : apps.map(a=>(<div key={a.id} className="p-3 border rounded-lg mb-2"><b>{a.seekerName}</b><div className="text-xs text-slate-400">{a.coverLetter?.slice(0,80)}</div></div>))}
        </div>
      </div>
    </div>
  );
}