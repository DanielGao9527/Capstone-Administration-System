export const SYSTEM_MESSAGES = {
  // === Dev & Environment ===
  DEV_OVERRIDE_SUCCESS: "Dev Access Granted: You have been temporarily assigned to a mock team for testing.",
  DEV_OVERRIDE_FAILED: "Dev Override Failed: Please ensure the backend is actively running with the 'dev' profile.",
  
  // === Authentication & Network ===
  AUTH_FAILURE: "Authentication failed. Please verify your credentials and try again.",
  AUTH_SUCCESS: "Login successful. Welcome to the Capstone Administration System.",
  NETWORK_ERROR: "Network communication failed. Please check your internet connection.",
  
  // === Team Management ===
  TEAM_LOCKED: "Action denied. Your team is currently locked by the Unit Coordinator.",
  TEAM_CREATE_SUCCESS: "Team successfully registered.",
  TEAM_CREATE_FAILED: "Registration failed. Please ensure the team letter is unique.",
  TEAM_JOIN_SUCCESS: "Successfully joined the team.",
  TEAM_JOIN_FAILED: "Failed to join team. Please verify the Team ID.",
  TEAM_LEAVE_SUCCESS: "You have left the team.",
  TEAM_LEAVE_FAILED: "Failed to leave the team. Please refresh and try again.",
  
  // === Preferences & Reflections ===
  PREF_SUBMIT_SUCCESS: "Project preferences have been successfully recorded.",
  PREF_SUBMIT_FAILED: "Failed to submit project preferences. Please check your network.",
  PREF_OVERLAP_ERROR: "Validation Error: You cannot designate the same project multiple times.",
  REF_SUBMIT_SUCCESS: "Weekly reflection submitted successfully.",
  REF_SUBMIT_FAILED: "Failed to submit reflection. Please verify your connection.",
};
