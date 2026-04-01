# Capstone Administration System (CAS) - Product Requirements Document (PRD) v5.0

| Project Name | Capstone Administration System (CAS) | Document Status | Updated (Student-Centric) |
| :--- | :--- | :--- | :--- |
| **Product Lead** | Java Full-Stack Architect | **Date** | 2026-04-01 |
| **Target Platform** | Web Backend/Portal | **Key Roles** | Student |

---

## 1. Product Overview

CAS is a full-lifecycle collaboration platform tailored for Capstone courses at higher education institutions, such as the University of Sydney (USYD). 

**Strategic Platform Shift (Platform-Level Infrastructure):**
To overcome the bottlenecks of legacy systems (e.g., NAC/NEC) that were strictly constrained to single-course structures, CAS is now explicitly architected as a **highly scalable, multi-course infrastructure**. It natively supports:
- Concurrent runtime of multiple disciplines and units of study (e.g., COMP5703, COMP5618, Business Capstones).
- Dual support for Undergraduate (UG) and Postgraduate (PG) cohorts operating simultaneously.
- Universal institutional platform scalability rather than a localized, single-session tool.

> **Current Scope Constraint:** This phase of development is **strictly restricted to the Student Portal**. All Admin/Tutor and Sponsor interfaces are completely deferred.

---

## 2. Core User Stories & Interfaces: Student Portal

### 2.1 Welcome Dashboard
* **Interaction Pattern:** Landing page post-authentication. Seamless tab-based navigation.
* **UI/Functional Modules:**
  * **Top Navigation Bar:** Tabs including Welcome, Project Proposals, Teams, Weekly Reflections, Submit a Project Proposal, Tips & Tricks.
  * **Curriculum Overview Console:** Plain-text presentation of core semester milestones.
  * **Security Alert Banner:** Notification mandating a unique CAS password.

### 2.2 Project Proposals Directory
* **Interaction Pattern:** Infinite scroll or standard list view for browsing.
* **UI/Functional Modules:**
  * **Top Action Bar:** Global `Search` input field and `Add filters`.
  * **Export Utility:** A prominent `Export` button for the proposals manifest.

### 2.3 Project Proposal Details
* **Interaction Pattern:** Read-only detailed routing view.
* **UI/Functional Modules:**
  * **Detail Grid:** Project Name, Sponsor Name, Email.
  * **Rich Text Display Area:** Project Background, Project Objective(s), Success Measures, Resource Availability.

### 2.4 Submit a Project Proposal
* **Interaction Pattern:** Long-form submission.
* **UI/Functional Modules:**
  * Standard project definition inputs and rich text areas.

### 2.5 Capstone Team Dashboard (Tutor-Formed & Team-Level Voting)
* **Interaction Pattern:** Aggregation dashboard displaying matchmaking results.
* **UI/Functional Modules:**
  * **Team Formation (Strictly Tutor-Allocated):** **Students do NOT self-assemble teams.** Team formations are exclusively executed by Tutors via external matchmaking surveys. The CAS system receives this roster; thus, this panel strictly renders the final team allocation and prevents any student-lead team creation workflows.
  * **Core Information:** Teams Letter, Team Name, Project Assigned.
  * **Preference Voting (Strictly Team-Level / Point of Contact Only):** 
    * Teams evaluate and submit their Top 5 project preferences.
    * **Point of Contact (PoC) Enforcement:** To resolve legacy data corruption where any member could arbitrarily cast or overwrite votes causing severe confusion, CAS strictly enforces a Liaison/PoC model. **Only the designated Team Point of Contact (e.g., Cecilia/Yihai)** is granted `write` permissions to submit or modify the Project Preference form. All other team members possess `read-only` visibility into the voting state.
  * **Roster (Your Team Mates):** Tabular view of Name, Email. The Point of Contact is visually spotlighted with a distinct badge.

### 2.6 Weekly Reflections & Status Reports
* **Interaction Pattern:** Historical log view coupled with a navigable submission form.
* **UI/Functional Modules:**
  * **Header Alerts:** Minimum reflective submissions tracker.
  * **Historical Ledger:** Logs Personal, Team, and Project Dispositions.
  * **Weekly Status Report Engine:** An extremely critical loop for course success. Students formulate weekly status reports combined with personal reflections to establish continuous communicative alignment with their Tutors. It is imperative that project health is tracked week-over-week.
  * **Submission Form:**
    * **Reflection Guidance:** Dynamically rendered administrative prompts.
    * **Temperature Check (Scales):** Dropdowns for Personal Disposition and Team Disposition (Very Happy, Neutral, Unhappy).
    * **Status Report / Deep Reflection Area:** Rich text input block serving dual purposes (Technical Project Status + Personal Academic Reflection).

### 2.7 Knowledge Base (Tips & Tricks)
* **UI/Functional Modules:** Directory & Detail View for Tips Intent and Graphics.

---

## 3. Deferred User Stories (Admin/Tutor & Sponsor)
> **STATUS: OUT OF SCOPE FOR CURRENT PHASE**
> All features related to Tutor Dashboards, Global Reflection Consoles, Grading Rubrics (Marks Assessment), and Sponsor Management Panels are temporarily halted to prioritize a robust, multi-course Student Portal foundation.

---

## 4. Non-Functional Requirements & Architecture Notes

1. **Multi-Course Data Partitioning:** Building a true platform implies that the database schema must securely pivot around a centralized `Course` or `UnitOfStudy` entity. Every subsequent relational record (Teams, Projects, Reflections, Students) must inherently track back to its parent `CourseId`, ensuring disparate courses run strictly isolated in the identical runtime environment.
2. **Tenant Isolation:** Stringent Role-Based Access Control (RBAC). 
3. **Optimizations:** Highly optimized composite indexing across `Team`, `StudentProfile`, and `Proposal` tables.

---
*End of Document*