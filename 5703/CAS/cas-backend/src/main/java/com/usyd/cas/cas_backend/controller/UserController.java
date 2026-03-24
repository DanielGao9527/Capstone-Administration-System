package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.User;
import com.usyd.cas.cas_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "1. 用户配置接口 (Users)", description = "涵盖项目所有干系账号（学生/赞助商/导师）信息的创建读取")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "全网获取所有记录", description = "Mock数据：无条件抛出所有被组建的账户行列表信息。")
    public List<User> getAllUsers() {
        return userService.list();
    }

    @PostMapping
    @Operation(summary = "添加/注入一条账户", description = "用于在控制台手动造假数据向MySQL发起写入测试。")
    public boolean insertUser(@RequestBody User user) {
        return userService.save(user);
    }
}
