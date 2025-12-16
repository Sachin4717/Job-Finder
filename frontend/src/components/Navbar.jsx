import React from 'react';
import { Briefcase, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Button = ({ children, onClick, className = '', title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`px-4 py-2 rounded-xl font-semibold ${className}`}
  >
    {children}
  </button>
);

export default function Navbar({ user, onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      
      {/*  Centered content */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate('HOME')}
        >
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2 rounded-lg mr-3">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Job Hut</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                onClick={() => onNavigate('DASHBOARD')}
                className="text-slate-200 hover:text-white"
                title="Dashboard"
              >
                <LayoutDashboard />
              </Button>

              <div className="flex items-center gap-3">
                <div
                  onClick={() => onNavigate('PROFILE')}
                  className="p-2 bg-slate-800 rounded-full cursor-pointer"
                >
                  <UserIcon className="w-5 h-5 text-violet-400" />
                </div>

                <div className="text-sm text-right">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.role}</div>
                </div>

                <Button
                  onClick={onLogout}
                  className="bg-red-600 text-white hover:bg-red-700"
                  title="Logout"
                >
                  <LogOut />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={() => onNavigate('LOGIN')}
                className="text-slate-200 hover:text-white"
              >
                Log In
              </Button>
              <Button
                onClick={() => onNavigate('REGISTER')}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}
