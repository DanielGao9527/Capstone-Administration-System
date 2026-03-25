package com.usyd.cas.cas_backend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.usyd.cas.cas_backend.entity.Attachment;
import com.usyd.cas.cas_backend.mapper.AttachmentMapper;
import com.usyd.cas.cas_backend.service.AttachmentService;
import org.springframework.stereotype.Service;

@Service
public class AttachmentServiceImpl extends ServiceImpl<AttachmentMapper, Attachment> implements AttachmentService {
}
