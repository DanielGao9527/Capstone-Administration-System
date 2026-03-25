package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 周报与监控实体类
 */
@Data
@TableName("weekly_reflections")
public class WeeklyReflection {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long teamId;

    private Integer weekNumber;

    private String personalDisposition;

    private String teamDisposition;

    private String projectDisposition;

    private String reflectionDetails;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
