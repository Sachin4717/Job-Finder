
// import React, { useState } from 'react';
// import api from '../api';
// import { setStoredUser } from '../auth';
// import { UserRole } from '../constants';

// export default function AuthPage({ type, onSuccess, onNavigate }) {
//   const isLogin = type === 'LOGIN';
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [role, setRole] = useState(UserRole.SEEKER);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       if (isLogin) {
//         const res = await api.post('/api/auth/login', { email, password });
//         const { token, user } = res.data;
//         setStoredUser(user, token);
//         onSuccess(user);
//       } else {
//         const res = await api.post("/api/auth/register", {
//           name,
//           email,
//           password,
//           role,
//         });
//         const { token, user } = res.data;
//         setStoredUser(user, token);
//         onSuccess(user);
//       }
//     } catch (err) {
//       const msg =
//         err.response?.data?.msg || err.message || 'Something went wrong';
//       setError(msg);
//     }
//   };

//   return (
//     <div className="min-h-[60vh] flex items-center justify-center">
//       <div className="bg-slate-900/60 p-8 rounded-2xl w-full max-w-md">
//         <h2 className="text-2xl font-bold text-white mb-4">
//           {isLogin ? 'Sign In' : 'Sign Up'}
//         </h2>
//         {error && <div className="text-red-400 mb-3">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Full name"
//               className="w-full p-3 rounded-xl bg-slate-800"
//               required
//             />
//           )}
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             type="email"
//             className="w-full p-3 rounded-xl bg-slate-800"
//             required
//           />
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             type="password"
//             className="w-full p-3 rounded-xl bg-slate-800"
//             required
//           />

//           {!isLogin && (
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => setRole(UserRole.SEEKER)}
//                 className={`p-2 rounded-xl flex-1 ${
//                   role === UserRole.SEEKER ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'
//                 }`}
//               >
//                 Job Seeker
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setRole(UserRole.EMPLOYER)}
//                 className={`p-2 rounded-xl flex-1 ${
//                   role === UserRole.EMPLOYER ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'
//                 }`}
//               >
//                 Employer
//               </button>
//             </div>
//           )}

//           <div className="flex gap-3 items-center justify-between">
//             <button
//               type="submit"
//               className="bg-violet-600 px-4 py-2 rounded-xl text-white"
//             >
//               {isLogin ? 'Sign In' : 'Create Account'}
//             </button>
//             <button
//               type="button"
//               onClick={() => onNavigate(isLogin ? 'REGISTER' : 'LOGIN')}
//               className="text-sm text-slate-400"
//             >
//               {isLogin ? 'Create new account' : 'Already have an account?'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import api from '../api';
import { setStoredUser } from '../auth';
import { UserRole } from '../constants';

export default function AuthPage({ type, onSuccess, onNavigate }) {
  const isLogin = type === 'LOGIN';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(UserRole.SEEKER);
  const [error, setError] = useState('');

  // -----------------------------
  //   HANDLE LOGIN / REGISTER
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;

      if (isLogin) {
        // LOGIN CALL
        response = await api.post('/api/auth/login', {
          email,
          password,
        });
      } else {
        // REGISTER CALL
        response = await api.post('/api/auth/register', {
          name,
          email,
          password,
          role,
        });
      }

      const { token, user } = response.data;

      // SAVE LOGIN INFO
      localStorage.setItem('authToken', token);
      setStoredUser(user, token);

      onSuccess(user); // pass user back to App.jsx

    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.message ||
        'Something went wrong';
      setError(msg);
    }
  };

  // -----------------------------
  //   UI
  // -----------------------------
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-slate-900/60 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-300 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 rounded-xl bg-slate-800 text-white"
              required
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
            required
          />

          {!isLogin && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole(UserRole.SEEKER)}
                className={`p-2 rounded-xl flex-1 ${
                  role === UserRole.SEEKER
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Job Seeker
              </button>

              <button
                type="button"
                onClick={() => setRole(UserRole.EMPLOYER)}
                className={`p-2 rounded-xl flex-1 ${
                  role === UserRole.EMPLOYER
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Employer
              </button>
            </div>
          )}

          <div className="flex gap-3 items-center justify-between">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-white transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate(isLogin ? 'REGISTER' : 'LOGIN')}
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
