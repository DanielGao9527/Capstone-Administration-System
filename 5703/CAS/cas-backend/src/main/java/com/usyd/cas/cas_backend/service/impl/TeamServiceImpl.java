package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.entity.dto.TeamWithMembersDTO;
import com.usyd.cas.cas_backend.entity.dto.StudentProfileDTO;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.mapper.StudentProfileMapper;
import com.usyd.cas.cas_backend.mapper.TeamMapper;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import com.usyd.cas.cas_backend.service.TeamService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class TeamServiceImpl extends ServiceImpl<TeamMapper, Team> implements TeamService {

    @Autowired
    private StudentProfileMapper studentProfileMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public TeamWithMembersDTO getTeamWithMembers(Long teamId) {
        Team team = this.getById(teamId);
        if (team == null) {
            return null;
        }

        LambdaQueryWrapper<StudentProfile> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(StudentProfile::getTeamId, teamId);
        List<StudentProfile> rawMembers = studentProfileMapper.selectList(queryWrapper);

        List<StudentProfileDTO> memberDtos = new ArrayList<>();
        for (StudentProfile sp : rawMembers) {
            StudentProfileDTO dtoItem = new StudentProfileDTO();
            BeanUtils.copyProperties(sp, dtoItem);
            
            // 补充查询 User 信息
            User user = userMapper.selectById(sp.getUserId());
            if (user != null) {
                dtoItem.setFullName(user.getFullName());
                dtoItem.setEmail(user.getEmail());
            }
            memberDtos.add(dtoItem);
        }

        TeamWithMembersDTO dto = new TeamWithMembersDTO();
        BeanUtils.copyProperties(team, dto);
        dto.setMembers(memberDtos);

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
