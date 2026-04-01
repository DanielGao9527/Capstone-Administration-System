package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.TableField;
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
    
    @TableField("uos_code")
    private String uosCode;

    @TableField("delivery_mode")
    private String deliveryMode;

    @TableField("degree_type")
    private String degreeType;

    @TableField("contact_email")
    private String contactEmail;

    @TableField("wan")
    private BigDecimal wan;
    
    /**所属课程ID（多课程隔离）*/
    private Long courseId;
    
    /**所属队伍ID*/
    private Long teamId;
    
    /**创建时间（默认UTC存储）*/
    private LocalDateTime createdAt;
    
    /**更新时间（默认UTC存储）*/
    private LocalDateTime updatedAt;
}
