import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, HeartPulse, UserCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Proposals', path: '/proposals', icon: FileText },
    { name: 'My Team', path: '/team', icon: Users },
    { name: 'Reflections', path: '/reflections', icon: HeartPulse },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar Focus Layer */}
      <aside className="w-72 flex-shrink-0 glass border-r border-slate-700/50 m-4 rounded-3xl flex flex-col justify-between shadow-2xl relative z-20">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/40">
              C
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 tracking-tight">
              CAS Portal
            </h1>
          </div>
          <nav className="space-y-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400 drop-shadow-md' : ''}`} />
                  <span className="font-medium tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-slate-800/70 p-3 -mx-2 rounded-2xl transition-colors">
            <UserCircle className="w-10 h-10 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 tracking-wide">Alex Student</p>
              <p className="text-xs text-slate-500">alex@sydney.edu.au</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-4 pl-0 relative">
        <div className="h-full glass rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl border border-slate-700/30">
          {/* Subtle Dynamic Ambient Lighting Blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none mix-blend-screen"></div>
          
          <div className="relative z-10 flex-1 overflow-y-auto pr-3 custom-scrollbar">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
