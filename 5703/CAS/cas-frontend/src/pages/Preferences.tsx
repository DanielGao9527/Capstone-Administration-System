import React, { useEffect, useState } from 'react';
import { Form, Select, Button, message, Spin, Result } from 'antd';
import { Target, AlertCircle, AlertTriangle } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const glassPanel = "bg-white/5 backdrop-blur-[25px] border border-white/20 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 text-white animate-slide-up w-full";
const exportBtn = "bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const Preferences = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [teamId, setTeamId] = useState<number | null>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [form] = Form.useForm();

    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    const fetchData = async () => {
        try {
            const profRes = await studentApi.getProfile(getUserId());
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

    const onFinish = async (values: any) => {
        if (!teamId) return;
        
        const selected = [values.pref1, values.pref2, values.pref3].filter(Boolean);
        const uniqueSelected = new Set(selected);
        if (selected.length !== uniqueSelected.size) {
            message.error("Overlapping targets detected. Diversify directives.");
            return;
        }

        const payload = [];
        if (values.pref1) payload.push({ projectProposalId: values.pref1, preferenceOrder: 1 });
        if (values.pref2) payload.push({ projectProposalId: values.pref2, preferenceOrder: 2 });
        if (values.pref3) payload.push({ projectProposalId: values.pref3, preferenceOrder: 3 });

        setSubmitting(true);
        try {
            await studentApi.submitPreferences(teamId, payload);
            message.success('Target vectors locked successfully!');
            fetchData();
        } catch (error) {
            message.error('Transmission failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    if (!teamId) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-6">
                <div className={`${glassPanel} flex flex-col items-center text-center justify-center p-16`}>
                    <AlertTriangle size={64} className="text-orange-400 mb-6 drop-shadow-[0_0_15px_rgba(251,146,60,0.6)] animate-pulse" />
                    <h2 className="font-['Syne'] text-3xl font-bold text-white uppercase tracking-widest mb-4">Ballot Locked</h2>
                    <p className="text-white/60 font-['Inter'] tracking-wider leading-relaxed max-w-md mx-auto">
                        Target acquisition requires active node operation. Return to Squad Array and establish an uplink first.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-12 px-6">
            <div className={glassPanel}>
                <div className="mb-12 border-b border-white/10 pb-6 text-center">
                    <h2 className="font-['Syne'] text-4xl font-bold text-white tracking-widest uppercase flex items-center justify-center gap-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Target className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" size={40} /> 
                        Operation Ballot
                    </h2>
                    <p className="text-white/50 font-['Inter'] mt-4 uppercase tracking-[0.2em] text-sm">Designate Core Mission Vectors</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false} className="space-y-6">
                    <Form.Item name="pref1" label={<span className="text-emerald-300 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">Primary Coordinate (1st)</span>} rules={[{ required: true, message: 'Primary vector required' }]}>
                        <Select 
                            size="large" 
                            placeholder="AWAITING SELECTION..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item name="pref2" label={<span className="text-emerald-300/80 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">Secondary Coordinate (2nd)</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="AWAITING SELECTION..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item name="pref3" label={<span className="text-emerald-300/60 font-['Syne'] uppercase tracking-[0.15em] font-bold text-sm">Tertiary Coordinate (3rd)</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="AWAITING SELECTION..."
                            options={proposals.map(p => ({ label: `[${p.id}] ${p.projectName}`, value: p.id }))}
                            className="font-['Inter']"
                        />
                    </Form.Item>

                    <Form.Item className="mt-12 mb-0">
                        <button 
                            type="submit" 
                            className={`${exportBtn} !bg-emerald-500/10 !border-emerald-500/40 !text-emerald-300 hover:!bg-emerald-500/20 py-4 text-base`}
                            disabled={submitting}
                        >
                            <Target size={18} /> INITIATE LOCK
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Preferences;
