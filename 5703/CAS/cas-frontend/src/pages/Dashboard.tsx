import React from 'react';
import { AlertTriangle, Clock, Activity, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-3 tracking-tight">
          Welcome Back, Alex
        </h2>
        <p className="text-slate-400 text-lg">Here's your Capstone Project overview for 2026 Semester 1.</p>
      </header>

      {/* Security Banner as requested by PRD */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-10 flex items-start space-x-4 backdrop-blur-md shadow-lg shadow-amber-900/10 transition-transform hover:scale-[1.005]">
        <div className="p-2 bg-amber-500/20 rounded-xl flex-shrink-0">
            <AlertTriangle className="text-amber-400 w-6 h-6" />
        </div>
        <div>
          <h4 className="text-amber-400 font-semibold mb-1.5 text-lg">Security Alert: CAS Password</h4>
          <p className="text-amber-200/70 text-sm leading-relaxed">
            Please ensure you have set a unique CAS portal password that is distinct from your institutional USYD Unikey. 
            <a href="#" className="text-amber-400 hover:text-amber-300 hover:underline ml-2 transition-colors font-medium">Go to Account Settings</a>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-400 font-semibold tracking-wide">Team Status</h3>
            <UsersIcon />
          </div>
          <p className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Team Alpha</p>
          <p className="text-sm text-emerald-400 flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Fully Formed</p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-400 font-semibold tracking-wide">Project Allocation</h3>
            <FileTextIcon />
          </div>
          <p className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Fintech AI Model</p>
          <p className="text-sm text-indigo-400 flex items-center font-medium">Sponsor: Atlassian</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-400 font-semibold tracking-wide">Next Reflection</h3>
            <ClockIcon />
          </div>
          <p className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">In 3 Days</p>
          <p className="text-sm text-rose-400 flex items-center font-medium">Week 4 Check-in Due</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-2xl font-bold mb-8 flex items-center tracking-tight text-slate-200">
          <Activity className="w-6 h-6 mr-3 text-blue-400"/> Curriculum Milestones
        </h3>
        <div className="relative border-l-2 border-slate-700/50 ml-4 space-y-10 pb-4">
          <div className="relative">
            <div className="absolute -left-[11px] mt-1.5 w-5 h-5 rounded-full bg-blue-500 ring-4 ring-slate-900 shadow-lg shadow-blue-500/40"></div>
            <div className="pl-8">
              <h4 className="text-xl font-semibold text-slate-200">Team Formation</h4>
              <p className="text-slate-400 text-sm mt-1.5">Submit preferences and finalize members. (Completed)</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[11px] mt-1.5 w-5 h-5 rounded-full bg-indigo-500 ring-4 ring-slate-900 shadow-lg shadow-indigo-500/40 animate-pulse"></div>
            <div className="pl-8">
              <h4 className="text-xl font-semibold text-slate-200">Project Selection</h4>
              <p className="text-slate-400 text-sm mt-1.5">Voting closes at end of Week 3. (In Progress)</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[11px] mt-1.5 w-5 h-5 rounded-full bg-slate-700 ring-4 ring-slate-900"></div>
            <div className="pl-8">
              <h4 className="text-xl font-semibold text-slate-500">First Reflection</h4>
              <p className="text-slate-500 text-sm mt-1.5">Mandatory check-in for mental health monitor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icons
const UsersIcon = () => <div className="p-2.5 bg-blue-500/10 rounded-xl"><CheckCircle2 className="w-6 h-6 text-blue-400" /></div>;
const FileTextIcon = () => <div className="p-2.5 bg-indigo-500/10 rounded-xl"><CheckCircle2 className="w-6 h-6 text-indigo-400" /></div>;
const ClockIcon = () => <div className="p-2.5 bg-rose-500/10 rounded-xl"><Clock className="w-6 h-6 text-rose-400" /></div>;

export default Dashboard;
