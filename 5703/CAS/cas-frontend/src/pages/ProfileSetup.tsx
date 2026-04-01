import { useEffect, useState } from 'react';
import { Form, Input, Spin, Tag, message } from 'antd';
import { User, Mail, Key, Activity, Info } from 'lucide-react';
import { studentApi } from '../api/studentApi';

// 个人资料页面 — 左侧只读信息 + 右侧可编辑表单
const ProfileSetup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await studentApi.getProfile();
                if (res.data) {
                    setProfileData(res.data);
                    form.setFieldsValue({
                        contactEmail: res.data.contactEmail,
                        password: '' // 安全起见密码留空，仅在用户输入时才提交
                    });
                }
            } catch (error: any) {
                message.error('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [form]);

    // 提交更新（仅限联系邮箱和密码）
    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            await studentApi.updateProfile({
                contactEmail: values.contactEmail,
                password: values.password
            });
            message.success('Profile updated successfully.');
            form.setFieldsValue({ password: '' });
        } catch (error) {
            message.error('Failed to update profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="py-20 flex justify-center"><Spin size="large" /></div>;
    }

    if (!profileData) {
        return <div className="py-20 text-center text-white/40">Profile data not available</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-12 px-6 pb-20 fade-in-up">
            <div className="glass-panel">
                {/* 标题 */}
                <div className="border-b border-white/8 pb-8 mb-8 flex items-center gap-4">
                    <User className="text-cyan-400 w-10 h-10" />
                    <div>
                        <h2 className="font-['Syne'] text-4xl font-bold tracking-widest text-[var(--text-primary)] uppercase">
                            Personal Profile
                        </h2>
                        <p className="text-[var(--text-secondary)] font-['Inter'] mt-2 tracking-[0.2em] text-sm uppercase">Manage your security and preferences</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* 只读信息面板 */}
                    <div className="glass-sub-panel space-y-5">
                        <h3 className="text-[var(--text-primary)] font-['Syne'] uppercase tracking-widest font-bold mb-6 flex items-center gap-2 border-b border-white/8 pb-3 text-sm"><Info size={18} className="text-blue-400" /> Identity Information (View Only)</h3>
                        
                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Full Name</label>
                            <div className="text-[var(--text-primary)] font-['Inter'] text-lg mt-1 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">{profileData.fullName || 'N/A'}</div>
                        </div>

                        <div>
                            <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Login Email</label>
                            <div className="text-slate-300 font-['Inter'] mt-1 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">{profileData.email}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Student ID</label>
                                <div className="text-cyan-200/80 font-['Inter'] mt-1 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">{profileData.uosCode || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Degree Type</label>
                                <div className="text-purple-300/80 font-['Inter'] mt-1 bg-white/[0.03] px-4 py-2 rounded-lg border border-white/[0.06]">{profileData.degreeType || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold mb-2 block">System Role</label>
                                <Tag className="bg-blue-500/15 text-blue-300/90 border border-blue-500/20 px-3 py-1 rounded tracking-widest">{profileData.role}</Tag>
                            </div>
                            <div>
                                <label className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold mb-2 block">Account Status</label>
                                {profileData.status === 'Active' ? (
                                    <Tag className="bg-emerald-500/15 text-emerald-300/90 border border-emerald-500/20 px-3 py-1 rounded tracking-widest">ACTIVE</Tag>
                                ) : (
                                    <Tag className="bg-red-500/15 text-red-300/90 border border-red-500/20 px-3 py-1 rounded tracking-widest">INACTIVE</Tag>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 可编辑偏好表单 */}
                    <div className="space-y-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            className="glass-sub-panel h-full flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-[var(--text-primary)] font-['Syne'] uppercase tracking-widest font-bold mb-6 flex items-center gap-2 border-b border-white/8 pb-3 text-sm"><Activity size={18} className="text-pink-400" /> Preferences & Security</h3>
                                
                                <Form.Item 
                                    label={<span className="font-bold text-[var(--text-secondary)] text-xs tracking-widest uppercase flex items-center gap-2"><Mail size={14} className="text-cyan-400" /> Contact Email</span>}
                                    name="contactEmail"
                                    tooltip="Where you prefer to receive notifications. Defaults to your login email."
                                >
                                    <Input placeholder="Enter preferred contact email" className="bg-white/[0.05] border-white/[0.1] text-white hover:border-cyan-400/50 focus:border-cyan-400/50 py-3 rounded-xl placeholder:text-white/20" />
                                </Form.Item>

                                <Form.Item 
                                    label={<span className="font-bold text-[var(--text-secondary)] text-xs tracking-widest uppercase flex items-center gap-2 mt-4"><Key size={14} className="text-amber-400" /> New Password</span>}
                                    name="password"
                                    tooltip="Leave this blank if you do not wish to change your password."
                                >
                                    <Input.Password placeholder="Enter new password (optional)" className="bg-white/[0.05] border-white/[0.1] text-white hover:border-amber-400/50 focus:border-amber-400/50 py-3 rounded-xl [&>input]:bg-transparent [&>input]:text-white placeholder:text-white/20" />
                                </Form.Item>
                            </div>

                            <Form.Item className="mt-8 mb-0">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full export-btn h-14 !bg-cyan-500/10 !border-cyan-500/30 !text-cyan-200 hover:!bg-cyan-500/20 font-['Syne'] tracking-widest font-bold text-base"
                                >
                                    {submitting ? 'SAVING...' : 'UPDATE PREFERENCES'}
                                </button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
