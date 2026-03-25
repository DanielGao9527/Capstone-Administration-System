package com.usyd.cas.cas_backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.usyd.cas.cas_backend.entity.ProjectProposal;
import com.usyd.cas.cas_backend.service.ProjectProposalService;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProjectProposalControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectProposalService projectProposalService;

    @InjectMocks
    private ProjectProposalController projectProposalController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(projectProposalController).build();
    }

    @Test
    void testGetPublishedProposals() throws Exception {
        ProjectProposal proposal = new ProjectProposal();
        proposal.setId(1L);
        proposal.setProjectName("Test Project");
        proposal.setStatus("Published");

        Page<ProjectProposal> page = new Page<>();
        page.setRecords(Collections.singletonList(proposal));
        page.setTotal(1);

        when(projectProposalService.getPublishedProposals(anyInt(), anyInt(), org.mockito.ArgumentMatchers.isNull())).thenReturn(page);

        mockMvc.perform(get("/api/v1/proposals/published")
                .param("page", "1")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.records[0].projectName").value("Test Project"));
    }

    @Test
    void testCreateProposal() throws Exception {
        ProjectProposal proposal = new ProjectProposal();
        proposal.setProjectName("New Project");
        proposal.setSponsorId(2L);
        
        ProjectProposal savedProposal = new ProjectProposal();
        savedProposal.setId(1L);
        savedProposal.setProjectName("New Project");
        savedProposal.setStatus("Draft");
        
        when(projectProposalService.createProposal(any(ProjectProposal.class))).thenReturn(savedProposal);

        mockMvc.perform(post("/api/v1/proposals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(proposal)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Draft"))
                .andExpect(jsonPath("$.id").value(1));
    }
}
