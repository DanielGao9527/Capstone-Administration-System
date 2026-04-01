import { useEffect, useState } from 'react';
import { message, Spin, Tag, Popconfirm } from 'antd';
import { Users, Lock, Unlock, LogOut, ShieldCheck, Mail, AlertCircle, Briefcase, Clock, CheckCircle, UserCircle, Target, Activity } from 'lucide-react';
import { studentApi } from '../api/studentApi';
import { SYSTEM_MESSAGES } from '../constants/SystemMessages';

// 玻璃面板样式常量
const glassPanel = "bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-3xl p-10 shadow-[var(--glass-shadow)] relative z-10 text-[var(--text-primary)] animate-slide-up w-full overflow-hidden";
const exportBtn = "bg-white/8 hover:bg-white/15 border border-white/20 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const TeamHub = () => {
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<any>(null);
    
    // 获取用户 ID（离队接口需要）
    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    // 拉取队伍数据
    const fetchData = async () => {
        setLoading(true);
        try {
            const profRes = await studentApi.getProfile();
            const myProfile = profRes.data;

            if (myProfile && myProfile.teamId) {
                const teamRes = await studentApi.getTeamDetails(myProfile.teamId);
                setTeam(teamRes.data);
            } else {
                setTeam(null);
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 解析团队模式为可读标签
    const parseMode = (modeRaw: string) => {
        if (!modeRaw) return { text: 'UNSPECIFIED', color: 'bg-white/8 border-white/15 text-white/70' };
        const mode = modeRaw.toLowerCase();
        if (mode.includes('cc') || mode.includes('campus normal') || mode.includes('in-person')) {
            return { text: 'ON-CAMPUS (IN-PERSON)', color: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-300' };
        }
        if (mode.includes('mixed') || mode.includes('hybrid')) {
            return { text: 'HYBRID', color: 'bg-orange-500/15 border-orange-500/20 text-orange-300' };
        }
        if (mode.includes('remote') || mode.includes('online')) {
            return { text: 'FULLY REMOTE', color: 'bg-cyan-500/15 border-cyan-500/20 text-cyan-300' };
        }
        return { text: modeRaw.toUpperCase(), color: 'bg-white/8 border-white/15 text-white/70' };
    };

    // 离队操作
    const handleLeaveTeam = async () => {
        if (team?.isLocked) {
           message.error(SYSTEM_MESSAGES.TEAM_LOCKED);
           return;
        }
        try {
            await studentApi.leaveTeam(team.id, getUserId());
            message.success(SYSTEM_MESSAGES.TEAM_LEAVE_SUCCESS);
            fetchData();
        } catch (e: any) {
            message.error(SYSTEM_MESSAGES.TEAM_LEAVE_FAILED);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="max-w-6xl mx-auto mt-12 space-y-8 px-6 pb-20 fade-in-up">
            <div className={glassPanel}>
                <div className="border-b border-white/8 pb-8 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="font-['Syne'] text-4xl font-bold tracking-widest text-[var(--text-primary)] uppercase flex items-center gap-3">
                            <Users size={32} className="text-cyan-400" />
                            Team Management
                        </h2>
                        <p className="text-[var(--text-secondary)] font-['Inter'] mt-3 uppercase tracking-[0.2em] text-sm">Review your team allocation and status</p>
                    </div>
                </div>

                {team ? (
                    <div className="space-y-8 animate-slide-up">
                        {/* 顶栏基础信息卡 */}
                        <div className="glass-sub-panel relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6">
                            {team.isLocked ? (
                                <div className="absolute top-0 right-0 bg-red-900/30 text-red-400 px-6 py-2 flex items-center gap-2 rounded-bl-xl font-['Syne'] tracking-widest text-xs font-bold border-b border-l border-red-500/20">
                                    <Lock size={14} /> TEAM LOCKED
                                </div>
                            ) : (
                                <div className="absolute top-0 right-0 bg-emerald-900/30 text-emerald-400 px-6 py-2 flex items-center gap-2 rounded-bl-xl font-['Syne'] tracking-widest text-xs font-bold border-b border-l border-emerald-500/20">
                                    <Unlock size={14} /> UNLOCKED
                                </div>
                            )}
                            
                            <div>
                                <h3 className="font-['Syne'] text-4xl font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wider flex items-center gap-4">
                                    Team {team.teamLetter}
                                    {team.mode && (
                                        <span className={`text-xs px-3 py-1 mt-1 rounded-md border tracking-[0.2em] font-bold ${parseMode(team.mode).color}`}>
                                            {parseMode(team.mode).text}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-[var(--text-secondary)] font-['Inter'] tracking-wider">{team.teamName || 'No Team Name Assigned'}</p>
                            </div>
                            
                            <div className="flex gap-3 flex-wrap">
                                <Tag className="px-4 py-2 text-sm bg-white/[0.03] border-white/10 text-white rounded-lg backdrop-blur-sm tracking-widest flex items-center gap-2">
                                    <Activity size={14}/> ID: {team.id}
                                </Tag>
                                <Tag className="px-4 py-2 text-sm bg-indigo-500/15 border-indigo-500/20 text-indigo-300 rounded-lg backdrop-blur-sm tracking-widest flex items-center gap-2">
                                    <Users size={14}/> SIZE: {team.teamSize || (team.members ? team.members.length : '?')}
                                </Tag>
                                {team.projectAssignedId ? (
                                    <Tag className="px-4 py-2 text-sm bg-emerald-500/15 border-emerald-400/20 text-emerald-200 rounded-lg backdrop-blur-sm tracking-widest flex items-center gap-2">
                                        <Briefcase size={14}/> PROJECT: #{team.projectAssignedId}
                                    </Tag>
                                ) : (
                                    <Tag className="px-4 py-2 text-sm bg-orange-500/15 border-orange-400/20 text-orange-200 rounded-lg backdrop-blur-sm tracking-widest flex items-center gap-2">
                                        <AlertCircle size={14}/> NO PROJECT
                                    </Tag>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
                            {/* 左侧：教务/运行状态面板 */}
                            <div className="glass-sub-panel space-y-6 flex flex-col">
                                <h4 className="font-['Syne'] text-xl font-bold text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-2 border-b border-white/8 pb-4">
                                    <Activity size={20} className="text-pink-400" /> Metrics & Operation
                                </h4>
                                
                                <div className="space-y-5 flex-1 p-2">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><Mail className="text-cyan-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">POC Email</div>
                                            <div className="text-sm text-cyan-200/80 font-['Inter']">{team.pocEmail || 'Not configured'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><UserCircle className="text-purple-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">Coordinator / Instructor</div>
                                            <div className="text-sm text-purple-200/80 font-['Inter']">{team.instructorOne || 'Pending Allocation'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><Clock className="text-amber-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">Team Meeting Time</div>
                                            <div className="text-sm text-white/80 font-['Inter']">{team.teamMeeting || 'Not defined'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><Briefcase className="text-emerald-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">Project Acceptance</div>
                                            <div className="text-sm text-emerald-300/80 font-['Inter']">{team.projectAcceptance || 'Pending Evaluation'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><AlertCircle className="text-orange-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">Current Issue</div>
                                            <div className="text-sm text-orange-200/80 font-['Inter']">{team.currentIssue || 'No active blockages'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06]"><CheckCircle className="text-green-400" size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-bold">Team Status</div>
                                            <div className="text-sm text-green-300/80 font-['Inter']">{team.teamStatus || 'Operational'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/8 pt-6 mt-6">
                                    <Popconfirm
                                        title={<span className="text-white">Leave Team?</span>}
                                        description={<span className="text-white/70">Your academic progression might be affected.</span>}
                                        onConfirm={handleLeaveTeam}
                                        okText="Confirm"
                                        cancelText="Cancel"
                                    >
                                        <button className={`${exportBtn} !bg-red-500/10 !border-red-500/20 !text-red-400 hover:!bg-red-500/15 hover:!text-red-300 w-full`}>
                                            <LogOut size={16} /> SIGNAL LEAVE TEAM
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>

                            {/* 右侧：成员名录 */}
                            <div className="glass-sub-panel flex flex-col">
                                <h4 className="font-['Syne'] text-xl font-bold text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3 border-b border-white/8 pb-4 mb-6">
                                    <Users size={20} className="text-blue-400" /> Member Roster
                                </h4>
                                
                                <div className="grid gap-4 flex-1 content-start">
                                    {team.members && team.members.length > 0 ? (
                                        team.members.map((member: any) => (
                                            <div key={member.userId} className="flex flex-col xl:flex-row xl:items-center justify-between p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
                                                <div className="flex items-center gap-5 mb-4 xl:mb-0">
                                                    <div className="w-12 h-12 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-300 font-bold font-['Syne'] text-xl">
                                                        {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-[var(--text-primary)] font-['Inter'] text-lg font-bold tracking-wide">{member.fullName || 'Unknown Student'}</div>
                                                        <div className="text-[var(--text-secondary)] text-xs font-['Inter'] flex items-center gap-2 mt-1 uppercase tracking-widest">
                                                            <Target size={12} className="text-pink-400"/> SID: {member.uosCode || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-left xl:text-right w-full xl:w-auto mt-2 xl:mt-0">
                                                    <a href={`mailto:${member.email}`} className="text-cyan-300/80 hover:text-cyan-100 text-[11px] font-['Inter'] bg-cyan-500/8 hover:bg-cyan-500/15 px-4 py-2 rounded-lg border border-cyan-500/15 transition-all font-bold tracking-widest inline-flex items-center gap-2 w-full xl:w-auto justify-center">
                                                        <Mail size={12}/> {member.email || 'NO CONTACT GIVEN'}
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[var(--text-muted)] text-center py-12 font-['Inter'] text-sm tracking-widest uppercase border border-dashed border-white/10 rounded-xl bg-black/20">
                                            No Members Registered In This Unit
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // 无队伍占位屏
                    <div className="py-16 flex flex-col items-center justify-center text-center animate-slide-up">
                        <div className="w-28 h-28 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/15 relative">
                            <ShieldCheck size={56} className="text-cyan-400" />
                            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-50"></div>
                        </div>
                        <h3 className="font-['Syne'] text-4xl font-bold text-[var(--text-primary)] mb-6 uppercase tracking-[0.15em]">Awaiting Coordinator Assignment</h3>
                        <p className="text-[var(--text-secondary)] font-['Inter'] max-w-xl mx-auto leading-loose mb-12 text-sm tracking-wide">
                            You are not currently allocated to any project team. Your Unit Coordinator will formally assign you to a team based on your placement survey and academic standing. Please ensure your survey is submitted.
                        </p>
                        
                        <div className="glass-sub-panel w-full max-w-md">
                            <h4 className="text-[var(--text-secondary)] font-['Syne'] font-bold tracking-[0.2em] uppercase text-xs mb-6">Required Academic Action</h4>
                            <button className={`${exportBtn} !bg-pink-500/15 !border-pink-500/30 !text-pink-200 hover:!bg-pink-500/20 py-4`}>
                                TAKE PLACEMENT SURVEY
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamHub;
