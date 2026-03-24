-- 第一切片：系统统一用户表 (User)
-- 用于贯穿多租户架构与 Spring Security RBAC 验证
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '系统分配的主键ID',
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱地址（即登录账号，不可重复）',
    `password` VARCHAR(255) NOT NULL COMMENT '经BCrypt加强加密处理后的密文',
    `full_name` VARCHAR(100) NOT NULL COMMENT '用户真实全名',
    `role` VARCHAR(20) NOT NULL COMMENT '权限角色 (STUDENT, SPONSOR, TUTOR, ADMIN)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（默认UTC存储）',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最近一次更新时间（默认UTC存储）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS系统全局用户池';
