package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.service.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 掌管学生学术档案的门面控制器 (WAN分, UID, 授课模式等)
 */
@RestController
@RequestMapping("/api/v1/student-profiles")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    @GetMapping("/{userId}")
    public ResponseEntity<StudentProfile> getProfile(@PathVariable Long userId) {
        StudentProfile profile = studentProfileService.getById(userId);
        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<StudentProfile> saveOrUpdateProfile(@RequestBody StudentProfile profile) {
        studentProfileService.saveOrUpdate(profile);
        return ResponseEntity.ok(profile);
    }
}
