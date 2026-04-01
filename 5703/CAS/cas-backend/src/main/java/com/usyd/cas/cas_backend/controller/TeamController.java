package com.usyd.cas.cas_backend.controller;


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
     * [Deprecated] 学生自助建队与进出队行为已被业务封禁。
     * 现在的组队必须基于外部 Tutor 导入或者 Matchmaking Survey 派发。
     * 因此，原有的 POST /teams, POST /teams/{teamId}/join, DELETE /teams/{teamId}/leave 已被彻底移除。
     */

}
