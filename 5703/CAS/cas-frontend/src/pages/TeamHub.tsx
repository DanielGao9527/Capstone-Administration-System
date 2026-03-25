import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Form, message, Spin, Tag, Popconfirm } from 'antd';
import { Users, Lock, Unlock, LogOut, ArrowRight, Plus } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const TeamHub = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [team, setTeam] = useState<any>(null);
    
    // Auth context mock
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTeam = async (values: any) => {
        try {
            const res = await studentApi.createTeam({ ...values, isLocked: false });
            await studentApi.joinTeam(res.data.id, getUserId());
            message.success('Team created and joined successfully!');
            fetchData();
        } catch (e: any) {
            message.error('Failed to create team. Letter may already exist.');
        }
    };

    const handleJoinTeam = async (values: any) => {
        try {
            await studentApi.joinTeam(values.teamId, getUserId());
            message.success('Successfully joined the team!');
            fetchData();
        } catch (e) {
            message.error('Failed to join team. Check if ID is correct.');
        }
    };

    const handleLeaveTeam = async () => {
        if (team?.isLocked) {
           message.error("This team is locked by Admin. You cannot leave.");
           return;
        }
        try {
            await studentApi.leaveTeam(team.id, getUserId());
            message.success('Left the team.');
            fetchData();
        } catch (e: any) {
            if (e.response?.status === 403) {
                message.error('Action blocked: Team is locked!');
            } else {
                message.error('Failed to leave team.');
            }
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="max-w-4xl mx-auto mt-4 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Team Hub & Distribution</h2>
                        <p className="text-slate-500 mt-1">Manage your team allocation, or recruit members to join your roster.</p>
                    </div>
                </div>

                {team ? (
                    <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 relative overflow-hidden">
                        {team.isLocked && (
                            <div className="absolute top-0 right-0 bg-red-50 text-red-600 px-4 py-1 flex items-center gap-2 rounded-bl-lg font-medium text-sm border-b border-l border-red-100">
                                <Lock size={14} /> LOCKED BY ADMIN
                            </div>
                        )}
                        {!team.isLocked && (
                            <div className="absolute top-0 right-0 bg-green-50 text-green-600 px-4 py-1 flex items-center gap-2 rounded-bl-lg font-medium text-sm border-b border-l border-green-100">
                                <Unlock size={14} /> SAFE TO LEAVE
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Team {team.teamLetter}</h3>
                        <p className="text-slate-600 mb-4">{team.teamName || 'No descriptive name provided'}</p>
                        
                        <div className="flex gap-4 mb-8">
                            <Tag color="blue" className="px-3 py-1 text-sm">ID: {team.id}</Tag>
                            {team.averageWan && <Tag color="gold" className="px-3 py-1 text-sm">Avg WAN: {team.averageWan}</Tag>}
                            {team.projectAssignedId ? (
                                <Tag color="green" className="px-3 py-1 text-sm">Project Assigned: #{team.projectAssignedId}</Tag>
                            ) : (
                                <Tag color="orange" className="px-3 py-1 text-sm">No Project Assiged</Tag>
                            )}
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <Popconfirm
                                title="Leave Team"
                                description="Are you sure you want to abandon your teammates?"
                                onConfirm={handleLeaveTeam}
                                okText="Yes, Leave"
                                cancelText="Cancel"
                            >
                                <Button 
                                    danger 
                                    size="large" 
                                    icon={<LogOut size={16} />}
                                    disabled={team.isLocked === true}
                                >
                                    Leave Team
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        {/* Join Team Box */}
                        <Card title={<span className="font-semibold text-slate-700 flex items-center gap-2"><ArrowRight size={18} className="text-blue-500"/> Join Existing</span>} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                            <Form layout="vertical" onFinish={handleJoinTeam}>
                                <Form.Item name="teamId" label="Platform Team ID" rules={[{ required: true }]}>
                                    <Input placeholder="Ask your mates for the numeric Team ID" className="py-2" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700">
                                    Send Join Request
                                </Button>
                            </Form>
                        </Card>

                        {/* Create Team Box */}
                        <Card title={<span className="font-semibold text-slate-700 flex items-center gap-2"><Plus size={18} className="text-green-500"/> Establish New</span>} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                            <Form layout="vertical" onFinish={handleCreateTeam}>
                                <Form.Item name="teamLetter" label="Group Letter" rules={[{ required: true }]}>
                                    <Input placeholder="e.g. A, B, Z" className="py-2" maxLength={5} />
                                </Form.Item>
                                <Form.Item name="teamName" label="Team Name (Optional)">
                                    <Input placeholder="e.g. The Codebreakers" className="py-2" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full h-10 bg-green-600 hover:bg-green-700">
                                    Found Team
                                </Button>
                            </Form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamHub;
