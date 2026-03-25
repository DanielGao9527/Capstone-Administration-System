package com.usyd.cas.cas_backend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 项目提案实体类 (Project Proposal)
 */
@Data
@TableName("project_proposals")
public class ProjectProposal {
    
    /**系统分配的主键ID*/
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**所属企业/导师赞助商的ID*/
    private Long sponsorId;
    
    /**项目名称*/
    private String projectName;
    
    /**赞助商详细信息*/
    private String sponsorDetails;
    
    /**项目背景（支持富文本）*/
    private String background;
    
    /**项目目标（支持富文本）*/
    private String objectives;
    
    /**成功衡量标准*/
    private String successMeasures;
    
    /**所需技能*/
    private String skillsRequired;
    
    /**优先级/关键程度*/
    private String criticality;
    
    /**汇报频率*/
    private String reportingFrequency;
    
    /**会议频率*/
    private String meetingFrequency;
    
    /**外部拓展链接（如视频或官方网站）*/
    private String externalLink;
    
    /**状态 (Draft, Under Review, Published, Allocated)*/
    private String status;
    
    /**创建时间（默认UTC存储）*/
    private LocalDateTime createdAt;
    
    /**更新时间（默认UTC存储）*/
    private LocalDateTime updatedAt;
}
