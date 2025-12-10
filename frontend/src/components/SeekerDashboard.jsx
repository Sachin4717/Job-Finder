import React, {useEffect, useState} from 'react';
import * as DB from '../mockDb';

export default function SeekerDashboard({user}){
  const [apps, setApps]=useState([]);
  useEffect(()=>{
    const all = DB.getApplications().filter(a=>a.seekerId===user.id);
    setApps(all);
  },[user.id]);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">My Applications</h1>
      {apps.length===0 ? <div className="text-slate-400">No applications yet</div> : apps.map(a=>(<div key={a.id} className="p-3 bg-slate-900/60 rounded-2xl mb-3"><b>{a.jobTitle}</b><div className="text-sm text-slate-400">{a.status}</div></div>))}
    </div>
  );
}