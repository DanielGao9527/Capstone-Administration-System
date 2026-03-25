package com.usyd.cas.cas_backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.entity.dto.TeamWithMembersDTO;

public interface TeamService extends IService<Team> {
    /**
     * 获取队伍及其所有成员的信息
     */
    TeamWithMembersDTO getTeamWithMembers(Long teamId);
    
    /**
     * 更新队名
     */
    boolean updateTeamName(Long teamId, String teamName);
}
