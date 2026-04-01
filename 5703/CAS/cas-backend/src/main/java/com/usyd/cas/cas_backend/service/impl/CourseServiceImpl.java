package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.Course;
import com.usyd.cas.cas_backend.mapper.CourseMapper;
import com.usyd.cas.cas_backend.service.CourseService;
import org.springframework.stereotype.Service;

@Service
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course> implements CourseService {
}
