import React, {useState} from 'react';
import * as DB from '../mockDb';
import { generateJobDescription } from '../services/ai';

export default function PostJobForm({user, onCancel, onSuccess}){
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [location,setLocation]=useState('');
  const [salary,setSalary]=useState('');
  const [type,setType]=useState('Full-time');
  const [keywords,setKeywords]=useState('');

  const handleGenerate = async ()=>{
    if(!title) return alert('Enter title');
    const desc = await generateJobDescription(title, keywords);
    setDescription(desc);
  };

  const submit = (e)=>{
    e.preventDefault();
    const job = { id:`job-${Date.now()}`, employerId:user.id, companyName:user.companyName||user.name, title, description, location, salaryRange:salary, type, postedDate:new Date().toISOString(), requirements:[] };
    DB.saveJob(job);
    onSuccess && onSuccess();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold text-white mb-4">Post a Job</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Job title" className="w-full p-3 rounded-xl bg-slate-800"/>
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full p-3 rounded-xl bg-slate-800"/>
        <input value={salary} onChange={e=>setSalary(e.target.value)} placeholder="Salary" className="w-full p-3 rounded-xl bg-slate-800"/>
        <input value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="Keywords" className="w-full p-3 rounded-xl bg-slate-800"/>
        <div className="flex gap-3">
          <button type="button" onClick={handleGenerate} className="bg-indigo-600 px-3 py-2 rounded-xl text-white">AI Generate</button>
          <button type="submit" className="bg-violet-600 px-3 py-2 rounded-xl text-white">Post</button>
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded-xl">Cancel</button>
        </div>
      </form>
    </div>
  );
}