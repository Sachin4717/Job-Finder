// frontend/src/App.jsx
console.log("🔥 API URL:", import.meta.env.VITE_API_BASE_URL);

import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import JobCard from "./components/JobCard";
import JobFilters from "./components/JobFilters";
import AuthPage from "./components/AuthPage";
import ProfilePage from "./components/ProfilePage";
import EmployerDashboard from "./components/EmployerDashboard";
import SeekerDashboard from "./components/SeekerDashboard";
import PostJobForm from "./components/PostJobForm";
import JobDetails from "./components/JobDetails";

import * as DB from "./mockDb";
import { getStoredUser, setStoredUser, clearStoredUser } from "./auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState({ view: "HOME", data: null });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setJobs(DB.getJobs());
    const stored = getStoredUser();
    if (stored) setUser(stored);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setStoredUser(loggedInUser);
    setView({ view: "HOME" });
    setJobs(DB.getJobs());
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setView({ view: "HOME" });
  };

  const handleSearch = (filters) => {
    let res = DB.getJobs();

    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      res = res.filter(
        (j) =>
          j.title.toLowerCase().includes(k) ||
          j.description.toLowerCase().includes(k)
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      res = res.filter((j) => j.location.toLowerCase().includes(loc));
    }

    setJobs(res);
    setView({ view: "HOME" });
  };

  const handleApply = (jobId, coverLetter) => {
    if (!user) return alert("Login required");

    const job = DB.getJobById(jobId);
    const app = {
      id: `app-${Date.now()}`,
      jobId,
      seekerId: user.id,
      seekerName: user.name,
      jobTitle: job.title,
      status: "Applied",
      appliedDate: new Date().toISOString(),
      coverLetter,
    };

    DB.saveApplication(app);
    alert("Application submitted");
  };

  const renderView = () => {
    switch (view.view) {
      case "HOME":
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-white">
                Find Your Next Mission
              </h1>
              <p className="text-slate-400">
                Connect with top companies and apply quickly.
              </p>
            </div>

            <div className="mb-8">
              <JobFilters onSearch={handleSearch} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => setView({ view: "JOB_DETAILS", data: job.id })}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-slate-900/40 rounded-3xl">
                  No jobs found.
                </div>
              )}
            </div>
          </div>
        );

      case "LOGIN":
        return (
          <AuthPage
            type="LOGIN"
            onSuccess={handleLogin}
            onNavigate={(v) => setView({ view: v })}
          />
        );

      case "REGISTER":
        return (
          <AuthPage
            type="REGISTER"
            onSuccess={handleLogin}
            onNavigate={(v) => setView({ view: v })}
          />
        );

      case "PROFILE":
        return user ? (
          <ProfilePage
            user={user}
            onBack={() => setView({ view: "HOME" })}
            onLogout={handleLogout}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              setStoredUser(updatedUser);
            }}
          />
        ) : (
          <AuthPage
            type="LOGIN"
            onSuccess={handleLogin}
            onNavigate={(v) => setView({ view: v })}
          />
        );

      case "DASHBOARD":
        if (!user)
          return (
            <AuthPage
              type="LOGIN"
              onSuccess={handleLogin}
              onNavigate={(v) => setView({ view: v })}
            />
          );

        return user.role === "EMPLOYER" ? (
          <EmployerDashboard user={user} onPostJob={() => setView({ view: "POST_JOB" })} />
        ) : (
          <SeekerDashboard user={user} />
        );

      case "POST_JOB":
        return user ? (
          <PostJobForm
            user={user}
            onCancel={() => setView({ view: "DASHBOARD" })}
            onSuccess={() => {
              setJobs(DB.getJobs());
              setView({ view: "DASHBOARD" });
            }}
          />
        ) : null;

      case "JOB_DETAILS":
        return (
          <JobDetails jobId={view.data} user={user} onBack={() => setView({ view: "HOME" })} onApply={handleApply} />
        );

      default:
        return <div className="text-white text-center">Unknown view</div>;
    }
  };

  return (
    <div className="font-sans antialiased pb-20">
      <Navbar user={user} onNavigate={(v) => setView({ view: v })} onLogout={handleLogout} />
      <main className="pt-8">{renderView()}</main>
    </div>
  );
}
