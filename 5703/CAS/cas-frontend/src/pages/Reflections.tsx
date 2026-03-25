import React, { useEffect, useState } from 'react';
import { Form, Select, Input, Button, message, Spin, Result, Card, List, Tag } from 'antd';
import { BookOpen, AlertCircle, Clock } from 'lucide-react';
import { studentApi } from '../api/studentApi';

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

    useEffect(() => {
        fetchData();
    }, []);

    const onFinish = async (values: any) => {
        if (!teamId) return;

        setSubmitting(true);
        try {
            await studentApi.submitReflection({
                userId: getUserId(),
                teamId: teamId,
                ...values
            });
            message.success('Weekly reflection submitted successfully!');
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Failed to submit reflection.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    if (!teamId) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center mt-4">
                <Result 
                    icon={<AlertCircle size={64} className="mx-auto text-blue-400 mb-4" />}
                    title="Team Required for Reflections"
                    subTitle="Weekly reflections are tied to your team's progress. Please join or form a team first in the Team Hub."
                />
            </div>
        );
    }

    const dispositionOptions = [
        { label: 'Excellent', value: 'Excellent' },
        { label: 'Good', value: 'Good' },
        { label: 'Fair', value: 'Fair' },
        { label: 'Poor', value: 'Poor' }
    ];

    const getTagColor = (val: string) => {
        if (val === 'Excellent') return 'green';
        if (val === 'Good') return 'blue';
        if (val === 'Fair') return 'orange';
        return 'red';
    };

    return (
        <div className="max-w-6xl mx-auto mt-4 grid md:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-fit">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <BookOpen className="text-[#4CAF50]" /> Submit Reflection
                    </h2>
                    <p className="text-slate-500 mt-2">Log your weekly progress, team health, and personal disposition.</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                    <Form.Item name="weekNumber" label={<span className="font-semibold text-slate-700">Week Number</span>} rules={[{ required: true }]}>
                        <Select size="large" placeholder="Select Week..." options={Array.from({length: 13}, (_, i) => ({label: `Week ${i+1}`, value: i+1}))} />
                    </Form.Item>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="personalDisposition" label={<span className="font-semibold text-slate-700 text-sm">Personal</span>} rules={[{ required: true }]}>
                            <Select placeholder="Rate..." options={dispositionOptions} />
                        </Form.Item>
                        <Form.Item name="teamDisposition" label={<span className="font-semibold text-slate-700 text-sm">Team</span>} rules={[{ required: true }]}>
                            <Select placeholder="Rate..." options={dispositionOptions} />
                        </Form.Item>
                        <Form.Item name="projectDisposition" label={<span className="font-semibold text-slate-700 text-sm">Project</span>} rules={[{ required: true }]}>
                            <Select placeholder="Rate..." options={dispositionOptions} />
                        </Form.Item>
                    </div>

                    <Form.Item name="reflectionDetails" label={<span className="font-semibold text-slate-700">Detailed Reflection (Optional)</span>}>
                        <Input.TextArea placeholder="What went well? What blocked you?" rows={5} className="py-2" />
                    </Form.Item>

                    <Form.Item className="mt-8 mb-0">
                        <Button type="primary" htmlType="submit" loading={submitting} className="w-full h-10 bg-[#4CAF50] hover:bg-[#43a047] font-medium border-0">
                            Post to Team Log
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Right: History Log */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Clock className="text-blue-500" /> Team History Log
                    </h2>
                </div>

                <List
                    className="overflow-y-auto max-h-[600px] pr-2"
                    itemLayout="vertical"
                    dataSource={history}
                    renderItem={(item) => (
                        <Card size="small" className="mb-4 border-slate-200 shadow-sm" title={`Week ${item.weekNumber} Log`}>
                            <div className="flex gap-2 mb-3">
                                <Tag color={getTagColor(item.personalDisposition)}>Personal: {item.personalDisposition}</Tag>
                                <Tag color={getTagColor(item.teamDisposition)}>Team: {item.teamDisposition}</Tag>
                                <Tag color={getTagColor(item.projectDisposition)}>Project: {item.projectDisposition}</Tag>
                            </div>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{item.reflectionDetails || 'No details provided.'}</p>
                            <div className="text-xs text-slate-400 mt-2 text-right">
                                Submitted on: {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </Card>
                    )}
                />
            </div>
        </div>
    );
};

export default Reflections;
