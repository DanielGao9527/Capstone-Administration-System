import React from 'react';
import { Database, ShieldCheck, Zap } from 'lucide-react';

const StudentWelcome = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-12 pb-20 fade-in-up">
      <div className="bg-white/5 backdrop-blur-[25px] border border-white/20 rounded-3xl p-12 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] -z-10"></div>

        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 border border-white/20">
            <Zap className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" size={40} />
          </div>
          <h1 className="font-['Syne'] text-4xl md:text-5xl font-bold text-white tracking-[0.2em] uppercase mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Welcome to CAS
          </h1>
          <p className="text-white/60 font-['Inter'] uppercase tracking-[0.2em] text-xs md:text-sm max-w-2xl mx-auto leading-loose">
            You have successfully logged into the Capstone Administration System.
            All student modules and submission portals are fully active.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black/20 border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-all">
            <h3 className="font-['Syne'] text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <ShieldCheck className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" /> Team Registration
            </h3>
            <p className="text-white/60 font-['Inter'] leading-relaxed text-sm">
              Ensure you navigate to the <span className="text-emerald-300 font-bold uppercase tracking-wider mx-1">Team Management</span> hub to verify your current team details. If you have not joined a team, you will be restricted from accessing project preferences.
            </p>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-all">
            <h3 className="font-['Syne'] text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-3">
              <Database className="text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" /> Project Information
            </h3>
            <p className="text-white/60 font-['Inter'] leading-relaxed text-sm">
              Before submitting preferences, thoroughly review the <span className="text-pink-300 font-bold uppercase tracking-wider mx-1">Project Proposals</span> registry. Please consult with your Unit Coordinator regarding project allocation guidelines.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-white/10 pt-8">
          <p className="text-white/40 font-['Inter'] uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Academic portal ready. Access modules via the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentWelcome;
