import { useNavigate } from 'react-router-dom';
import { Send, FileText, Users, CheckCircle, FilePlus, Lightbulb } from 'lucide-react';

// Dashboard 卡片样式 — 使用 CSS 变量实现夜间模式联动
const glassPanel = "group bg-[var(--glass-bg)] hover:bg-[var(--glass-hover-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] hover:border-[var(--glass-hover-border)] rounded-3xl p-8 shadow-[var(--glass-shadow)] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-6 animate-slide-up h-64";
const iconStyle = "text-white/70 group-hover:text-cyan-400 group-hover:scale-110 transition-transform duration-500";
const titleStyle = "font-['Syne'] text-2xl font-bold text-[var(--text-primary)] tracking-widest uppercase text-center group-hover:text-cyan-100 transition-colors";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 h-full min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="font-['Syne'] text-5xl md:text-7xl font-bold text-[var(--text-primary)] tracking-widest uppercase mb-4">
          Operations
        </h1>
        <p className="text-[var(--text-secondary)] font-['Inter'] tracking-[0.2em] uppercase text-sm md:text-base">
          Efficient tools for Capstone Operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <div className={glassPanel} onClick={() => navigate('/student/welcome')} style={{ animationDelay: '0.1s' }}>
          <Send size={56} className={`${iconStyle} group-hover:text-blue-400`} />
          <h2 className={`${titleStyle} group-hover:text-blue-100`}>Welcome</h2>
        </div>
        
        <div className={glassPanel} onClick={() => navigate('/student/proposals')} style={{ animationDelay: '0.2s' }}>
          <FileText size={56} className={`${iconStyle} group-hover:text-pink-400`} />
          <h2 className={`${titleStyle} group-hover:text-pink-100`}>Project Proposals</h2>
        </div>

        <div className={glassPanel} onClick={() => navigate('/student/teams')} style={{ animationDelay: '0.3s' }}>
          <Users size={56} className={`${iconStyle} group-hover:text-emerald-400`} />
          <h2 className={`${titleStyle} group-hover:text-emerald-100`}>Teams</h2>
        </div>

        <div className={glassPanel} onClick={() => navigate('/student/reflections')} style={{ animationDelay: '0.4s' }}>
          <CheckCircle size={56} className={`${iconStyle} group-hover:text-purple-400`} />
          <h2 className={`${titleStyle} group-hover:text-purple-100`}>Weekly Reflection</h2>
        </div>

        <div className={glassPanel} onClick={() => navigate('/student/preferences')} style={{ animationDelay: '0.5s' }}>
          <FilePlus size={56} className={`${iconStyle} group-hover:text-orange-400`} />
          <h2 className={`${titleStyle} group-hover:text-orange-100`}>Submit a Project Proposal</h2>
        </div>

        <div className={glassPanel} onClick={() => navigate('/student/tips')} style={{ animationDelay: '0.6s' }}>
          <Lightbulb size={56} className={`${iconStyle} group-hover:text-yellow-400`} />
          <h2 className={`${titleStyle} group-hover:text-yellow-100`}>Tips & Tricks</h2>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
