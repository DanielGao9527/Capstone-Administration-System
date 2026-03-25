package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import com.usyd.cas.cas_backend.security.JwtUtils;
import com.usyd.cas.cas_backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserMapper userMapper;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public static class LoginRequest {
        public String email;
        public String password;
    }
    
    public static class RegisterRequest {
        public String email;
        public String password;
        public String fullName;
        public String role;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Map<String, Object> body = new HashMap<>();
        body.put("token", jwt);
        body.put("id", userDetails.getId());
        body.put("email", userDetails.getUsername());
        body.put("role", role.replace("ROLE_", ""));

        return ResponseEntity.ok(body);
    }
    
    // API Endpoint specifically meant for test seeding users rapidly.
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if ("ADMIN".equalsIgnoreCase(signUpRequest.role) || "TUTOR".equalsIgnoreCase(signUpRequest.role)) {
            return ResponseEntity.badRequest().body("不允许直接注册管理员或助教账户！");
        }

        if (userMapper.selectCount(new LambdaQueryWrapper<User>().eq(User::getEmail, signUpRequest.email)) > 0) {
            return ResponseEntity.badRequest().body("Error: Email is already taken!");
        }

        User user = new User();
        user.setEmail(signUpRequest.email);
        user.setPassword(encoder.encode(signUpRequest.password));
        user.setFullName(signUpRequest.fullName);
        user.setRole(signUpRequest.role);
        user.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        user.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));

        userMapper.insert(user);
        return ResponseEntity.ok("User registered successfully via BCrypt encoding!");
    }
}
