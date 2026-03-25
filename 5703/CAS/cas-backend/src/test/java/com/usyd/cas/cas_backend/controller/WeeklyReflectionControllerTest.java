package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.usyd.cas.cas_backend.entity.WeeklyReflection;
import com.usyd.cas.cas_backend.service.WeeklyReflectionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class WeeklyReflectionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WeeklyReflectionService weeklyReflectionService;

    @InjectMocks
    private WeeklyReflectionController weeklyReflectionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(weeklyReflectionController).build();
    }

    @Test
    void testSubmitReflection() throws Exception {
        WeeklyReflection reflection = new WeeklyReflection();
        reflection.setTeamId(1L);
        reflection.setPersonalDisposition("UNHAPPY");
        reflection.setReflectionDetails("<script>alert(1)</script> I am sad");
        
        WeeklyReflection savedReflection = new WeeklyReflection();
        savedReflection.setId(10L);
        savedReflection.setTeamId(1L);
        savedReflection.setPersonalDisposition("UNHAPPY");
        savedReflection.setReflectionDetails(" I am sad"); // Simulated Jsoup clean
        
        when(weeklyReflectionService.submitReflection(any(WeeklyReflection.class))).thenReturn(savedReflection);

        mockMvc.perform(post("/api/v1/reflections")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reflection)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.reflectionDetails").value(" I am sad"));
    }

    @Test
    void testGetReflectionsByTeam() throws Exception {
        WeeklyReflection reflection = new WeeklyReflection();
        reflection.setId(10L);
        reflection.setTeamId(1L);

        Page<WeeklyReflection> page = new Page<>();
        page.setRecords(Collections.singletonList(reflection));
        page.setTotal(1);

        when(weeklyReflectionService.getReflectionsByTeam(anyLong(), anyInt(), anyInt())).thenReturn(page);

        mockMvc.perform(get("/api/v1/reflections/team/1")
                .param("page", "1")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.records[0].id").value(10));
    }
}
