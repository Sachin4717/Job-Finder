import React, {useState} from 'react';
import * as DB from '../mockDb';
import { UserRole } from '../constants';

export default function AuthPage({type, onSuccess, onNavigate}){
  const isLogin = type==='LOGIN';
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [role,setRole]=useState(UserRole.SEEKER);
  const [error,setError]=useState('');

  const handleSubmit=(e)=>{
    e.preventDefault();
    setError('');
    if(isLogin){
      const user = DB.getUsers().find(u=>u.email===email && u.password===password);
      if(user){ DB.setSession(user); onSuccess(user); }
      else setError('Invalid credentials');
    } else {
      if(DB.getUsers().some(u=>u.email===email)){ setError('User exists'); return; }
      const user = { id:`user-${Date.now()}`, name, email, password, role };
      DB.saveUser(user);
      DB.setSession(user);
      onSuccess(user);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-slate-900/60 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">{isLogin? 'Sign In' : 'Sign Up'}</h2>
        {error && <div className="text-red-400 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded-xl bg-slate-800"/>}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-xl bg-slate-800"/>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded-xl bg-slate-800"/>
          {!isLogin && (
            <div className="flex gap-2">
              <button type="button" onClick={()=>setRole(UserRole.SEEKER)} className={`p-2 rounded-xl ${role==='SEEKER'?'bg-violet-600':''}`}>Job Seeker</button>
              <button type="button" onClick={()=>setRole(UserRole.EMPLOYER)} className={`p-2 rounded-xl ${role==='EMPLOYER'?'bg-violet-600':''}`}>Employer</button>
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" className="bg-violet-600 px-4 py-2 rounded-xl text-white">{isLogin?'Sign In':'Create Account'}</button>
            <button type="button" onClick={()=>onNavigate(isLogin? 'REGISTER':'LOGIN')} className="text-sm text-slate-400">Switch</button>
          </div>
        </form>
      </div>
    </div>
  );
}