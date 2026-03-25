import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message } from 'antd';
import { Search, Download, Filter, Play } from 'lucide-react';
import { studentApi } from '../api/studentApi';

interface Proposal {
  id: number;
  projectName: string;
  background: string;
}

const Proposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await studentApi.getPublishedProposals(1, 100);
        const list = res.data.records || res.data.content || res.data || [];
        setProposals(list);
      } catch (error) {
        message.error("Failed to load global proposals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      render: (text: string) => <span className="text-[#334155]">{text}</span>,
    },
    {
      title: 'Project Background',
      dataIndex: 'background',
      key: 'background',
      width: '60%',
      render: (text: string) => (
        <span className="text-[#475569] text-xs leading-relaxed whitespace-pre-wrap">{text}</span>
      ),
    },
    {
      title: 'View Details',
      key: 'action',
      width: '15%',
      render: () => (
        <a className="flex items-center text-[#4CAF50] hover:text-[#388E3C] text-xs font-semibold">
          <Play fill="currentColor" className="w-3 h-3 mr-1" /> view
        </a>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold text-[#0f172a] mb-5">Project Proposals</h2>
          <p className="text-[#334155] leading-relaxed text-[15px]">
            The <strong>project proposals page</strong> is one of the most vital pages for students to go through at the beginning of the semester. 
            It present students all the important information about the available projects they can choose for their Capstone project - working as a team to vote on what the most suitable projects for their skills/ interest.
            This page also allows students to get to know their sponsor's goals, the context of the project and what success might look like.
          </p>
        </div>
      </div>

      <div className="bg-white border top-0 border-slate-200 mb-8">
        <div className="p-3 border-b border-slate-200 flex items-center space-x-3 bg-white">
          <Input 
            prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />} 
            placeholder="search by keyword" 
            className="w-56 rounded-sm text-sm"
          />
          <Button className="bg-[#e8f5e9] text-[#4CAF50] border-none rounded-sm px-6 hover:bg-[#c8e6c9] font-medium">search</Button>
          
          <div className="flex-1"></div>
          
          <span className="text-xs text-slate-500 mr-2">Showing 1-33 of 33</span>
          <Button size="small" icon={<Download className="w-3 h-3" />} className="text-[11px] text-[#4CAF50] border-slate-200 flex items-center">Export</Button>
          <Button size="small" icon={<Filter className="w-3 h-3" />} className="text-[11px] bg-[#e8f5e9] text-[#4CAF50] border-none flex items-center">Add filters</Button>
        </div>

        <Table 
          dataSource={proposals} 
          columns={columns} 
          rowKey="id"
          pagination={false}
          loading={loading}
          bordered
          size="middle"
        />
      </div>
    </div>
  );
};

export default Proposals;
