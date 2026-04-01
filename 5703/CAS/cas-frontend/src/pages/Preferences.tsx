import { useEffect, useState } from 'react';
import { Form, Select, message, Spin } from 'antd';
import { Target, AlertTriangle } from 'lucide-react';
import { studentApi } from '../api/studentApi';
import { SYSTEM_MESSAGES } from '../constants/SystemMessages';

// 玻璃面板样式常量 — 使用 CSS 变量联动夜间模式
const glassPanel = "bg-[var(--glass-bg)] backdrop-blur-[25px] border border-[var(--glass-border)] rounded-3xl p-10 shadow-[var(--glass-shadow)] relative z-10 text-[var(--text-primary)] animate-slide-up w-full";
const exportBtn = "bg-white/8 hover:bg-white/15 border border-white/20 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const Preferences = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [teamId, setTeamId] = useState<number | null>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [form] = Form.useForm();

    // 获取个人资料和项目列表
    const fetchData = async () => {
        try {
            const profRes = await studentApi.getProfile();
            const myTeamId = profRes.data?.teamId;
            setTeamId(myTeamId);

            if (myTeamId) {
                const [propRes, prefRes] = await Promise.all([
                    studentApi.getPublishedProposals(1, 100),
                    studentApi.getTeamPreferences(myTeamId)
                ]);
                const projectList = propRes.data.records || propRes.data.content || propRes.data || [];
                setProposals(projectList);

                const existingPrefs = prefRes.data;
                if (existingPrefs && existingPrefs.length > 0) {
                    const mappedValues: any = {};
                    existingPrefs.forEach((p: any) => {
                        mappedValues[`pref${p.preferenceOrder}`] = p.projectProposalId;
                    });
                    form.setFieldsValue(mappedValues);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 提交志愿（校验重复选择）
    const onFinish = async (values: any) => {
        if (!teamId) return;
        
        const selected = [values.pref1, values.pref2, values.pref3].filter(Boolean);
        const uniqueSelected = new Set(selected);
        if (selected.length !== uniqueSelected.size) {
            message.error(SYSTEM_MESSAGES.PREF_OVERLAP_ERROR);
            return;
        }

        const payload = [];
        if (values.pref1) payload.push({ projectProposalId: values.pref1, preferenceOrder: 1 });
        if (values.pref2) payload.push({ projectProposalId: values.pref2, preferenceOrder: 2 });
        if (values.pref3) payload.push({ projectProposalId: values.pref3, preferenceOrder: 3 });

        setSubmitting(true);
        try {
            await studentApi.submitPreferences(teamId, payload);
            message.success(SYSTEM_MESSAGES.PREF_SUBMIT_SUCCESS);
            fetchData();
        } catch (error) {
            message.error(SYSTEM_MESSAGES.PREF_SUBMIT_FAILED);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    // 无队伍时的提示
    if (!teamId) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-6">
                <div className={`${glassPanel} flex flex-col items-center text-center justify-center p-16`}>
                    <AlertTriangle size={64} className="text-orange-400 mb-6 animate-pulse" />
                    <h2 className="font-['Syne'] text-3xl font-bold text-[var(--text-primary)] uppercase tracking-widest mb-4">Action Required</h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] tracking-wider leading-relaxed max-w-md mx-auto mb-8">
                        You must be assigned to a team before submitting project preferences. Please navigate to Team Management first.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-12 px-6">
            <div className={glassPanel}>
                <div className="mb-12 border-b border-white/8 pb-6 text-center">
                    <h2 className="font-['Syne'] text-4xl font-bold text-[var(--text-primary)] tracking-widest uppercase flex items-center justify-center gap-4">
                        <Target className="text-emerald-400" size={40} /> 
                        Project Preferences
                    </h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] mt-4 uppercase tracking-[0.2em] text-sm">Select your team's preferred projects</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false} className="space-y-6">
                    <Form.Item name="pref1" label={<span className="text-emerald-300 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">First Preference</span>} rules={[{ required: true, message: 'First preference is required' }]}>
                        <Select 
                            size="large" 
                            placeholder="SELECT A PROJECT..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item name="pref2" label={<span className="text-emerald-300/80 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">Second Preference</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="SELECT A PROJECT..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item name="pref3" label={<span className="text-emerald-300/60 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">Third Preference</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="SELECT A PROJECT..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item className="mt-12 mb-0">
                        <button 
                            type="submit" 
                            className={`${exportBtn} !bg-emerald-500/10 !border-emerald-500/30 !text-emerald-300 hover:!bg-emerald-500/20 py-4 text-base`}
                            disabled={submitting}
                        >
                            <Target size={18} /> SUBMIT PREFERENCES
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Preferences;
