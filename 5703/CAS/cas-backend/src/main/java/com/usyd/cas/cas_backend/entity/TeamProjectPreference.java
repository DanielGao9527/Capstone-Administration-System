package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("team_project_preferences")
public class TeamProjectPreference implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 填报志愿的队伍ID */
    private Long teamId;

    /** 志愿课题的主键ID */
    private Long projectProposalId;

    /** 志愿顺位(1=一选, 2=二选) */
    private Integer preferenceOrder;

    /** 审批状态 */
    private String status;

    /** 投递时间 */
    private LocalDateTime createdAt;
}
