import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, InputNumber, message, Spin, Result } from 'antd';
import { studentApi } from '../api/studentApi';
import { BookOpen, MapPin, Award } from 'lucide-react';

const ProfileSetup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // In a real app with AuthContext, you'd get this from the JWT state.
    // Assuming for local logic that student ID is stored in localStorage or hardcoded to 1 for dummy tests.
    // For CAS, we will parse from token or dummy logic
    const getUserId = () => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored) : 1; 
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await studentApi.getProfile(getUserId());
                if(res.data) {
                    form.setFieldsValue({
                        uosCode: res.data.uosCode,
                        deliveryMode: res.data.deliveryMode || 'In-person',
                        wan: res.data.wan
                    });
                }
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    message.error('Failed to load profile data.');
                }
                // 404 just means profile not created yet, safe to ignore.
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [form]);

    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            await studentApi.updateProfile({
                userId: getUserId(),
                ...values
            });
            message.success('Academic profile updated successfully!');
        } catch (error) {
            message.error('Failed to update profile.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="py-20 text-center"><Spin size="large" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-8 border-b border-slate-100 pb-5">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Academic Profile</h2>
                    <p className="text-slate-500 mt-1">Please ensure your marks and mode of delivery are up to date for precise team allocation.</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark="optional"
                    className="mt-6"
                >
                    <Form.Item 
                        label={<span className="font-medium text-slate-700 flex items-center gap-2"><BookOpen size={16} className="text-[#4CAF50]"/> UoS Code / Student ID</span>}
                        name="uosCode"
                        rules={[{ required: true, message: 'Please enter your unique student UoS Code' }]}
                    >
                        <Input placeholder="e.g. 510123456" className="py-2.5 rounded-lg" />
                    </Form.Item>

                    <Form.Item 
                        label={<span className="font-medium text-slate-700 flex items-center gap-2"><MapPin size={16} className="text-[#4CAF50]" /> Enrollment Mode</span>}
                        name="deliveryMode"
                        rules={[{ required: true }]}
                        initialValue="In-person"
                    >
                        <Radio.Group className="w-full grid grid-cols-2 gap-4">
                            <Radio.Button value="In-person" className="h-12 flex items-center justify-center text-base rounded-lg cursor-pointer">In-person</Radio.Button>
                            <Radio.Button value="Online" className="h-12 flex items-center justify-center text-base rounded-lg cursor-pointer">Online</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item 
                        label={<span className="font-medium text-slate-700 flex items-center gap-2"><Award size={16} className="text-[#4CAF50]" /> Weighted Average Mark (WAN)</span>}
                        name="wan"
                        tooltip="Your verified academic WAN out of 100"
                        rules={[{ required: true, message: 'WAN is required for team balancing' }]}
                    >
                        <InputNumber min={0} max={100} precision={2} placeholder="e.g. 75.50" className="w-full py-1.5 rounded-lg" />
                    </Form.Item>

                    <Form.Item className="mt-10 mb-0">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={submitting}
                            className="w-full h-12 bg-[#4CAF50] hover:bg-[#43a047] text-lg font-medium rounded-lg shadow-sm border-0"
                        >
                            Save Academic Profile
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ProfileSetup;
