import React, { useEffect, useState } from 'react';
import { Card, Spin, message, Tag } from 'antd';
import { Lightbulb } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const Tips = () => {
    const [tips, setTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const res = await studentApi.getTips(1, 50);
                const records = res.data.records || res.data.content || res.data || [];
                setTips(records);
            } catch (error) {
                message.error('Failed to load tips.');
            } finally {
                setLoading(false);
            }
        };
        fetchTips();
    }, []);

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="max-w-5xl mx-auto mt-4">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-yellow-50 text-yellow-500 rounded-lg">
                    <Lightbulb size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Tips & Tricks</h2>
                    <p className="text-slate-500 mt-1">Valuable insights, guides, and wisdom compiled by Unit Coordinators and Tutors.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tips.map(tip => (
                    <Card key={tip.id} hoverable className="shadow-sm border-slate-200 flex flex-col h-full rounded-xl overflow-hidden">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{tip.title}</h3>
                            </div>
                            {tip.tag && <Tag color="blue" className="mb-4">{tip.tag}</Tag>}
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{tip.content}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                            Posted: {new Date(tip.createdAt).toLocaleDateString()}
                        </div>
                    </Card>
                ))}
                
                {tips.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                        No tips have been published yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tips;
