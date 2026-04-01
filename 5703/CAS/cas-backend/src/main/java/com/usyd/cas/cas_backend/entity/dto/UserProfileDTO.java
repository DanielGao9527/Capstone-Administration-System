package com.usyd.cas.cas_backend.entity.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UserProfileDTO {
    // Basic User info
    private Long id;
    private String fullName;
    private String email;          // Login email (Immutable)
    private String role;
    private String status;         // Active/Inactive (Immutable by user)
    
    // Student Profile info (Nullable if Admin/Sponsor)
    private String uosCode;        // ID / 学号
    private String degreeType;
    private String contactEmail;   // Mutable preference
    private String deliveryMode;
    private BigDecimal wan;
    private Long teamId;

    // Updatable fields passed from frontend
    private String password;       // If non-empty, change password
}
