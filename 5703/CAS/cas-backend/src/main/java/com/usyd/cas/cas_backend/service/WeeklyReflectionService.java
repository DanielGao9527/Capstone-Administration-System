package com.usyd.cas.cas_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.usyd.cas.cas_backend.entity.WeeklyReflection;

public interface WeeklyReflectionService extends IService<WeeklyReflection> {
    
    WeeklyReflection submitReflection(WeeklyReflection reflection);
    
    Page<WeeklyReflection> getReflectionsByTeam(Long teamId, int page, int size);
    
    Page<WeeklyReflection> getGlobalReflections(int page, int size, String dispositionLevel);
}
