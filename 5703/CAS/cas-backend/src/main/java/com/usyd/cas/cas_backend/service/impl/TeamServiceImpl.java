package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.entity.dto.TeamWithMembersDTO;
import com.usyd.cas.cas_backend.mapper.StudentProfileMapper;
import com.usyd.cas.cas_backend.mapper.TeamMapper;
import com.usyd.cas.cas_backend.service.TeamService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class TeamServiceImpl extends ServiceImpl<TeamMapper, Team> implements TeamService {

    @Autowired
    private StudentProfileMapper studentProfileMapper;

    @Override
    public TeamWithMembersDTO getTeamWithMembers(Long teamId) {
        Team team = this.getById(teamId);
        if (team == null) {
            return null;
        }

        LambdaQueryWrapper<StudentProfile> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(StudentProfile::getTeamId, teamId);
        List<StudentProfile> members = studentProfileMapper.selectList(queryWrapper);

        TeamWithMembersDTO dto = new TeamWithMembersDTO();
        BeanUtils.copyProperties(team, dto);
        dto.setMembers(members);

        return dto;
    }

    @Override
    public boolean updateTeamName(Long teamId, String teamName) {
        Team team = this.getById(teamId);
        if (team != null) {
            team.setTeamName(teamName);
            team.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            return this.updateById(team);
        }
        return false;
    }
}
