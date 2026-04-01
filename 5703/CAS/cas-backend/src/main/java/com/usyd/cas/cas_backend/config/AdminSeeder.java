package com.usyd.cas.cas_backend.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
@Order(1) // Ensure it runs before DataSeeder if dev profile is active
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Automatically inject an ADMIN account globally across any profile (Prod, Test, Dev)
        User admin = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, "admin@sydney.edu.au"));
        if (admin == null) {
            admin = new User();
            admin.setEmail("admin@sydney.edu.au");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("Super Admin");
            admin.setRole("ADMIN");
            admin.setStatus("Active");
            admin.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            admin.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            userMapper.insert(admin);
            System.out.println("====== SYSTEM: Global Admin account automatically seeded: admin@sydney.edu.au / 123456 ======");
        }
    }
}
