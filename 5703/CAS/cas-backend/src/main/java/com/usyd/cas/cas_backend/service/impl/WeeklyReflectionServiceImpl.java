package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.WeeklyReflection;
import com.usyd.cas.cas_backend.mapper.WeeklyReflectionMapper;
import com.usyd.cas.cas_backend.service.WeeklyReflectionService;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class WeeklyReflectionServiceImpl extends ServiceImpl<WeeklyReflectionMapper, WeeklyReflection> implements WeeklyReflectionService {

    @Override
    public WeeklyReflection submitReflection(WeeklyReflection reflection) {
        if (reflection.getReflectionDetails() != null) {
            reflection.setReflectionDetails(Jsoup.clean(reflection.getReflectionDetails(), Safelist.relaxed()));
        }

        // 新增：对每周项目进度报告进行 XSS 富文本清洗
        if (reflection.getStatusReport() != null) {
            reflection.setStatusReport(Jsoup.clean(reflection.getStatusReport(), Safelist.relaxed()));
        }

        LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);
        reflection.setCreatedAt(nowUtc);
        reflection.setUpdatedAt(nowUtc);
        
        this.save(reflection);
        return reflection;
    }

    @Override
    public Page<WeeklyReflection> getReflectionsByTeam(Long teamId, int page, int size) {
        Page<WeeklyReflection> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<WeeklyReflection> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(WeeklyReflection::getTeamId, teamId);
        queryWrapper.orderByDesc(WeeklyReflection::getWeekNumber);
        queryWrapper.orderByDesc(WeeklyReflection::getCreatedAt);
        return this.page(pageParam, queryWrapper);
    }

    @Override
    public Page<WeeklyReflection> getGlobalReflections(int page, int size, String dispositionLevel) {
        Page<WeeklyReflection> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<WeeklyReflection> queryWrapper = new LambdaQueryWrapper<>();
        
        // 当发生健康或心理安全告警过滤时，筛选相应层级的申报记录
        if (dispositionLevel != null && !dispositionLevel.trim().isEmpty()) {
            queryWrapper.eq(WeeklyReflection::getPersonalDisposition, dispositionLevel)
                        .or().eq(WeeklyReflection::getTeamDisposition, dispositionLevel)
                        .or().eq(WeeklyReflection::getProjectDisposition, dispositionLevel);
        }
        
        queryWrapper.orderByDesc(WeeklyReflection::getCreatedAt);
        return this.page(pageParam, queryWrapper);
    }
}
