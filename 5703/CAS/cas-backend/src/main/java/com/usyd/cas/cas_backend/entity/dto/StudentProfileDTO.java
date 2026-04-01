package com.usyd.cas.cas_backend.entity.dto;

import com.usyd.cas.cas_backend.entity.StudentProfile;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 学生画像扩展DTO (包含 User 表中的姓名和邮箱)
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class StudentProfileDTO extends StudentProfile {
    /**真实姓名*/
    private String fullName;
    
    /**联络邮箱*/
    private String email;
}
