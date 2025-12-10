// import React, {useState} from 'react';
// import * as DB from '../mockDb';

// export default function ProfilePage({user, onBack, onLogout, onUpdateUser}){
//   const [bio,setBio]=useState(user.bio || '');
//   const [editing,setEditing]=useState(false);
//   const save = ()=>{
//     DB.updateUser(user.id, { bio });
//     const updated = { ...user, bio };
//     onUpdateUser(updated);
//     setEditing(false);
//   };
//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <button onClick={onBack} className="mb-4">Back</button>
//       <div className="bg-slate-900/60 p-6 rounded-2xl">
//         <h2 className="text-xl font-bold text-white">{user.name}</h2>
//         <p className="text-slate-400">{user.email}</p>
//         {!editing ? <p className="mt-4 text-slate-300">{bio || 'No bio'}</p> : <textarea className="w-full p-3 mt-4" value={bio} onChange={e=>setBio(e.target.value)} />}
//         <div className="mt-4 flex gap-3">
//           {!editing ? <button onClick={()=>setEditing(true)} className="px-3 py-2 bg-violet-600 rounded-xl text-white">Edit</button> : <button onClick={save} className="px-3 py-2 bg-green-600 rounded-xl text-white">Save</button>}
//           <button onClick={()=>{ if(confirm('Delete account?')){ DB.getUsers(); DB.clearSession(); onLogout(); }}} className="px-3 py-2 bg-red-600 rounded-xl text-white">Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ProfilePage({ user, onBack, onLogout, onUpdateUser }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [firstName, setFirstName] = useState(user.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(
    user.name?.split(' ').slice(1).join(' ') || ''
  );
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/profile/me');
        if (res.data) {
          const p = res.data;
          if (p.personal) {
            setFirstName(p.personal.firstName || firstName);
            setLastName(p.personal.lastName || lastName);
            setHeadline(p.personal.headline || '');
            setBio(p.personal.bio || '');
          }
          if (p.contact) {
            setPhone(p.contact.phone || '');
            setEmail(p.contact.email || email);
            setAddress(p.contact.address || '');
            setCity(p.contact.city || '');
            setStateVal(p.contact.state || '');
            setCountry(p.contact.country || '');
            setLinkedin(p.contact.linkedin || '');
            setGithub(p.contact.github || '');
          }
          if (p.resumeUrl) {
            setResumeUrl(p.resumeUrl);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('headline', headline);
      formData.append('bio', bio);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', stateVal);
      formData.append('country', country);
      formData.append('linkedin', linkedin);
      formData.append('github', github);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.post('/api/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedProfile = res.data;
      if (updatedProfile?.user?.name && updatedProfile.user.email) {
        const updatedUser = {
          ...user,
          name: updatedProfile.user.name,
          email: updatedProfile.user.email
        };
        onUpdateUser(updatedUser);
      }

      if (updatedProfile.resumeUrl) {
        setResumeUrl(updatedProfile.resumeUrl);
      }

      setSuccess('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.msg || err.message || 'Failed to update profile';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will log you out.')) return;
    // You can implement real delete endpoint later; for now just logout
    onLogout();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-slate-300">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-4 text-slate-300">
        ← Back
      </button>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-4">My Profile</h1>

        {error && <div className="text-red-400 mb-3">{error}</div>}
        {success && <div className="text-emerald-400 mb-3">{success}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              className="w-full p-3 rounded-xl bg-slate-800 text-slate-100 mt-3"
              placeholder="Headline (e.g. Full Stack Developer)"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <textarea
              className="w-full p-3 rounded-xl bg-slate-800 text-slate-100 mt-3"
              rows={4}
              placeholder="Short bio about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Contact Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="State"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="LinkedIn URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-slate-800 text-slate-100"
                placeholder="GitHub URL"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Resume Upload
            </h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="text-slate-200"
            />
            {resumeUrl && (
              <div className="mt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-400 underline text-sm"
                >
                  View current resume
                </a>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-sm text-red-400"
            >
              Delete Account (log out)
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-600 px-4 py-2 rounded-xl text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
