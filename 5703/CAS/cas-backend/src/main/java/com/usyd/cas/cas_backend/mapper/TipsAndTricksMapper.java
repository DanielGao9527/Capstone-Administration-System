package com.usyd.cas.cas_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import org.apache.ibatis.annotations.Mapper;

/**
 * TipsAndTricks Mapper 接口，直接继承 MyBatis-Plus 的 BaseMapper 获得增删改查
 */
@Mapper
public interface TipsAndTricksMapper extends BaseMapper<TipsAndTricks> {
}
