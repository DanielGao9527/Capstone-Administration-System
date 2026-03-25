package com.usyd.cas.cas_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.cas.cas_backend.entity.StudentProfile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentProfileMapper extends BaseMapper<StudentProfile> {
}
