package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.entity.dto.TeamWithMembersDTO;
import com.usyd.cas.cas_backend.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private com.usyd.cas.cas_backend.service.StudentProfileService studentProfileService;

    /**
     * 获取指定队伍的详细信息（包含队伍成员）
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeamWithMembersDTO> getTeamDetails(@PathVariable Long id) {
        TeamWithMembersDTO teamDto = teamService.getTeamWithMembers(id);
        if (teamDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(teamDto);
    }

    /**
     * 更新队名
     */
    @PutMapping("/{id}/name")
    public ResponseEntity<Void> updateTeamName(@PathVariable Long id, @RequestParam String name) {
        boolean updated = teamService.updateTeamName(id, name);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
    /**
     * 系统管理员或队长自助创建一新的课题组
     */
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        teamService.save(team);
        return ResponseEntity.ok(team);
    }
    
    /**
     * 解散/删除某一存在的队伍建制
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        boolean removed = teamService.removeById(id);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * 将一名无组学生硬塞或自主挂载至当先的组内
     * 业务实现：查出这名学生的 Profile 档案，赋予其该队伍的外键指针后更新入库。
     */
    @PostMapping("/{teamId}/join")
    public ResponseEntity<Void> joinTeam(@PathVariable Long teamId, @RequestParam Long studentUserId) {
        com.usyd.cas.cas_backend.entity.StudentProfile profile = studentProfileService.getOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.usyd.cas.cas_backend.entity.StudentProfile>()
                .eq(com.usyd.cas.cas_backend.entity.StudentProfile::getUserId, studentUserId)
        );
        if (profile == null) {
            profile = new com.usyd.cas.cas_backend.entity.StudentProfile();
            profile.setUserId(studentUserId);
        }
        profile.setTeamId(teamId);
        studentProfileService.saveOrUpdate(profile);
        return ResponseEntity.ok().build();
    }

    /**
     * 学生主动退出团队 (如果 Admin 上锁了 isLocked=true，则拒绝)
     * 业务实现：将学生的 teamId 置为 null
     */
    @DeleteMapping("/{teamId}/leave")
    public ResponseEntity<String> leaveTeam(@PathVariable Long teamId, @RequestParam Long studentUserId) {
        Team team = teamService.getById(teamId);
        if (team == null) return ResponseEntity.notFound().build();
        
        if (Boolean.TRUE.equals(team.getIsLocked())) {
            return ResponseEntity.status(403).body("Team is locked by Admin/Tutor. You cannot leave.");
        }
        
        com.usyd.cas.cas_backend.entity.StudentProfile profile = studentProfileService.getOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.usyd.cas.cas_backend.entity.StudentProfile>()
                .eq(com.usyd.cas.cas_backend.entity.StudentProfile::getUserId, studentUserId)
        );
        if (profile != null && profile.getTeamId() != null && profile.getTeamId().equals(teamId)) {
            profile.setTeamId(null);
            studentProfileService.updateById(profile);
            return ResponseEntity.ok("Successfully left the team.");
        }
        return ResponseEntity.badRequest().body("Student is not in this team.");
    }

    /**
     * 管理员锁定或解锁团队，防止学生逃跑
     */
    @PutMapping("/{teamId}/lock")
    public ResponseEntity<Team> toggleTeamLock(@PathVariable Long teamId, @RequestParam boolean lockStatus) {
        Team team = teamService.getById(teamId);
        if (team != null) {
            team.setIsLocked(lockStatus);
            teamService.updateById(team);
            return ResponseEntity.ok(team);
        }
        return ResponseEntity.notFound().build();
    }
}
