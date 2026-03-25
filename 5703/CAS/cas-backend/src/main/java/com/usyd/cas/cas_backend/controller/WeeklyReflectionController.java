package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.usyd.cas.cas_backend.entity.WeeklyReflection;
import com.usyd.cas.cas_backend.service.WeeklyReflectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reflections")
public class WeeklyReflectionController {

    @Autowired
    private WeeklyReflectionService weeklyReflectionService;

    @PostMapping
    public ResponseEntity<WeeklyReflection> submitReflection(@RequestBody WeeklyReflection reflection) {
        return ResponseEntity.ok(weeklyReflectionService.submitReflection(reflection));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<Page<WeeklyReflection>> getReflectionsByTeam(
            @PathVariable Long teamId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(weeklyReflectionService.getReflectionsByTeam(teamId, page, size));
    }

    @GetMapping("/global")
    public ResponseEntity<Page<WeeklyReflection>> getGlobalReflections(
            @RequestParam(defaultValue = "1") int page,
            // 依据TAD设计默认提供25条记录的一拉展示规模
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) String dispositionLevel) {
        return ResponseEntity.ok(weeklyReflectionService.getGlobalReflections(page, size, dispositionLevel));
    }
    @PutMapping("/{id}")
    public ResponseEntity<WeeklyReflection> updateReflection(@PathVariable Long id, @RequestBody WeeklyReflection reflection) {
        reflection.setId(id);
        boolean updated = weeklyReflectionService.updateById(reflection);
        return updated ? ResponseEntity.ok(reflection) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReflection(@PathVariable Long id) {
        boolean removed = weeklyReflectionService.removeById(id);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
