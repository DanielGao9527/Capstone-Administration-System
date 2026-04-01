import React, { useEffect, useState } from 'react';
import { Button, Input, Form, message, Spin, Tag, Popconfirm } from 'antd';
import { Users, Lock, Unlock, LogOut, ArrowRight, Plus } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const glassPanel = "bg-white/5 backdrop-blur-[20px] border border-white/20 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 text-white animate-slide-up w-full overflow-hidden";
const exportBtn = "bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const TeamHub = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [team, setTeam] = useState<any>(null);
    
    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = getUserId();
            const profRes = await studentApi.getProfile(userId);
            const myProfile = profRes.data;
            setProfile(myProfile);

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

    const handleCreateTeam = async (values: any) => {
        try {
            const res = await studentApi.createTeam({ ...values, isLocked: false });
            await studentApi.joinTeam(res.data.id, getUserId());
            message.success('Squad established successfully!');
            fetchData();
        } catch (e: any) {
            message.error('Registration failed. ID might be in use.');
        }
    };

    const handleJoinTeam = async (values: any) => {
        try {
            await studentApi.joinTeam(values.teamId, getUserId());
            message.success('Network linked to Squad!');
            fetchData();
        } catch (e) {
            message.error('Failed to link. Verify access ID.');
        }
    };

    const handleLeaveTeam = async () => {
        if (team?.isLocked) {
           message.error("Squad is under Admin lockdown. Disconnect refused.");
           return;
        }
        try {
            await studentApi.leaveTeam(team.id, getUserId());
            message.success('Disconnected from squad.');
            fetchData();
        } catch (e: any) {
            message.error('Failed to disconnect.');
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="max-w-5xl mx-auto mt-12 space-y-8 px-6">
            <div className={glassPanel}>
                <div className="border-b border-white/10 pb-8 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="font-['Syne'] text-4xl font-bold tracking-widest text-white uppercase flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <Users size={32} className="text-cyan-400" />
                            Squad Array
                        </h2>
                        <p className="text-white/50 font-['Inter'] mt-3 uppercase tracking-[0.2em] text-sm">Synchronize with an operation node</p>
                    </div>
                </div>

                {team ? (
                    <div className="bg-black/20 rounded-2xl p-8 relative overflow-hidden border border-white/10">
                        {team.isLocked ? (
                            <div className="absolute top-0 right-0 bg-red-900/40 text-red-400 px-6 py-2 flex items-center gap-2 rounded-bl-xl font-['Syne'] tracking-widest text-xs font-bold border-b border-l border-red-500/30">
                                <Lock size={14} /> SYSTEM LOCKDOWN
                            </div>
                        ) : (
                            <div className="absolute top-0 right-0 bg-emerald-900/40 text-emerald-400 px-6 py-2 flex items-center gap-2 rounded-bl-xl font-['Syne'] tracking-widest text-xs font-bold border-b border-l border-emerald-500/30">
                                <Unlock size={14} /> FREE TO DISCONNECT
                            </div>
                        )}
                        
                        <h3 className="font-['Syne'] text-3xl font-bold text-white mb-2 uppercase tracking-wide">
                            Node {team.teamLetter}
                        </h3>
                        <p className="text-white/60 font-['Inter'] mb-8 tracking-wider">{team.teamName || 'NO ALIAS GIVEN'}</p>
                        
                        <div className="flex gap-4 mb-10 flex-wrap">
                            <Tag className="px-4 py-2 text-sm bg-white/5 border-white/20 text-white rounded-lg backdrop-blur-sm tracking-widest">ID: {team.id}</Tag>
                            {team.averageWan && <Tag className="px-4 py-2 text-sm bg-purple-500/20 border-purple-400/30 text-purple-200 rounded-lg backdrop-blur-sm tracking-widest">AVG WAN: {team.averageWan}</Tag>}
                            {team.projectAssignedId ? (
                                <Tag className="px-4 py-2 text-sm bg-emerald-500/20 border-emerald-400/30 text-emerald-200 rounded-lg backdrop-blur-sm tracking-widest">DIRECTIVE: #{team.projectAssignedId}</Tag>
                            ) : (
                                <Tag className="px-4 py-2 text-sm bg-orange-500/20 border-orange-400/30 text-orange-200 rounded-lg backdrop-blur-sm tracking-widest">NO DIRECTIVE ASSIGNED</Tag>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-8 mt-4">
                            <Popconfirm
                                title={<span className="text-white">Disconnect from Node?</span>}
                                description={<span className="text-white/70">Connections will be severed permanently.</span>}
                                onConfirm={handleLeaveTeam}
                                okText="Disconnect"
                                cancelText="Cancel"
                            >
                                <button className={`${exportBtn} !bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20 hover:!text-red-300 w-auto px-8`}>
                                    <LogOut size={16} /> SEVER CONNECTION
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Join Sub-panel */}
                        <div className="bg-black/20 p-8 rounded-2xl border border-white/5">
                            <h3 className="font-['Syne'] text-xl mb-6 font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                <ArrowRight className="text-cyan-400"/> Authenticate Node
                            </h3>
                            <Form layout="vertical" onFinish={handleJoinTeam}>
                                <Form.Item name="teamId" label={<span className="text-white/70 font-['Inter'] uppercase tracking-wider text-xs">Access ID</span>} rules={[{ required: true }]}>
                                    <Input placeholder="NUMERIC IDENTIFIER" size="large" />
                                </Form.Item>
                                <button type="submit" className={exportBtn}>
                                    ESTABLISH UPLINK
                                </button>
                            </Form>
                        </div>

                        {/* Create Sub-panel */}
                        <div className="bg-black/20 p-8 rounded-2xl border border-white/5">
                            <h3 className="font-['Syne'] text-xl mb-6 font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                <Plus className="text-emerald-400"/> Register Node
                            </h3>
                            <Form layout="vertical" onFinish={handleCreateTeam}>
                                <Form.Item name="teamLetter" label={<span className="text-white/70 font-['Inter'] uppercase tracking-wider text-xs">Node Alphabet ID</span>} rules={[{ required: true }]}>
                                    <Input placeholder="E.G. A, B, OMEGA" size="large" maxLength={5} />
                                </Form.Item>
                                <Form.Item name="teamName" label={<span className="text-white/70 font-['Inter'] uppercase tracking-wider text-xs">Node Alias (Optional)</span>}>
                                    <Input placeholder="E.G. NEURAL DRIFTERS" size="large" />
                                </Form.Item>
                                <button type="submit" className={`${exportBtn} !border-emerald-500/30 !text-emerald-300 hover:!bg-emerald-500/20`}>
                                    INITIALIZE NODE
                                </button>
                            </Form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamHub;
