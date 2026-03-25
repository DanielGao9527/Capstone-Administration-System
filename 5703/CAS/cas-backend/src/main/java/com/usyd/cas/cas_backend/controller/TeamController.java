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
}
