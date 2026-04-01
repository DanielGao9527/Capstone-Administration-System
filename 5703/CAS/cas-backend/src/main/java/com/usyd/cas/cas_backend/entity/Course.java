package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 课程实体类 - 平台化基础，隔离多课程多学期不同学科的数据
 */
@Data
@TableName("courses")
public class Course {
    /** 系统分配的主键ID */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 课程代号 (例如 COMP5703, INFO3600) */
    private String courseCode;
    
    /** 课程名称 (例如 Capstone Project) */
    private String courseName;
    
    /** 开课学期 (例如 2026S1) */
    private String semester;
    
    /** 本科还是研究生标识 (UG / PG) */
    private String level;

    /** 是否已归档 */
    private Boolean isArchived;
    
    /** 创建时间（默认UTC存储） */
    private LocalDateTime createdAt;
    
    /** 更新时间（默认UTC存储） */
    private LocalDateTime updatedAt;
}
