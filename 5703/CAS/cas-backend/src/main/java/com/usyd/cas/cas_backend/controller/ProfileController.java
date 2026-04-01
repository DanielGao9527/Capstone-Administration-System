package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.entity.dto.UserProfileDTO;
import com.usyd.cas.cas_backend.service.StudentProfileService;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StudentProfileService studentProfileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String getAuthEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile() {
        String email = getAuthEmail();
        User user = userMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus() != null ? user.getStatus() : "Active");

        if ("STUDENT".equalsIgnoreCase(user.getRole())) {
            StudentProfile sp = studentProfileService.getById(user.getId());
            if (sp != null) {
                dto.setUosCode(sp.getUosCode());
                dto.setDegreeType(sp.getDegreeType() != null ? sp.getDegreeType() : "General/Unknown");
                dto.setContactEmail(sp.getContactEmail() != null ? sp.getContactEmail() : user.getEmail());
                dto.setDeliveryMode(sp.getDeliveryMode());
                dto.setWan(sp.getWan());
                dto.setTeamId(sp.getTeamId());
            }
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody UserProfileDTO req) {
        String email = getAuthEmail();
        User user = userMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Handle strict updates. Only update password if provided.
        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            userMapper.updateById(user);
        }

        // Handle Student Contact Email change
        if ("STUDENT".equalsIgnoreCase(user.getRole())) {
            StudentProfile sp = studentProfileService.getById(user.getId());
            if (sp != null) {
                if (req.getContactEmail() != null && !req.getContactEmail().trim().isEmpty()) {
                    sp.setContactEmail(req.getContactEmail());
                    studentProfileService.updateById(sp);
                }
            }
        }

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}
