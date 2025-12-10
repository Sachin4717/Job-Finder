import React, {useState} from 'react';
import * as DB from '../mockDb';

export default function ProfilePage({user, onBack, onLogout, onUpdateUser}){
  const [bio,setBio]=useState(user.bio || '');
  const [editing,setEditing]=useState(false);
  const save = ()=>{
    DB.updateUser(user.id, { bio });
    const updated = { ...user, bio };
    onUpdateUser(updated);
    setEditing(false);
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      <button onClick={onBack} className="mb-4">Back</button>
      <div className="bg-slate-900/60 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-slate-400">{user.email}</p>
        {!editing ? <p className="mt-4 text-slate-300">{bio || 'No bio'}</p> : <textarea className="w-full p-3 mt-4" value={bio} onChange={e=>setBio(e.target.value)} />}
        <div className="mt-4 flex gap-3">
          {!editing ? <button onClick={()=>setEditing(true)} className="px-3 py-2 bg-violet-600 rounded-xl text-white">Edit</button> : <button onClick={save} className="px-3 py-2 bg-green-600 rounded-xl text-white">Save</button>}
          <button onClick={()=>{ if(confirm('Delete account?')){ DB.getUsers(); DB.clearSession(); onLogout(); }}} className="px-3 py-2 bg-red-600 rounded-xl text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}