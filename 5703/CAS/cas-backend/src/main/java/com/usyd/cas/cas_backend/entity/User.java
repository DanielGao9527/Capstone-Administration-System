package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldFill;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 核心系统权限与用户池实体类
 * 对接 users 表。利用 Lombok 注解自动重载 Get/Set 构造法。
 */
@Data
@TableName("users")
public class User {
    
    // 主键设置为由 MySQL Auto Increment 控制
    @TableId(type = IdType.AUTO)
    private Long id;
    
    // 用户名/邮箱 (Unique)
    private String email;
    
    // 隐藏密文密码
    private String password;
    
    @NotBlank
    private String fullName;

    @NotBlank
    private String role; // "STUDENT", "SPONSOR", "TUTOR", "ADMIN"

    @TableField(value = "status")
    private String status; // "Active", "Inactive"

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    // 更新时时间戳 (UTC)
    private LocalDateTime updatedAt;
}
