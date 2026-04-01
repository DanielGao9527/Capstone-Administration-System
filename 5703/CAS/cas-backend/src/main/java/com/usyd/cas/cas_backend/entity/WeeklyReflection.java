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

    /**所属课程ID*/
    private Long courseId;

    private Long teamId;

    private Integer weekNumber;

    private String personalDisposition;

    private String teamDisposition;

    private String projectDisposition;

    private String reflectionDetails;

    /** 每周进度报告 */
    private String statusReport;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
