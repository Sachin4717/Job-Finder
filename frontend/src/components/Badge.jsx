import React from 'react';
const colorMap = {
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
};
export default function Badge({children, color='blue'}){
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorMap[color]||colorMap.blue}`}>{children}</span>
}