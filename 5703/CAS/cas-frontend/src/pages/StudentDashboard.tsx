import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, Users, CheckCircle, UploadCloud, Lightbulb } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'Welcome', icon: Send, path: '/student/welcome' },
    { title: 'Project Proposals', icon: FileText, path: '/student/proposals' },
    { title: 'Teams', icon: Users, path: '/student/teams' },
    { title: 'Weekly Reflection', icon: CheckCircle, path: '/student/reflections' },
    { title: 'Project Preferences', icon: UploadCloud, path: '/student/preferences' },
    { title: 'Tips & Tricks', icon: Lightbulb, path: '/student/tips' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center pt-24 px-4 font-sans">
      <div className="text-center mb-16 relative w-full max-w-5xl">
        <h1 className="text-[3.5rem] font-bold text-[#0f172a] mb-2 tracking-tight">Student</h1>
        <p className="text-xl text-[#334155]">Efficient tools for Capstone students</p>
        
        {/* Abstract back button / logout */}
        <button 
          onClick={() => navigate('/login')}
          className="absolute top-2 right-4 w-10 h-10 rounded-full border border-[#7b9af5] text-[#7b9af5] flex items-center justify-center hover:bg-blue-50 transition-colors"
          title="Sign Out"
        >
          <span className="text-xl leading-none">&larr;</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white py-12 px-6 rounded-sm shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center group"
            >
              <Icon 
                strokeWidth={1.5} 
                className="w-16 h-16 text-[#5c6bc0] mb-6 group-hover:scale-[1.05] transition-transform duration-200" 
              />
              <h3 className="text-[1.1rem] text-[#334155]">{card.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
