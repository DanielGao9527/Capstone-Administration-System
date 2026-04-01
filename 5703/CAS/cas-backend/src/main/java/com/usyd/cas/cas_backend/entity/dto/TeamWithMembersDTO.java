package com.usyd.cas.cas_backend.entity.dto;

import com.usyd.cas.cas_backend.entity.Team;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 带有成员列表的队伍信息 DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class TeamWithMembersDTO extends Team {
    /** 学生成员扩展档案列表 */
    private List<StudentProfileDTO> members;
}
