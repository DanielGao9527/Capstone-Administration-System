package com.usyd.cas.cas_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.usyd.cas.cas_backend.entity.ProjectProposal;

/**
 * 项目提案 Service 接口
 */
public interface ProjectProposalService extends IService<ProjectProposal> {

    /**
     * 分页查询所有已发布的提案 (供学生、Tutor查看)
     */
    Page<ProjectProposal> getPublishedProposals(int page, int size, String keyword);
    
    /**
     * 根据 Sponsor ID 查询该赞助商的所有提案
     */
    Page<ProjectProposal> getProposalsBySponsor(Long sponsorId, int page, int size);
    
    /**
     * 创建新的项目提案，并清理富文本的 XSS 攻击向量
     */
    ProjectProposal createProposal(ProjectProposal proposal);
    
    /**
     * 更新提案状态
     */
    boolean updateProposalStatus(Long proposalId, String status);
}
