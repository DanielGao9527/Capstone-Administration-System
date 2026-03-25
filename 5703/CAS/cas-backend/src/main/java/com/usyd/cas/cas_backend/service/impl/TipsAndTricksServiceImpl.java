package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import com.usyd.cas.cas_backend.mapper.TipsAndTricksMapper;
import com.usyd.cas.cas_backend.service.TipsAndTricksService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TipsAndTricksServiceImpl extends ServiceImpl<TipsAndTricksMapper, TipsAndTricks> implements TipsAndTricksService {

    @Override
    public Page<TipsAndTricks> getTipsList(int page, int size, String keyword) {
        Page<TipsAndTricks> pagination = new Page<>(page, size);
        QueryWrapper<TipsAndTricks> wrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.like("title", keyword).or().like("tag", keyword);
        }
        wrapper.orderByDesc("created_at");
        return baseMapper.selectPage(pagination, wrapper);
    }

    @Override
    public TipsAndTricks createTip(TipsAndTricks tip) {
        tip.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        tip.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
        baseMapper.insert(tip);
        return tip;
    }
}
