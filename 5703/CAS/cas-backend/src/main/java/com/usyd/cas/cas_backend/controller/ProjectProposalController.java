package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.usyd.cas.cas_backend.entity.ProjectProposal;
import com.usyd.cas.cas_backend.service.ProjectProposalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 项目提案 (Project Proposal) 控制器
 */
@RestController
@RequestMapping("/api/v1/proposals")
public class ProjectProposalController {

    @Autowired
    private ProjectProposalService projectProposalService;

    /**
     * 获取已发布的提案列表 (支持分页和关键字搜索)
     */
    @GetMapping("/published")
    public ResponseEntity<Page<ProjectProposal>> getPublishedProposals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(projectProposalService.getPublishedProposals(page, size, keyword));
    }

    /**
     * 获取赞助商自己的提案列表
     */
    @GetMapping("/sponsor/{sponsorId}")
    public ResponseEntity<Page<ProjectProposal>> getProposalsBySponsor(
            @PathVariable Long sponsorId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        // TODO: 可在此处从 SecurityContext 中验证当前登录用户是否为该 sponsorId
        return ResponseEntity.ok(projectProposalService.getProposalsBySponsor(sponsorId, page, size));
    }

    /**
     * 提交新提案
     */
    @PostMapping
    public ResponseEntity<ProjectProposal> createProposal(@RequestBody ProjectProposal proposal) {
        // TODO: 可在此处直接从 SecurityContext 中获取当前用户的 ID 作为 sponsorId
        return ResponseEntity.ok(projectProposalService.createProposal(proposal));
    }

    /**
     * 获取单个提案的详细信息
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectProposal> getProposal(@PathVariable Long id) {
        ProjectProposal proposal = projectProposalService.getById(id);
        if (proposal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(proposal);
    }

    /**
     * 更新提案状态
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateProposalStatus(@PathVariable Long id, @RequestParam String status) {
        boolean updated = projectProposalService.updateProposalStatus(id, status);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
    /**
     * 更新或编辑提案的全量内容
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectProposal> updateProposal(@PathVariable Long id, @RequestBody ProjectProposal proposal) {
        proposal.setId(id);
        boolean updated = projectProposalService.updateById(proposal);
        return updated ? ResponseEntity.ok(proposal) : ResponseEntity.notFound().build();
    }

    /**
     * 物理删除无用的或已过期的项目提案
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProposal(@PathVariable Long id) {
        boolean removed = projectProposalService.removeById(id);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
