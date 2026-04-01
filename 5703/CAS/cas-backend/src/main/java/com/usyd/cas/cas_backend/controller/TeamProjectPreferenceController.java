package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.usyd.cas.cas_backend.entity.TeamProjectPreference;
import com.usyd.cas.cas_backend.service.TeamProjectPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/api/v1/preferences")
public class TeamProjectPreferenceController {

    @Autowired
    private TeamProjectPreferenceService preferenceService;

    @Autowired
    private com.usyd.cas.cas_backend.service.TeamService teamService;

    /**
     * 为指定队伍投递多个优先级的项目志愿
     */
    @PostMapping("/team/{teamId}")
    public ResponseEntity<?> submitPreferences(
            @PathVariable Long teamId,
            @RequestParam Long operatorId,
            @RequestBody List<TeamProjectPreference> preferences) {

        com.usyd.cas.cas_backend.entity.Team team = teamService.getById(teamId);
        if (team == null) {
            return ResponseEntity.notFound().build();
        }

        // --- 核心业务断言：仅队伍联络人 (Point of Contact) 有权提交偏好志愿 ---
        if (team.getPointOfContactId() == null || !team.getPointOfContactId().equals(operatorId)) {
            return ResponseEntity.status(403).body("403 Forbidden: You are not the designated point of contact for this team. Voting is disabled.");
        }
            
        // 抹除旧的志愿清单
        preferenceService.remove(new QueryWrapper<TeamProjectPreference>().eq("team_id", teamId));
        
        // 循环插入带有 UTC 时间戳的重构志愿池
        preferences.forEach(pref -> {
            pref.setTeamId(teamId);
            pref.setStatus("Pending");
            pref.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        });
        
        preferenceService.saveBatch(preferences);
        return ResponseEntity.ok(preferences);
    }

    /**
     * 获取指定团队的所有被投递志愿
     */
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamProjectPreference>> getTeamPreferences(@PathVariable Long teamId) {
        List<TeamProjectPreference> preferences = preferenceService.list(
                new QueryWrapper<TeamProjectPreference>()
                        .eq("team_id", teamId)
                        .orderByAsc("preference_order")
        );
        return ResponseEntity.ok(preferences);
    }
}
