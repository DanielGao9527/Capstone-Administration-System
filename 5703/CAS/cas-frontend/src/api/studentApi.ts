import api from './axios';

export const studentApi = {
    // ---- Profile ----
    getProfile: () => api.get('/profile'),
    updateProfile: (data: any) => api.put('/profile', data),

    // ---- Teams ----
    createTeam: (data: any) => api.post('/teams', data),
    joinTeam: (teamId: number, studentUserId: number) => api.post(`/teams/${teamId}/join?studentUserId=${studentUserId}`),
    leaveTeam: (teamId: number, studentUserId: number) => api.delete(`/teams/${teamId}/leave?studentUserId=${studentUserId}`),
    getTeamDetails: (teamId: number) => api.get(`/teams/${teamId}`),

    // ---- Proposals ----
    getPublishedProposals: (page = 1, size = 25) => api.get(`/proposals/global?page=${page}&size=${size}`),
    getProposalDetails: (proposalId: number) => api.get(`/proposals/${proposalId}`),

    // ---- Preferences ----
    submitPreferences: (teamId: number, data: any[]) => api.post(`/preferences/team/${teamId}`, data),
    getTeamPreferences: (teamId: number) => api.get(`/preferences/team/${teamId}`),

    // ---- Reflections ----
    submitReflection: (data: any) => api.post('/reflections', data),
    updateReflection: (id: number, data: any) => api.put(`/reflections/${id}`, data),
    deleteReflection: (id: number) => api.delete(`/reflections/${id}`),
    getTeamReflections: (teamId: number, page = 1, size = 20) => api.get(`/reflections/team/${teamId}?page=${page}&size=${size}`),

    // ---- Tips ----
    getTips: (page = 1, size = 15) => api.get(`/tips?page=${page}&size=${size}`)
};
