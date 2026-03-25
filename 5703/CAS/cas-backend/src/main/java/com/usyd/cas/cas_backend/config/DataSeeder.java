package com.usyd.cas.cas_backend.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.entity.ProjectProposal;
import com.usyd.cas.cas_backend.mapper.ProjectProposalMapper;
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
    private ProjectProposalMapper projectProposalMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Automatically inject an ADMIN account and retrieve its generated ID
        User admin = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, "admin@sydney.edu.au"));
        if (admin == null) {
            admin = new User();
            admin.setEmail("admin@sydney.edu.au");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Super Admin");
            admin.setRole("ADMIN");
            admin.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            admin.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            userMapper.insert(admin);
            System.out.println("====== SYSTEM: Admin account automatically seeded: admin@sydney.edu.au / admin123 ======");
        }
        Long defaultSponsorId = admin.getId();

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

        // 自动装载初始的 Proposal 课题作为前置可选项目
        if (projectProposalMapper.selectCount(null) == 0) {
            ProjectProposal p1 = new ProjectProposal();
            p1.setSponsorId(defaultSponsorId);
            p1.setProjectName("AI Driven Smart Farming");
            p1.setBackground("The agricultural industry needs modern solutions to optimize resources.");
            p1.setSkillsRequired("React, Spring Boot, Python ML, IoT Sensors");
            p1.setSuccessMeasures("A working web dashboard and predictive ML model.");
            p1.setStatus("Published");
            p1.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            p1.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            projectProposalMapper.insert(p1);

            ProjectProposal p2 = new ProjectProposal();
            p2.setSponsorId(defaultSponsorId);
            p2.setProjectName("Blockchain Academic Credential");
            p2.setBackground("Universities struggle with diploma counterfeiting globally.");
            p2.setSkillsRequired("Solidity, Node.js, Next.js, Smart Contracts");
            p2.setSuccessMeasures("A smart contract layout and DApp verification interface.");
            p2.setStatus("Published");
            p2.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            p2.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            projectProposalMapper.insert(p2);

            ProjectProposal p3 = new ProjectProposal();
            p3.setSponsorId(defaultSponsorId);
            p3.setProjectName("Virtual Reality Campus Tour");
            p3.setBackground("Prospective students often cannot visit the campus physically.");
            p3.setSkillsRequired("Unity, C#, 3D Modeling, WebXR");
            p3.setSuccessMeasures("An immersive web-based virtual tour for central buildings.");
            p3.setStatus("Published");
            p3.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            p3.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            projectProposalMapper.insert(p3);
            
            System.out.println("====== SYSTEM: 3 Mock Proposals seeded into database ======");
        }
    }
}
