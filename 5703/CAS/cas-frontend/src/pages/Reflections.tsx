import React, { useEffect, useState } from 'react';
import { Form, Select, Input, message, Spin, Tag } from 'antd';
import { BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const glassPanel = "bg-white/5 backdrop-blur-[20px] border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 text-white animate-slide-up h-fit w-full";
const exportBtn = "bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-3 text-white font-['Syne'] text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const Reflections = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [teamId, setTeamId] = useState<number | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [form] = Form.useForm();

    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    const fetchData = async () => {
        try {
            const userId = getUserId();
            const profRes = await studentApi.getProfile(userId);
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

    const onFinish = async (values: any) => {
        if (!teamId) return;

        setSubmitting(true);
        try {
            await studentApi.submitReflection({
                userId: getUserId(),
                teamId: teamId,
                ...values
            });
            message.success('Telemetry Log transmitted correctly!');
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Transmission failed due to interference.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    if (!teamId) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-6">
                <div className={`${glassPanel} flex flex-col items-center text-center justify-center p-16`}>
                    <AlertTriangle size={64} className="text-pink-500 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-pulse" />
                    <h2 className="font-['Syne'] text-3xl font-bold text-white uppercase tracking-widest mb-4">Transmission Blocked</h2>
                    <p className="text-white/60 font-['Inter'] tracking-wider leading-relaxed max-w-md mx-auto">
                        Telemetry logs require a valid squad operating node. Return to Squad Array first.
                    </p>
                </div>
            </div>
        );
    }

    const dispositionOptions = [
        { label: 'OPIMAL', value: 'Excellent' },
        { label: 'STABLE', value: 'Good' },
        { label: 'DEGRADED', value: 'Fair' },
        { label: 'CRITICAL', value: 'Poor' }
    ];

    const getTagColor = (val: string) => {
        if (val === 'Excellent') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        if (val === 'Good') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
        if (val === 'Fair') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 grid md:grid-cols-[1fr_1.2fr] gap-8 px-6">
            {/* Left: Form */}
            <div className={glassPanel}>
                 <div className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="font-['Syne'] text-3xl font-bold text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <BookOpen className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" size={32} /> 
                        Submit Log
                    </h2>
                    <p className="text-white/50 font-['Inter'] mt-3 uppercase tracking-[0.2em] text-xs">Record temporal anomalies & status</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false} className="space-y-6">
                    <Form.Item name="weekNumber" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Phase Number</span>} rules={[{ required: true }]}>
                        <Select size="large" placeholder="AWAITING SELECTION..." options={Array.from({length: 13}, (_, i) => ({label: `PHASE 0${i+1}`, value: i+1}))} className="font-['Inter']" />
                    </Form.Item>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="personalDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Operator</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATE" options={dispositionOptions} className="font-['Inter']" />
                        </Form.Item>
                        <Form.Item name="teamDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Squad</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATE" options={dispositionOptions} className="font-['Inter']"/>
                        </Form.Item>
                        <Form.Item name="projectDisposition" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Directive</span>} rules={[{ required: true }]}>
                            <Select placeholder="STATE" options={dispositionOptions} className="font-['Inter']"/>
                        </Form.Item>
                    </div>

                    <Form.Item name="reflectionDetails" label={<span className="text-white/70 font-['Syne'] uppercase tracking-[0.15em] font-bold text-xs">Operation Details (Optional Telemetry)</span>}>
                        <Input.TextArea placeholder="LOG ARCHIVE DETAILS..." rows={6} className="font-['Inter'] !bg-black/20 !border-white/20 !text-white placeholder:text-white/30" />
                    </Form.Item>

                    <Form.Item className="mt-8 mb-0">
                        <button type="submit" disabled={submitting} className={`${exportBtn} !bg-pink-500/10 !border-pink-500/40 !text-pink-300 hover:!bg-pink-500/20 py-4`}>
                            <BookOpen size={16} /> TRANSMIT RECORD
                        </button>
                    </Form.Item>
                </Form>
            </div>

            {/* Right: History Log */}
            <div className={glassPanel}>
                <div className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="font-['Syne'] text-3xl font-bold text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Clock className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" size={32} /> 
                        Operation Archive
                    </h2>
                    <p className="text-white/50 font-['Inter'] mt-3 uppercase tracking-[0.2em] text-xs">Past telemetry transmissions</p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-white/40 font-['Inter'] tracking-widest uppercase text-sm border border-white/5 rounded-xl bg-black/10">
                            NO ARCHIVES DETECTED IN DATABANK
                        </div>
                    ) : (history.map(item => (
                        <div key={item.id} className="bg-black/20 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/5">
                            <h3 className="font-['Syne'] text-xl font-bold text-white/90 uppercase tracking-widest mb-4">Phase 0{item.weekNumber} <span className="text-xs font-normal text-white/30 ml-2">[{new Date(item.createdAt).toLocaleDateString()}]</span></h3>
                            
                            <div className="flex gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.personalDisposition)}`}>OP: {item.personalDisposition}</span>
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.teamDisposition)}`}>SQ: {item.teamDisposition}</span>
                                <span className={`px-3 py-1 rounded-md text-xs font-['Inter'] font-bold tracking-widest uppercase border ${getTagColor(item.projectDisposition)}`}>DR: {item.projectDisposition}</span>
                            </div>
                            
                            <p className="text-sm text-white/60 font-['Inter'] leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-white/10">
                                {item.reflectionDetails || 'NO SECONDARY TELEMETRY PROVIDED.'}
                            </p>
                        </div>
                    )))}
                </div>
            </div>
        </div>
    );
};

export default Reflections;
