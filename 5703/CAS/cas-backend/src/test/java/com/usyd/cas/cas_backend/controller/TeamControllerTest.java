package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.dto.StudentProfileDTO;
import com.usyd.cas.cas_backend.entity.Team;
import com.usyd.cas.cas_backend.entity.dto.TeamWithMembersDTO;
import com.usyd.cas.cas_backend.service.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TeamControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(teamController).build();
    }

    @Test
    void testGetTeamDetails() throws Exception {
        TeamWithMembersDTO dto = new TeamWithMembersDTO();
        dto.setId(10L);
        dto.setTeamName("Alpha Team");
        dto.setTeamLetter("A");
        
        StudentProfileDTO student = new StudentProfileDTO();
        student.setUserId(100L);
        student.setUosCode("400123456");
        dto.setMembers(Collections.singletonList(student));

        when(teamService.getTeamWithMembers(anyLong())).thenReturn(dto);

        mockMvc.perform(get("/api/v1/teams/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.teamName").value("Alpha Team"))
                .andExpect(jsonPath("$.members[0].uosCode").value("400123456"));
    }
}
