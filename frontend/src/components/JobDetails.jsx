import React, {useState, useEffect} from 'react';
import * as DB from '../mockDb';

export default function JobDetails({jobId, user, onBack}){
  const [job,setJob]=useState(null);
  const [cover,setCover]=useState('');
  const [showApply,setShowApply]=useState(false);
  useEffect(()=>{ setJob(DB.getJobById(jobId)); }, [jobId]);
  const submitApp = ()=>{
    if(!user) return alert('Login required');
    const app = { id:`app-${Date.now()}`, jobId, seekerId:user.id, seekerName:user.name, jobTitle:job.title, status:'Applied', appliedDate:new Date().toISOString(), coverLetter:cover };
    DB.saveApplication(app);
    alert('Applied');
    setShowApply(false);
  };
  if(!job) return <div className="p-4">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={onBack} className="mb-4">Back</button>
      <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
      <div className="text-slate-400 mb-4">{job.companyName} • {job.location}</div>
      <div className="bg-slate-900/60 p-4 rounded-2xl mb-4">{job.description}</div>
      {!showApply ? <button onClick={()=>setShowApply(true)} className="bg-violet-600 px-3 py-2 rounded-xl text-white">Apply</button> : (
        <div className="space-y-3">
          <textarea value={cover} onChange={e=>setCover(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800" placeholder="Cover letter"></textarea>
          <div className="flex gap-3">
            <button onClick={submitApp} className="bg-green-600 px-3 py-2 rounded-xl text-white">Submit</button>
            <button onClick={()=>setShowApply(false)} className="px-3 py-2 rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}