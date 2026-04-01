package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 团队实体类
 */
@Data
@TableName("teams")
public class Team {
    /**系统分配的主键ID*/
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**队伍字母代号*/
    private String teamLetter;
    
    /**队名*/
    private String teamName;
    
    /**分配的项目提案ID*/
    private Long projectAssignedId;
    
    /**授课或执行模式 (CC, remote RE等)*/
    private String mode;

    /**POC 电子邮件*/
    private String pocEmail;

    /**球队规模*/
    private Integer teamSize;

    /**潜力*/
    private String potential;

    /**当前问题*/
    private String currentIssue;

    /**教官-1*/
    private String instructorOne;

    /**议题优先级*/
    private String issuePriority;

    /**团队会议时间*/
    private String teamMeeting;

    /**项目接受状态*/
    private String projectAcceptance;

    /**团队活动*/
    private String teamActivity;

    /**赞助商联系情况*/
    private Boolean sponsorContacted;

    /**是否见过赞助商*/
    private Boolean metSponsor;

    /**产品信心级别*/
    private String productConfidence;

    /**需要原型开发帮助*/
    private Boolean needHelpWithPrototype;

    /**团队公开信息或备注*/
    private String teamMessage;

    /**球队状态*/
    private String teamStatus;

    /**队伍整体平均成绩分*/
    private BigDecimal averageWan;

    /**所属课程ID（多课程隔离）*/
    private Long courseId;
    
    /**队伍代表联络人 (Point of Contact ID)*/
    private Long pointOfContactId;
    
    /**创建时间（默认UTC存储）*/
    private LocalDateTime createdAt;
    
    /**更新时间（默认UTC存储）*/
    private LocalDateTime updatedAt;
}
