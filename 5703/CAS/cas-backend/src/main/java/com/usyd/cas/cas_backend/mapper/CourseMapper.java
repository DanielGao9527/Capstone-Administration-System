package com.usyd.cas.cas_backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.cas.cas_backend.entity.Course;
import org.apache.ibatis.annotations.Mapper;

/**
 * 课程实体数据库映射接口
 */
@Mapper
public interface CourseMapper extends BaseMapper<Course> {
}
