package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.TeamProjectPreference;
import com.usyd.cas.cas_backend.mapper.TeamProjectPreferenceMapper;
import com.usyd.cas.cas_backend.service.TeamProjectPreferenceService;
import org.springframework.stereotype.Service;

@Service
public class TeamProjectPreferenceServiceImpl extends ServiceImpl<TeamProjectPreferenceMapper, TeamProjectPreference> implements TeamProjectPreferenceService {
}
