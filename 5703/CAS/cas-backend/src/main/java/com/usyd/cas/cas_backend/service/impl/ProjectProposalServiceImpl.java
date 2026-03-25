package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.ProjectProposal;
import com.usyd.cas.cas_backend.mapper.ProjectProposalMapper;
import com.usyd.cas.cas_backend.service.ProjectProposalService;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * 项目提案 Service 实现类
 */
@Service
public class ProjectProposalServiceImpl extends ServiceImpl<ProjectProposalMapper, ProjectProposal> implements ProjectProposalService {

    @Override
    public Page<ProjectProposal> getPublishedProposals(int page, int size, String keyword) {
        Page<ProjectProposal> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ProjectProposal> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ProjectProposal::getStatus, "Published");
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper
                    .like(ProjectProposal::getProjectName, keyword)
                    .or()
                    .like(ProjectProposal::getSponsorDetails, keyword));
        }
        queryWrapper.orderByDesc(ProjectProposal::getCreatedAt);
        return this.page(pageParam, queryWrapper);
    }

    @Override
    public Page<ProjectProposal> getProposalsBySponsor(Long sponsorId, int page, int size) {
        Page<ProjectProposal> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ProjectProposal> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ProjectProposal::getSponsorId, sponsorId);
        queryWrapper.orderByDesc(ProjectProposal::getCreatedAt);
        return this.page(pageParam, queryWrapper);
    }

    @Override
    public ProjectProposal createProposal(ProjectProposal proposal) {
        // 使用 Jsoup 净化富文本字段，防止 XSS 攻击
        if (proposal.getBackground() != null) {
            proposal.setBackground(Jsoup.clean(proposal.getBackground(), Safelist.relaxed()));
        }
        if (proposal.getObjectives() != null) {
            proposal.setObjectives(Jsoup.clean(proposal.getObjectives(), Safelist.relaxed()));
        }
        
        // 设置默认状态和时间 (UTC)
        proposal.setStatus("Draft");
        LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);
        proposal.setCreatedAt(nowUtc);
        proposal.setUpdatedAt(nowUtc);
        
        this.save(proposal);
        return proposal;
    }

    @Override
    public boolean updateProposalStatus(Long proposalId, String status) {
        ProjectProposal proposal = this.getById(proposalId);
        if (proposal != null) {
            proposal.setStatus(status);
            proposal.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            return this.updateById(proposal);
        }
        return false;
    }
}
