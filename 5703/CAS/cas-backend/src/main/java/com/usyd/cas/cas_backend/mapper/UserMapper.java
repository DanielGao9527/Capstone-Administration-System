package com.usyd.cas.cas_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.cas.cas_backend.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
