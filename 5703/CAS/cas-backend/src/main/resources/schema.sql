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

-- 第二切片：项目提案表 (Project Proposal)
CREATE TABLE IF NOT EXISTS `project_proposals` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '系统分配的主键ID',
    `sponsor_id` BIGINT NOT NULL COMMENT '所属企业/导师赞助商的ID',
    `project_name` VARCHAR(255) NOT NULL COMMENT '项目名称',
    `sponsor_details` TEXT COMMENT '赞助商详细信息',
    `background` TEXT COMMENT '项目背景',
    `objectives` TEXT COMMENT '项目目标',
    `success_measures` TEXT COMMENT '成功衡量标准',
    `skills_required` TEXT COMMENT '所需技能',
    `criticality` VARCHAR(50) COMMENT '优先级/关键程度 (e.g. Low, Medium, High)',
    `reporting_frequency` VARCHAR(50) COMMENT '汇报频率 (e.g. Fortnightly, Weekly)',
    `meeting_frequency` VARCHAR(50) COMMENT '会议频率',
    `external_link` VARCHAR(500) COMMENT '外部拓展链接（如视频或官方网站）',
    `status` VARCHAR(20) NOT NULL DEFAULT 'Draft' COMMENT '状态 (Draft, Under Review, Published, Allocated)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（默认UTC存储）',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间（默认UTC存储）',
    CONSTRAINT `fk_proposal_sponsor` FOREIGN KEY (`sponsor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS项目提案表';

-- 第三切片：团队 (Team) 与学生画像 (Student Profile)
-- 第三切片：团队 (Team) 与学生画像 (Student Profile)
CREATE TABLE IF NOT EXISTS `teams` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '系统分配的主键ID',
    `team_letter` VARCHAR(10) NOT NULL UNIQUE COMMENT '队伍字母代号 (如 A, B, C)',
    `team_name` VARCHAR(100) COMMENT '队名（允许学生/导师自定义）',
    `project_assigned_id` BIGINT COMMENT '分配的项目提案ID',
    `average_wan` DECIMAL(5,2) COMMENT '队伍整体平均成绩分',
    `is_locked` BOOLEAN DEFAULT FALSE COMMENT '防随意离队锁（Admin控）',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_team_project` FOREIGN KEY (`project_assigned_id`) REFERENCES `project_proposals` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS队伍信息表';

CREATE TABLE IF NOT EXISTS `student_profiles` (
    `user_id` BIGINT PRIMARY KEY COMMENT '关联的基础用户ID',
    `uos_code` VARCHAR(20) UNIQUE COMMENT '学号 (UoS Code)',
    `delivery_mode` VARCHAR(50) COMMENT '授课模式 (Online, In-person)',
    `wan` DECIMAL(5,2) COMMENT '加权平均分 (WAN)',
    `team_id` BIGINT COMMENT '所属队伍ID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_student_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS学生画像表';

-- 第四切片：周报与心理健康监控 (Weekly Reflections)
CREATE TABLE IF NOT EXISTS `weekly_reflections` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '填写该周报的学生ID',
    `team_id` BIGINT NOT NULL COMMENT '所属队伍ID',
    `week_number` INT NOT NULL COMMENT '学期周次',
    `personal_disposition` VARCHAR(20) NOT NULL COMMENT '个人倾向',
    `team_disposition` VARCHAR(20) NOT NULL COMMENT '团队整体状况',
    `project_disposition` VARCHAR(20) NOT NULL COMMENT '项目推进评估',
    `reflection_details` TEXT COMMENT '反思长文详情内容',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reflection_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reflection_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS周报与监控表';

-- 第五切片：提示与技巧攻略库 (Tips and Tricks)
CREATE TABLE IF NOT EXISTS `tips_and_tricks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `title` VARCHAR(255) NOT NULL COMMENT '条目标题',
    `content` TEXT NOT NULL COMMENT '攻略正文详情',
    `author_id` BIGINT COMMENT '撰写此攻略的管理员或导师',
    `tag` VARCHAR(100) COMMENT '可选标签 (如: Registration, Teamwork, General)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tip_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS系统技巧与提点表';

-- 第六切片：队伍志愿提报表 (Team Project Preferences)
CREATE TABLE IF NOT EXISTS `team_project_preferences` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `team_id` BIGINT NOT NULL COMMENT '填报志愿的队伍ID',
    `project_proposal_id` BIGINT NOT NULL COMMENT '课题ID',
    `preference_order` INT NOT NULL COMMENT '志愿顺位(1=第一志愿, 2=第二志愿, 3=第三志愿)',
    `status` VARCHAR(20) DEFAULT 'Pending' COMMENT '派位状态(Pending, Approved, Rejected)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pref_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pref_project` FOREIGN KEY (`project_proposal_id`) REFERENCES `project_proposals` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_team_order` (`team_id`, `preference_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生团队选报提案志愿表';

-- 第七切片：系统统一附件资产表 (Attachments)
CREATE TABLE IF NOT EXISTS `attachments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `file_name` VARCHAR(255) NOT NULL COMMENT '文件原名',
    `file_path` VARCHAR(500) NOT NULL COMMENT '本地或全网绝对路径/URI',
    `file_type` VARCHAR(50) COMMENT 'MIME类别',
    `file_size` BIGINT COMMENT '字节大小',
    `uploaded_by` BIGINT NOT NULL COMMENT '上传者ID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_attach_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CAS系统物理文件资产管理表';
