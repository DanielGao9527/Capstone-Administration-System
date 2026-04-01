import React, { useEffect, useState } from 'react';
import { Spin, Tag } from 'antd';
import { Database, FileText, Globe, Target, UserCheck } from 'lucide-react';
import { studentApi } from '../api/studentApi';

const glassPanel = "bg-white/5 backdrop-blur-[20px] border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative z-10 text-white animate-slide-up h-fit w-full";
const glassCard = "bg-black/20 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/5 cursor-pointer hover:border-white/30";

const Proposals = () => {
    const [loading, setLoading] = useState(true);
    const [proposals, setProposals] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await studentApi.getPublishedProposals(1, 100);
            const records = res.data.records || res.data.content || res.data || [];
            setProposals(records);
            if (records.length > 0) setSelected(records[0]);
        } catch (error) {
            console.error("Failed to sequence proposals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <div className="py-20 text-center"><Spin size="large" /></div>;

    return (
        <div className="max-w-[90rem] mx-auto mt-8 grid lg:grid-cols-[1fr_1.5fr] gap-8 px-6 pb-20">
            {/* Left: Project List */}
            <div className={`${glassPanel} flex flex-col h-[calc(100vh-140px)]`}>
                <div className="mb-6 border-b border-white/10 pb-6 flex-shrink-0">
                    <h2 className="font-['Syne'] text-3xl font-bold text-white tracking-widest uppercase flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Database className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" size={32} /> 
                        Proposals
                    </h2>
                    <p className="text-white/50 font-['Inter'] mt-3 uppercase tracking-[0.2em] text-xs">Available Directives Archive</p>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {proposals.length === 0 ? (
                        <div className="text-center py-10 text-white/40 font-['Inter'] tracking-widest uppercase text-sm border border-white/5 rounded-xl bg-black/10">
                            NO DIRECTIVES DETECTED IN MAINFRAME
                        </div>
                    ) : proposals.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelected(item)}
                            className={`${glassCard} ${selected?.id === item.id ? '!bg-pink-500/10 !border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.1)]' : ''}`}
                        >
                            <h3 className="font-['Syne'] text-lg font-bold text-white/90 uppercase tracking-wide mb-2 line-clamp-2 leading-tight">
                                {item.projectName}
                            </h3>
                            <div className="flex gap-2 mb-3 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-['Inter'] font-bold tracking-widest uppercase bg-white/10 text-white/70 border border-white/20`}>{item.sponsorDetails || 'INTERNAL'}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-['Inter'] font-bold tracking-widest uppercase ${item.status === 'Allocated' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                                    {item.status || 'PUBLISHED'}
                                </span>
                            </div>
                            <p className="text-xs text-white/50 font-['Inter'] line-clamp-2 leading-relaxed">
                                {item.background?.replace(/<[^>]*>?/gm, '') || 'NO BACKGROUND DATA PROVIDED.'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Proposal Details */}
            <div className={`${glassPanel} overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar`}>
                 {selected ? (
                     <div className="animate-slide-up">
                         <div className="mb-8 border-b border-white/10 pb-6">
                            <h2 className="font-['Syne'] text-4xl font-bold text-white tracking-widest uppercase leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
                                {selected.projectName}
                            </h2>
                            <div className="flex gap-3 flex-wrap items-center">
                                <Tag className="!bg-pink-500/20 !text-pink-300 !border-pink-500/30 font-['Inter'] uppercase tracking-widest py-1 px-3 m-0">
                                    REF: #{selected.id}
                                </Tag>
                                <Tag className="!bg-cyan-500/20 !text-cyan-300 !border-cyan-500/30 font-['Inter'] uppercase tracking-widest py-1 px-3 m-0">
                                    {selected.sponsorDetails || 'UNKNOWN SPONSOR'}
                                </Tag>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-black/20 rounded-xl p-5 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                <div className="flex items-center gap-2 mb-3 text-white/50 uppercase tracking-[0.15em] text-xs font-bold">
                                    <Target size={14} className="text-emerald-400" /> Criticality
                                </div>
                                <div className="font-['Syne'] text-white text-lg">{selected.criticality || 'STANDARD'}</div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-5 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                <div className="flex items-center gap-2 mb-3 text-white/50 uppercase tracking-[0.15em] text-xs font-bold">
                                    <UserCheck size={14} className="text-orange-400" /> Skills Required
                                </div>
                                <div className="font-['Syne'] text-white text-lg">{selected.skillsRequired || 'ANY'}</div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="flex items-center gap-3 font-['Syne'] text-xl font-bold text-white/80 uppercase tracking-widest mb-4 border-l-2 border-pink-500 pl-4">
                                    Background
                                </h3>
                                <div 
                                    className="text-white/70 font-['Inter'] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selected.background || 'NO DATA' }}
                                />
                            </section>

                            <section>
                                <h3 className="flex items-center gap-3 font-['Syne'] text-xl font-bold text-white/80 uppercase tracking-widest mb-4 border-l-2 border-cyan-500 pl-4">
                                    Objectives
                                </h3>
                                <div 
                                    className="text-white/70 font-['Inter'] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selected.objectives || 'NO DATA' }}
                                />
                            </section>

                            {(selected.reportingFrequency || selected.meetingFrequency) && (
                                <section>
                                    <h3 className="flex items-center gap-3 font-['Syne'] text-xl font-bold text-white/80 uppercase tracking-widest mb-4 border-l-2 border-purple-500 pl-4">
                                        Logistics
                                    </h3>
                                    <ul className="list-disc list-inside text-white/70 font-['Inter'] space-y-2">
                                        {selected.reportingFrequency && <li><strong>Report:</strong> {selected.reportingFrequency}</li>}
                                        {selected.meetingFrequency && <li><strong>Meeting:</strong> {selected.meetingFrequency}</li>}
                                    </ul>
                                </section>
                            )}

                            {selected.externalLink && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <a 
                                        href={selected.externalLink.startsWith('http') ? selected.externalLink : `https://${selected.externalLink}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg px-6 py-3 text-white font-['Syne'] text-sm font-bold tracking-wide uppercase transition-all"
                                    >
                                        <Globe size={16} /> Access External Mainframe
                                    </a>
                                </div>
                            )}
                        </div>
                     </div>
                 ) : (
                     <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                         <FileText size={64} className="opacity-20" />
                         <p className="font-['Syne'] uppercase tracking-[0.2em]">Select a directive to expand data</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default Proposals;
