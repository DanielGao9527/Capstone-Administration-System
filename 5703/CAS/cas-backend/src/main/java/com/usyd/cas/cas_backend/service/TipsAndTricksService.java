package com.usyd.cas.cas_backend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;

public interface TipsAndTricksService extends IService<TipsAndTricks> {
    
    /**
     * 分页查询当前系统的指导攻略
     * @param page 页码
     * @param size 每页大写
     * @param keyword 按照标题或tag的关键字搜索
     * @return 攻略分页对象
     */
    Page<TipsAndTricks> getTipsList(int page, int size, String keyword);
    
    /**
     * 创建一条心得体会或管理指导
     */
    TipsAndTricks createTip(TipsAndTricks tip);
}
