package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import com.usyd.cas.cas_backend.service.TipsAndTricksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tips")
public class TipsAndTricksController {

    @Autowired
    private TipsAndTricksService tipsAndTricksService;

    /**
     * 获取全部发布的攻略卡片（供 Student Dashboard 使用）
     */
    @GetMapping
    public ResponseEntity<Page<TipsAndTricks>> getAllTips(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(tipsAndTricksService.getTipsList(page, size, keyword));
    }

    /**
     * 读取特定一条攻略的详细说明全文
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipsAndTricks> getTipById(@PathVariable Long id) {
        TipsAndTricks tip = tipsAndTricksService.getById(id);
        return tip != null ? ResponseEntity.ok(tip) : ResponseEntity.notFound().build();
    }

    /**
     * 发放一篇全域新的指导手册 (Tutor / Admin / Sponsor 权限)
     */
    @PostMapping
    public ResponseEntity<TipsAndTricks> publishTip(@RequestBody TipsAndTricks tip) {
        return ResponseEntity.ok(tipsAndTricksService.createTip(tip));
    }

    /**
     * 删除一篇错误或过时的指导手册
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTip(@PathVariable Long id) {
        boolean removed = tipsAndTricksService.removeById(id);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
