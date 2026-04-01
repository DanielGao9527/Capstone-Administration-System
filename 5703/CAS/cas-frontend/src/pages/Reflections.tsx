import { useEffect, useState } from 'react';
import { Form, Select, Input, message, Spin } from 'antd';
import { BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { studentApi } from '../api/studentApi';
import { SYSTEM_MESSAGES } from '../constants/SystemMessages';

// 玻璃面板样式常量
const glassPanel = "bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-3xl p-8 shadow-[var(--glass-shadow)] relative z-10 text-[var(--text-primary)] animate-slide-up h-fit w-full";
const exportBtn = "bg-white/8 hover:bg-white/15 border border-white/20 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const Reflections = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [teamId, setTeamId] = useState<number | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [form] = Form.useForm();

    // 获取用户 ID（用于提交周报时附带）
    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    // 拉取个人资料和历史周报
    const fetchData = async () => {
        try {
            const profRes = await studentApi.getProfile();
            const myTeamId = profRes.data?.teamId;
            setTeamId(myTeamId);

            if (myTeamId) {
                const histRes = await studentApi.getTeamReflections(myTeamId);
                const records = histRes.data.records || histRes.data.content || histRes.data || [];
                setHistory(records);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 提交本周周报
    const onFinish = async (values: any) => {
        if (!teamId) return;

        setSubmitting(true);
        try {
            await studentApi.submitReflection({
                userId: getUserId(),
                teamId: teamId,
                ...values
            });
            message.success(SYSTEM_MESSAGES.REF_SUBMIT_SUCCESS);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error(SYSTEM_MESSAGES.REF_SUBMIT_FAILED);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    // 无队伍的提示
    if (!teamId) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-6">
                <div className={`${glassPanel} flex flex-col items-center text-center justify-center p-16`}>
                    <AlertTriangle size={64} className="text-pink-500 mb-6 animate-pulse" />
                    <h2 className="font-['Syne'] text-3xl font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">Action Required</h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] tracking-wider leading-relaxed max-w-md mx-auto mb-8">
                        You must be assigned to a team before submitting a weekly reflection. Please navigate to Team Management first.
                    </p>
                </div>
            </div>
        );
    }

    // 周报状态选项
    const dispositionOptions = [
        { label: 'OPTIMAL', value: 'Excellent' },
        { label: 'STABLE', value: 'Good' },
        { label: 'DEGRADED', value: 'Fair' },
        { label: 'CRITICAL', value: 'Poor' }
    ];

    // 根据状态返回对应颜色 class
    const getTagColor = (val: string) => {
        if (val === 'Excellent') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
        if (val === 'Good') return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20';
        if (val === 'Fair') return 'bg-orange-500/15 text-orange-300 border-orange-500/20';
        return 'bg-pink-500/15 text-pink-300 border-pink-500/20';
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 grid md:grid-cols-[1fr_1.2fr] gap-8 px-6">
            {/* 左：提交表单 */}
            <div className={glassPanel}>
                 <div className="mb-8 border-b border-white/8 pb-6">
                    <h2 className="font-['Syne'] text-3xl font-bold text-[var(--text-primary)] tracking-widest uppercase flex items-center gap-3">
                        <BookOpen className="text-pink-500" size={32} /> 
                        Submit Reflection
                    </h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] mt-3 uppercase tracking-[0.2em] text-xs">Record your weekly progress</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false} className="space-y-6">
                    <Form.Item name="weekNumber" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Week Number</span>} rules={[{ required: true }]}>
                        <Select size="large" placeholder="SELECT WEEK..." options={Array.from({length: 13}, (_, i) => ({label: `WEEK 0${i+1}`, value: i+1}))} className="font-['Inter']" />
                    </Form.Item>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="personalDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Personal</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATUS" options={dispositionOptions} className="font-['Inter']" />
                        </Form.Item>
                        <Form.Item name="teamDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Team</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATUS" options={dispositionOptions} className="font-['Inter']"/>
                        </Form.Item>
                        <Form.Item name="projectDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Project</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATUS" options={dispositionOptions} className="font-['Inter']"/>
                        </Form.Item>
                    </div>

                    <Form.Item name="reflectionDetails" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Reflection Details (Optional)</span>}>
                        <Input.TextArea placeholder="Provide detailed reflection notes..." rows={6} className="font-['Inter'] !bg-black/20 !border-white/10 !text-white placeholder:text-white/20" />
                    </Form.Item>

                    <Form.Item className="mt-8 mb-0">
                        <button type="submit" disabled={submitting} className={`${exportBtn} !bg-pink-500/10 !border-pink-500/30 !text-pink-300 hover:!bg-pink-500/20 py-4`}>
                            <BookOpen size={16} /> SUBMIT REFLECTION
                        </button>
                    </Form.Item>
                </Form>
            </div>

            {/* 右：历史记录 */}
            <div className={glassPanel}>
                <div className="mb-8 border-b border-white/8 pb-6">
                    <h2 className="font-['Syne'] text-3xl font-bold text-[var(--text-primary)] tracking-widest uppercase flex items-center gap-3">
                        <Clock className="text-cyan-400" size={32} /> 
                        Reflection History
                    </h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] mt-3 uppercase tracking-[0.2em] text-xs">Past weekly submissions</p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-[var(--text-muted)] font-['Inter'] tracking-widest uppercase text-sm border border-white/[0.04] rounded-xl bg-black/10">
                            NO REFLECTIONS SUBMITTED YET
                        </div>
                    ) : (history.map(item => (
                        <div key={item.id} className="glass-sub-panel transition-all hover:bg-white/[0.04]">
                            <h3 className="font-['Syne'] text-xl font-bold text-white/90 uppercase tracking-widest mb-4">Week 0{item.weekNumber} <span className="text-xs font-normal text-white/30 ml-2">[{new Date(item.createdAt).toLocaleDateString()}]</span></h3>
                            
                            <div className="flex gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.personalDisposition)}`}>PER: {item.personalDisposition}</span>
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.teamDisposition)}`}>TEAM: {item.teamDisposition}</span>
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.projectDisposition)}`}>PROJ: {item.projectDisposition}</span>
                            </div>
                            
                            <p className="text-sm text-[var(--text-secondary)] font-['Inter'] leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-white/8">
                                {item.reflectionDetails || 'No reflection details provided.'}
                            </p>
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default Reflections;
