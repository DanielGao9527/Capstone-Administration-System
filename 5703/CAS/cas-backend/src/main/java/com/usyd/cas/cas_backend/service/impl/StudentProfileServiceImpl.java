package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.mapper.StudentProfileMapper;
import com.usyd.cas.cas_backend.service.StudentProfileService;
import org.springframework.stereotype.Service;

@Service
public class StudentProfileServiceImpl extends ServiceImpl<StudentProfileMapper, StudentProfile> implements StudentProfileService {
}
