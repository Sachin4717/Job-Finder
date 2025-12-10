import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = (window as any).__API_BASE__ || 'http://localhost:5000';

export default function ProfileForm(){
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({headline:'', bio:'', phone:'', address:'', skills:'', company:'', website:''});
  const [resumeFile, setResumeFile] = useState<File|null>(null);
  const [message, setMessage] = useState('');

  async function loginDemo(){
    try{
      const res = await axios.post(API + '/api/auth/register', { name:'Demo User', email:'demo'+Date.now()+'@example.com', password:'password123', role:'applicant' });
      setToken(res.data.token);
      setMessage('Registered and logged in as demo');
    }catch(err:any){
      if(err.response && err.response.data && err.response.data.msg){
        setMessage('Error: ' + err.response.data.msg);
      } else setMessage('Error registering: '+err.message);
    }
  }

  async function loadProfile(){
    if(!token){ setMessage('No token'); return; }
    try{
      const res = await axios.get(API + '/api/profiles/me', { headers: { Authorization: 'Bearer ' + token } });
      setUser(res.data);
      setForm({
        headline: res.data.headline || '',
        bio: res.data.bio || '',
        phone: res.data.contact?.phone || '',
        address: res.data.contact?.address || '',
        skills: (res.data.skills||[]).join(', '),
        company: res.data.company||'',
        website: res.data.website||''
      });
      setMessage('Loaded profile');
    }catch(err:any){
      setMessage('No profile yet or error: ' + (err.response?.data?.msg || err.message));
    }
  }

  async function saveProfile(e:React.FormEvent){
    e.preventDefault();
    if(!token){ setMessage('No token'); return; }
    try{
      const fd = new FormData();
      fd.append('headline', form.headline);
      fd.append('bio', form.bio);
      fd.append('phone', form.phone);
      fd.append('address', form.address);
      fd.append('skills', form.skills);
      fd.append('company', form.company);
      fd.append('website', form.website);
      if(resumeFile) fd.append('resume', resumeFile);
      const res = await axios.post(API + '/api/profiles', fd, { headers: { Authorization: 'Bearer ' + token, 'Content-Type':'multipart/form-data' } });
      setUser(res.data);
      setMessage('Profile saved');
    }catch(err:any){
      setMessage('Error saving: ' + (err.response?.data?.msg || err.message));
    }
  }

  return (
    <div style={{maxWidth:720}}>
      <div style={{marginBottom:12}}><button onClick={loginDemo}>Create Demo Account & Login</button> <button onClick={loadProfile}>Load Profile</button></div>
      <div style={{marginBottom:12}}>Token: <input style={{width:'70%'}} value={token} onChange={e=>setToken(e.target.value)} placeholder="Paste token here"/></div>
      <form onSubmit={saveProfile}>
        <div><label>Headline</label><br/><input value={form.headline} onChange={e=>setForm({...form, headline:e.target.value})} /></div>
        <div><label>Bio</label><br/><textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} /></div>
        <div><label>Phone</label><br/><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /></div>
        <div><label>Address</label><br/><input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /></div>
        <div><label>Skills (comma separated)</label><br/><input value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} /></div>
        <div><label>Company (for employers)</label><br/><input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} /></div>
        <div><label>Website</label><br/><input value={form.website} onChange={e=>setForm({...form, website:e.target.value})} /></div>
        <div><label>Resume (PDF)</label><br/><input type="file" accept=".pdf,.doc,.docx" onChange={e=>setResumeFile(e.target.files?.[0]||null)} /></div>
        <div style={{marginTop:10}}><button type="submit">Save Profile</button></div>
      </form>
      <div style={{marginTop:12,color:'green'}}>{message}</div>
      <div style={{marginTop:20}}>{user && (<div><h3>Saved Profile</h3><pre>{JSON.stringify(user,null,2)}</pre></div>)}</div>
    </div>
  );
}
