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
    
    /**队伍整体平均成绩分*/
    private BigDecimal averageWan;
    
    /**创建时间（默认UTC存储）*/
    private LocalDateTime createdAt;
    
    /**更新时间（默认UTC存储）*/
    private LocalDateTime updatedAt;
}
