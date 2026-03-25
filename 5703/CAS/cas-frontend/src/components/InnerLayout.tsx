import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const InnerLayout = () => {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard', path: '/student' },
    { name: 'My Profile', path: '/student/profile' },
    { name: 'Teams Hub', path: '/student/teams' },
    { name: 'Proposals', path: '/student/proposals' },
    { name: 'Preferences', path: '/student/preferences' },
    { name: 'Reflections', path: '/student/reflections' },
    { name: 'Tips & Tricks', path: '/student/tips' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-[#4CAF50] pt-6 flex flex-col items-center">
        <div className="w-full max-w-6xl px-4">
          <h1 
            className="text-[1.7rem] font-medium text-white mb-6 cursor-pointer tracking-wide"
            onClick={() => navigate('/student')}
          >
            Capstone Administration System
          </h1>
          
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `px-5 py-2.5 text-sm rounded-t-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#4CAF50] font-semibold'
                      : 'text-white hover:bg-[#43a047] font-medium'
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InnerLayout;
