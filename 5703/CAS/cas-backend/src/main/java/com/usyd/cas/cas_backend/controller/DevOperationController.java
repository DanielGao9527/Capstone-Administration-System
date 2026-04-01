package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.service.StudentProfileService;
import com.usyd.cas.cas_backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 黑客超调接口 (Developer Override Controller)
 * 警告：该端点受到 @Profile("dev") 的极高严格保护。
 * 在 application-prod.yml（生产环境）被激活时，该控制器将彻底从 Spring 容器自动剥离，直接报 404！
 */
@RestController
@RequestMapping("/api/v1/dev")
@Profile("dev") 
public class DevOperationController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private StudentProfileService studentProfileService;

    @PostMapping("/force-match-team/{userId}")
    public ResponseEntity<Map<String, Object>> forceMatchDevTeam(@PathVariable Long userId) {
        // 1. 判断是否存在 999 号幽灵小队
        Team devTeam = teamService.getById(999L);
        if (devTeam == null) {
            devTeam = new Team();
            devTeam.setId(999L);
            devTeam.setTeamLetter("DEV");
            devTeam.setTeamName("SHADOW_SQUAD_999");
            devTeam.setMode("mixed Online");
            devTeam.setPocEmail("poc@test.sydney.edu.au");
            devTeam.setTeamSize(5);
            devTeam.setCurrentIssue("Integration testing blocked by proxy");
            devTeam.setTeamMeeting("Friday 10:00 AM UTC");
            devTeam.setInstructorOne("Dr. Alan");
            devTeam.setProjectAcceptance("Approved");
            devTeam.setTeamStatus("Active");
            teamService.save(devTeam);
        }

        // 2. 将当前遭遇死锁的学生强制入编该分队
        StudentProfile profile = studentProfileService.getById(userId);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUserId(userId);
        }
        profile.setTeamId(999L);
        studentProfileService.saveOrUpdate(profile);

        return ResponseEntity.ok(Map.of(
            "status", "OVERRIDE_SUCCESS",
            "message", "Entity FORCE-GRAFTED to SHADOW_SQUAD_999."
        ));
    }
}
