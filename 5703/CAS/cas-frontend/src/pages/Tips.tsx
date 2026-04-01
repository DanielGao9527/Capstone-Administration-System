import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Lightbulb, Database, Hash } from 'lucide-react';
import { studentApi } from '../api/studentApi';

// 玻璃面板样式常量
const glassPanel = "bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-3xl p-8 shadow-[var(--glass-shadow)] relative z-10 text-[var(--text-primary)] animate-slide-up w-full max-w-5xl mx-auto";

const Tips = () => {
    const [loading, setLoading] = useState(true);
    const [tips, setTips] = useState<any[]>([]);

    // 加载技巧数据
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await studentApi.getTips(1, 100);
            const records = res.data.records || res.data.content || res.data || [];
            setTips(records);
        } catch (error) {
            console.error("Failed to extract tactical logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="px-6 mt-8 pb-20">
            <div className={glassPanel}>
                <div className="mb-10 text-center border-b border-white/8 pb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-500/15 rounded-full mb-6 border border-yellow-500/20">
                        <Lightbulb className="text-yellow-400" size={48} />
                    </div>
                    <h2 className="font-['Syne'] text-4xl font-bold text-[var(--text-primary)] tracking-[0.2em] uppercase mb-4">
                        Tactical Data
                    </h2>
                    <p className="text-[var(--text-secondary)] font-['Inter'] uppercase tracking-[0.3em] text-xs">Declassified Operation Guidelines</p>
                </div>

                <div className="space-y-6">
                    {tips.length === 0 ? (
                        <div className="text-center py-16 text-[var(--text-muted)] font-['Inter'] tracking-widest uppercase text-sm bg-black/10 rounded-2xl border border-white/[0.04] flex flex-col items-center">
                            <Database size={48} className="mb-4 opacity-30" />
                            DATABANKS EMPTY
                        </div>
                    ) : tips.map((tip, idx) => (
                        <div key={tip.id} className="glass-sub-panel group relative overflow-hidden hover:bg-white/[0.04] transition-all" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-40 group-hover:opacity-80 transition-opacity"></div>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h3 className="font-['Syne'] text-2xl font-bold text-white/85 tracking-wide flex items-center gap-3">
                                    <Hash size={24} className="text-yellow-500 opacity-50" />
                                    {tip.title}
                                </h3>
                                {tip.tag && (
                                    <span className="px-3 py-1 rounded-md text-[10px] font-['Inter'] font-bold tracking-widest uppercase bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 whitespace-nowrap self-start md:self-auto">
                                        {tip.tag}
                                    </span>
                                )}
                            </div>
                            
                            <div 
                                className="text-[var(--text-secondary)] font-['Inter'] leading-loose prose prose-invert max-w-none prose-p:my-2 prose-a:text-yellow-400 prose-strong:text-white"
                                dangerouslySetInnerHTML={{ __html: tip.content }}
                            />
                            
                            <div className="mt-6 pt-4 border-t border-white/8 flex justify-between items-center text-[10px] text-[var(--text-muted)] font-['Inter'] uppercase tracking-widest">
                                <span>Ref Node: #{tip.id}</span>
                                <span>Uploaded: {new Date(tip.updatedAt || tip.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tips;
