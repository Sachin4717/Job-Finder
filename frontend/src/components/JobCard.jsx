import React from 'react';
import { MapPin, IndianRupee, Building2, ChevronRight } from 'lucide-react';
import Badge from './Badge';

export default function JobCard({job, onClick}){
  return (
    <div onClick={onClick} className="group bg-slate-800/40 rounded-2xl p-6 border border-white/5 cursor-pointer hover:shadow-lg">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{job.title}</h3>
          <p className="text-slate-400">{job.companyName}</p>
        </div>
        <div className="text-right text-slate-400">{new Date(job.postedDate).toLocaleDateString()}</div>
      </div>
      <Badge color="purple">{job.type}</Badge>
      <p className="text-slate-400 mt-4 line-clamp-2">{job.description}</p>
      <div className="flex justify-between items-center mt-4 text-sm text-slate-500">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4" /> {job.location}
          <IndianRupee className="w-4 h-4 ml-4" /> {job.salaryRange}
        </div>
        <ChevronRight className="w-5 h-5 text-violet-400" />
      </div>
    </div>
  );
}