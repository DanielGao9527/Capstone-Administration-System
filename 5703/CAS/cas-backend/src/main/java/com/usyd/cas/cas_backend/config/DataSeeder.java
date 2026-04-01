package com.usyd.cas.cas_backend.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.cas.cas_backend.entity.TipsAndTricks;
import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.entity.ProjectProposal;
import com.usyd.cas.cas_backend.mapper.ProjectProposalMapper;
import com.usyd.cas.cas_backend.mapper.TipsAndTricksMapper;
import com.usyd.cas.cas_backend.mapper.UserMapper;
import com.usyd.cas.cas_backend.entity.StudentProfile;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.mapper.StudentProfileMapper;
import com.usyd.cas.cas_backend.mapper.TeamMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
@Profile("dev")
@Order(2)
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TipsAndTricksMapper tipsAndTricksMapper;

    @Autowired
    private ProjectProposalMapper projectProposalMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private StudentProfileMapper studentProfileMapper;

    @Override
    public void run(String... args) throws Exception {
        // Since AdminSeeder ran first, we can just grab the admin
        User admin = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, "admin@sydney.edu.au"));
        Long defaultSponsorId = admin != null ? admin.getId() : 1L;

        // Automatically inject SHADOW_SQUAD_999 Team
        Team devTeam = teamMapper.selectById(999L);
        if (devTeam == null) {
            devTeam = new Team();
            devTeam.setId(999L);
            devTeam.setTeamLetter("DEV");
            devTeam.setTeamName("SHADOW_SQUAD_999");
            devTeam.setMode("mixed Online");
            devTeam.setPocEmail("poc@test.sydney.edu.au");
            devTeam.setTeamSize(5);
            devTeam.setCurrentIssue("Integration testing blocked by proxy");
            devTeam.setTeamMeeting("Friday 10:00 AM UTC");
            devTeam.setInstructorOne("Dr. Alan");
            devTeam.setProjectAcceptance("Approved");
            devTeam.setTeamStatus("Active");
            teamMapper.insert(devTeam);
            System.out.println("====== [DEV] SYSTEM: Created SHADOW_SQUAD_999 ======");
        }

        // Helper boolean to check if we needed to seed students
        boolean seededStudents = false;

        // Automatically inject Test STUDENT 1
        User student1 = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, "student1@sydney.edu.au"));
        if (student1 == null) {
            student1 = new User();
            student1.setEmail("student1@sydney.edu.au");
            student1.setPassword(passwordEncoder.encode("123456"));
            student1.setFullName("Alpha Student");
            student1.setRole("STUDENT");
            student1.setStatus("Active");
            student1.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            student1.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            userMapper.insert(student1);

            StudentProfile p1 = new StudentProfile();
            p1.setUserId(student1.getId());
            p1.setUosCode("SID000001");
            p1.setDegreeType("Master of IT");
            p1.setContactEmail("student1@sydney.edu.au");
            p1.setTeamId(999L);
            p1.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            p1.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            studentProfileMapper.insert(p1);
            seededStudents = true;
        }

        // Automatically inject Test STUDENT 2
        User student2 = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmail, "student2@sydney.edu.au"));
        if (student2 == null) {
            student2 = new User();
            student2.setEmail("student2@sydney.edu.au");
            student2.setPassword(passwordEncoder.encode("123456"));
            student2.setFullName("Beta Student");
            student2.setRole("STUDENT");
            student2.setStatus("Active");
            student2.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            student2.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            userMapper.insert(student2);

            StudentProfile p2 = new StudentProfile();
            p2.setUserId(student2.getId());
            p2.setUosCode("SID000002");
            p2.setDegreeType("Master of IT");
            p2.setContactEmail("student2@sydney.edu.au");
            p2.setTeamId(999L);
            p2.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            p2.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
            studentProfileMapper.insert(p2);
            seededStudents = true;
        }

        if (seededStudents) {
            System.out.println("====== [DEV] SYSTEM: Student 1 & 2 automatically seeded into Team 999 (pw: 123456) ======");
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
