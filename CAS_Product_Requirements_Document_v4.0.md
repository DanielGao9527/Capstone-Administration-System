# Capstone Administration System (CAS) - Product Requirements Document (PRD) v4.0

| Project Name | Capstone Administration System (CAS) | Document Status | Finalized |
| :--- | :--- | :--- | :--- |
| **Product Lead** | Java Full-Stack Architect | **Date** | 2026-03-24 |
| **Target Platform** | Web Backend/Portal | **Key Roles** | Student, Sponsor, Administrator/Tutor |

---

## 1. Product Overview

CAS is a full-lifecycle collaboration platform tailored for Capstone courses at higher education institutions, such as the University of Sydney (USYD). It resolves information circulation bottlenecks among Students, External Sponsors, and Course Tutors. Core modules encompass Project Matchmaking, Team Progress Tracking, Mental Health & Reflection Monitoring, and Final Grade Assessment.

---

## 2. Core User Stories & Interfaces: Student Portal

### 2.1 Welcome Dashboard

* **Interaction Pattern:** Landing page post-authentication. Seamless tab-based navigation without intrusive modals.
* **UI/Functional Modules:**
  * **Top Navigation Bar:** Tabs including Welcome, Project Proposals, Teams, Weekly Reflections, Submit a Project Proposal, Tips & Tricks.
  * **Curriculum Overview Console:** Plain-text presentation of core semester milestones (e.g., 2021S2 surveys, team formation, project selection, weekly reporting).
  * **Security Alert Banner:** High-priority notification mandating a unique CAS password distinct from the institutional USYD portal. Includes a direct hyperlink to Account Settings for password modification.

### 2.2 Project Proposals Directory

* **Interaction Pattern:** Infinite scroll or standard list view for browsing, with action-column routing buttons.
* **UI/Functional Modules:**
  * **Top Action Bar:** Global `Search` input field and `Add filters` (supporting Tranche-based filtering).
  * **Export Utility:** A prominent `Export` button triggering browser-sided downloads of the comprehensive proposals manifest (Excel/PDF).
  * **Data Table (Proposals):** 
    * Project Name: Main title.
    * Project Background: 3-line truncation with ellipsis for overflow.
    * View Details: Navigate button routing to the Proposal Details page.

### 2.3 Project Proposal Details

* **Interaction Pattern:** Read-only detailed routing view.
* **UI/Functional Modules:**
  * **Detail Grid (Key-Value):** 
    * Project Name, Sponsor Name, Email (Triggers local email client).
  * **Rich Text Display Area:** Project Background, Project Objective(s) (Ordered List), Success Measures, Resource Availability, Budget Allocation, Governance, Further Instructions.
  * **Enumeration Badges:** Project Criticality (e.g., Medium), Reporting Frequency (e.g., Fortnightly), Meeting Frequency.
  * **Bottom Actions:** "Back to Project Proposals" text link for backward navigation.

### 2.4 Submit a Project Proposal

* **Interaction Pattern:** Long-form submission. Triggers required-field validation on submit, routing back to the directory with a "Submit Success" Toast notification upon completion.
* **UI/Functional Modules:**
  * **Standard Inputs:** Project Name (Required), Sponsor Details (Multi-line text).
  * **Rich Text Editor:** Equipped with bold, italic, list, hyperlink, and image upload toolbars. Applied to fields: Project Background, Objectives, Success Measures, Skills Required.
  * **Dropdown Selections:** Project Criticality, Reporting Frequency, Meeting Frequency.
  * **Bottom Actions:** External Link Input (Sponsor Website/Video), Primary `Submit` Button.

### 2.5 Capstone Team Dashboard

* **Interaction Pattern:** Aggregation dashboard displaying matchmaking results and collaborative team details.
* **UI/Functional Modules:**
  * **Core Information (Your Capstone Project):** Teams Letter (System-assigned immutable character, e.g., 'I'), Team Name, Project Assigned (Hyperlink).
  * **Preference Voting (Your Teams Vote):** Displays the team's Top 5 project preferences and Justifications. Includes `View` buttons for project details.
  * **Roster (Your Team Mates):** Tabular view of Name, Email, with a `View` button routing to student academic profiles (UoS Code, Delivery Mode).
  * **Team Name Management:** Restricted to Team Leaders or initialization phases. Updates globally synchronize the `Team Name` upon submission.

### 2.6 Weekly Reflections & Mental Health Monitor

* **Interaction Pattern:** Historical log view coupled with a navigable submission form.
* **UI/Functional Modules:**
  * **Header Alerts:** Notifies users that a minimum of 8 reflective submissions are required for academic credit. Includes an `Add Temperature Check + Reflection` action button.
  * **Historical Ledger:** Columns for Week, Personal Disposition, Team Disposition, Project Disposition, and Reflection Details (View modal).
  * **Submission Form:**
    * **Reflection Guidance:** Dynamically rendered read-only administrative prompts tailored for the current week.
    * **Temperature Check (Scales):** Required Dropdowns for Personal Disposition and Team Disposition (Utilizing Smiley Face semantics: Very Happy, Neutral, Unhappy).
    * **Deep Reflection Area:** Rich text input block.

### 2.7 Knowledge Base (Tips & Tricks)

* **Interaction Pattern:** List browsing -> Detail view -> Bottom-feed evaluation loop.
* **UI/Functional Modules:**
  * **Directory:** Search bar paired with a data table containing Tip Name, Purpose, AKA, and View routing.
  * **Detail View:** Renders the Tip's Intent alongside graphical illustrations (Image + Caption).
  * **Feedback Loop Form (Provide Your Feedback):**
    * Tip Rating (Required): Star-rating dropdown.
    * Qualitative Input (Required): Rich text fields for "Why is it valuable?" and "How can it be improved?". Evaluated upon `Submit`.

---

## 3. Core User Stories & Interfaces: Admin/Tutor Portal

### 3.1 Tutor Dashboard

* **Interaction Pattern:** Default data-intensive dashboard with composite filtering capabilities.
* **UI/Functional Modules:**
  * **Personal Academic Profile:** Tranche, Class, Delivery Mode.
  * **Managed Teams Overview (Your Capstone Teams):** Aggregates managed Teams Letters, Team Names, Assigned Projects, Team Sizes, and Average WAN (Weighted Average Mark pre-alerts).
  * **Global Student Data Pivot (All Capstone Teams):** Expandable/Collapsible list of all students (Gender, Email) mapped to their teams, unified with an `Export` utility.

### 3.2 Global Reflection Console

* **Interaction Pattern:** High-volume data table with pagination (25 items per page).
* **UI/Functional Modules:**
  * **Data Columns:** Team, Student, Weeks, Personal/Team/Project Disposition (Intuitive semantic indicators), Reflection Details.
  * **Alert Filtering:** Tutors utilize `Add filters` to isolate "Unhappy" dispositions or pending "Current" module reflections awaiting grading.

### 3.3 My Project Proposals

* **Interaction Pattern:** List browsing + Form routing.
* **UI/Functional Modules:**
  * **Proposals Directory:** Displays projects initiated by the Tutor acting as an internal Sponsor, including background snapshots.
  * **Creation Action:** `Add Project Proposal` button extending the standard submission logic (Reference 2.4).
  * **Managed Teams Ledger:** Once corresponding projects are claimed, displays Teams Letters, Names, and Emails for direct communication.

### 3.4 Curriculum Configurations & Perspectives

* **Interaction Pattern:** Sorted directory + Single-record editing forms.
* **UI/Functional Modules:**
  * **Curriculum List:** Ascending sort by academic `Weeks`.
  * **Field Definitions:** Overview, Reflection Guidance (Directly pushed to the Student Form), Coordinator Activities, Admin Activities, Student Activities.
  * **Administrative Actions:** Inline `Edit` triggers form-based modifications and live publishing.

### 3.5 System Administration (Miscellaneous)

* **Interaction Pattern:** Modular card-based grid acting as entry points to respective management tables.
* **UI/Functional Modules:**
  * Child modules: Different Reflections, Project Proposals (Approval Lifecycle Management), Tips (Dictionary Editing), Marks Feedbacks (Rubric Configurations), Match Making Surveys (Export logic for allocation algorithms), Teams, Curriculum.

### 3.6 Capstone Marks Assessment Module

* **Interaction Pattern:** Cascading selections triggering dynamic Rubric rendering, culminating in draft/publish actions.
* **UI/Functional Modules:**
  * **Target Selection Header:**
    * Select Team (Required): Dropdown of manageable scopes (e.g., Team I).
    * Assessment Type (Required): Radio tabs spanning [Team Assessment] and [Individual Assessment].
  * **Rubric Grading Table:**
    * Dynamically synchronized with `Miscellaneous -> Marks Feedbacks`.
    * **Table Columns:** Rubric Item (e.g., Mid-term Presentation/Project Charter), Max Score (e.g., 20%), Score Given (Numeric input or Grade dropdown), Tutor Feedback (Rich text justification).
  * **Summary & Actions:**
    * Total Score: Synchronous frontend calculation (Read-only).
    * `Save as Draft`: Persists state privately.
    * `Publish & Export`: Triggers a secondary-confirmation modal ("Confirm publication? Cannot be retracted."). Upon confirmation, marks are exposed to the student portal and system logs are generated.

---

## 4. Core User Stories & Interfaces: Sponsor Portal

### 4.1 Sponsor Welcome

* **Interaction Pattern:** Static informational display infused with inline routing hyperlinks.
* **UI/Functional Modules:**
  * **Welcome & Timeline:** Chronicles the active semester and critical milestones (e.g., Matchmaking deadlines, Kick-off expectations).
  * **Security prompt:** Redirects Sponsors to `Account Settings` to overwrite initial system-generated credentials.

### 4.2 Sponsor Project Proposals Management

* **Interaction Pattern:** Securely isolated iteration of module 2.4/3.3.
* **UI/Functional Modules:**
  * Sponsors are strictly constrained to view their authored Proposals.
  * Features form creation and clear state-tracking columns (Draft, Under Review, Published, Allocated).

### 4.3 My Assigned Teams Tracking

* **Interaction Pattern:** Read-only data table rendered strictly post-allocation.
* **UI/Functional Modules:**
  * **Team Identifiers:** Maps the allocated Teams Letter and Team Name.
  * **Contact Roster:** Surfaces assigned student's Name and University Email to facilitate initial meetings.
  * **Health Status Indicators:** Leverages aggregated, privacy-stripped Project Dispositions to present project momentum (Green/At-risk/Critical), guiding Sponsor intervention strategies.

---

## 5. Non-Functional Requirements & Architecture Notes

1. **Tenant Isolation:** The system functions as a Multi-tenant variant. Sponsors must be absolutely restricted from horizontal privilege escalation (e.g., URL `teamId` tampering) to prevent unauthorized access to competitor IP or student reflections. Stringent Role-Based Access Control (RBAC) interceptors are mandatory in the Java Backend.
2. **XSS Prevention:** Given the prevalence of Rich Text Editors in Proposals and Reflections, the backend must persistently sanitize incoming payloads using enterprise libraries (e.g., OWASP Java HTML Sanitizer).
3. **Algorithmic Performance Contingencies:** The Matchmaking allocation scripts and survey export modules incur high-concurrency reads during initialization weeks. Implement highly optimized composite indexing across `Team`, `StudentProfile`, and `Proposal` tables.

---
*End of Document*