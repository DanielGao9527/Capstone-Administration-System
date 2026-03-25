package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 学生画像实体类
 */
@Data
@TableName("student_profiles")
public class StudentProfile {
    /**关联的基础用户ID*/
    @TableId
    private Long userId;
    
    /**学号 (UoS Code)*/
    private String uosCode;
    
    /**授课模式 (Online, In-person)*/
    private String deliveryMode;
    
    /**加权平均分 (WAN)*/
    private BigDecimal wan;
    
    /**所属队伍ID*/
    private Long teamId;
    
    /**创建时间（默认UTC存储）*/
    private LocalDateTime createdAt;
    
    /**更新时间（默认UTC存储）*/
    private LocalDateTime updatedAt;
}
