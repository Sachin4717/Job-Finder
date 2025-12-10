import React, {useState} from 'react';
import { Search, MapPin } from 'lucide-react';

export default function JobFilters({onSearch}){
  const [keyword,setKeyword]=useState('');
  const [location,setLocation]=useState('');
  const handleSearch=()=> onSearch({keyword, location});
  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Job title or keywords..." className="pl-10 pr-4 py-3 bg-slate-900 rounded-xl w-full" />
      </div>
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="pl-10 pr-4 py-3 bg-slate-900 rounded-xl w-full" />
      </div>
      <button onClick={handleSearch} className="bg-violet-600 px-4 py-2 rounded-xl text-white">Search</button>
    </div>
  );
}