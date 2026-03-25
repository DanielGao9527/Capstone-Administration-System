import React, { useEffect, useState } from 'react';
import { Form, Select, Button, message, Spin, Result } from 'antd';
import { Target, AlertCircle } from 'lucide-react';
import { studentApi } from '../api/studentApi';

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

                // Populate existing preferences if any
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

    useEffect(() => {
        fetchData();
    }, []);

    const onFinish = async (values: any) => {
        if (!teamId) return;
        
        // Ensure no duplicate selections across pref1, pref2, pref3
        const selected = [values.pref1, values.pref2, values.pref3].filter(Boolean);
        const uniqueSelected = new Set(selected);
        if (selected.length !== uniqueSelected.size) {
            message.error("You cannot select the same proposal multiple times!");
            return;
        }

        const payload = [];
        if (values.pref1) payload.push({ projectProposalId: values.pref1, preferenceOrder: 1 });
        if (values.pref2) payload.push({ projectProposalId: values.pref2, preferenceOrder: 2 });
        if (values.pref3) payload.push({ projectProposalId: values.pref3, preferenceOrder: 3 });

        setSubmitting(true);
        try {
            await studentApi.submitPreferences(teamId, payload);
            message.success('Project preferences submitted successfully!');
            fetchData();
        } catch (error) {
            message.error('Failed to submit preferences.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    if (!teamId) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center mt-4">
                <Result 
                    icon={<AlertCircle size={64} className="mx-auto text-orange-400 mb-4" />}
                    title="You Are Not In A Team"
                    subTitle="Project preferences are submitted collectively as a team. Please navigate to the Team Hub and either join an existing team or create a new one to unlock this feature."
                />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Target className="text-[#4CAF50]" /> Submit Team Preferences
                    </h2>
                    <p className="text-slate-500 mt-2">Rank your team's top 3 projects from the published proposals directory.</p>
                </div>

                <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                    <Form.Item name="pref1" label={<span className="font-semibold text-slate-700">1st Preference (Primary)</span>} rules={[{ required: true, message: 'Primary preference is required' }]}>
                        <Select 
                            size="large" 
                            placeholder="Select your top choice..."
                            options={proposals.map(p => ({ label: p.projectName, value: p.id }))}
                        />
                    </Form.Item>

                    <Form.Item name="pref2" label={<span className="font-semibold text-slate-700">2nd Preference</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="Select your backup choice..."
                            options={proposals.map(p => ({ label: p.projectName, value: p.id }))}
                        />
                    </Form.Item>

                    <Form.Item name="pref3" label={<span className="font-semibold text-slate-700">3rd Preference</span>}>
                        <Select 
                            allowClear
                            size="large" 
                            placeholder="Select your last resort choice..."
                            options={proposals.map(p => ({ label: p.projectName, value: p.id }))}
                        />
                    </Form.Item>

                    <Form.Item className="mt-10 mb-0">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={submitting}
                            className="w-full h-12 bg-[#4CAF50] hover:bg-[#43a047] text-lg font-medium rounded-lg border-0"
                        >
                            Confirm Team Preferences
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Preferences;
