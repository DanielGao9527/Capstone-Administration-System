package com.usyd.cas.cas_backend.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.mapper.TipsAndTricksMapper;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TipsAndTricksMapper tipsAndTricksMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Automatically inject an ADMIN account
        if (userMapper.selectCount(new LambdaQueryWrapper<User>().eq(User::getEmail, "admin@sydney.edu.au")) == 0) {
            User admin = new User();
            admin.setEmail("admin@sydney.edu.au");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Super Admin");
            admin.setRole("ADMIN");
            admin.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            admin.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            userMapper.insert(admin);
            System.out.println("====== SYSTEM: Admin account automatically seeded: admin@sydney.edu.au / admin123 ======");
        }

        // 自动装载两条基础技巧指引，方便前端页面直接展现样式
        if (tipsAndTricksMapper.selectCount(null) == 0) {
            TipsAndTricks tip1 = new TipsAndTricks();
            tip1.setTitle("How to form a successful Capstone team?");
            tip1.setContent("Start by identifying members with complementary skills. You will need a mix of frontend, backend, and project management capabilities. Don't rush into assigning roles; communicate openly first!");
            tip1.setTag("Teamwork");
            tip1.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            tip1.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            tipsAndTricksMapper.insert(tip1);

            TipsAndTricks tip2 = new TipsAndTricks();
            tip2.setTitle("Where to look for previous project repos?");
            tip2.setContent("Check the official Canvas shell for the 'Past Archives' module. Make sure to adhere to the academic honesty policy when referencing old architectures.");
            tip2.setTag("General");
            tip2.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            tip2.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            tipsAndTricksMapper.insert(tip2);

            System.out.println("====== SYSTEM: 2 Mock Tips and Tricks seeded into database ======");
        }
    }
}
