# Capstone Administration System (CAS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v1.0-green.svg)

## 📌 Project Overview

**Capstone Administration System (CAS)** is a full-lifecycle collaboration platform tailored for Capstone courses at higher education institutions, such as the University of Sydney (USYD). It serves as a unified ecosystem designed to eliminate information circulation bottlenecks between **Students**, **External Sponsors**, and **Course Tutors**.

CAS facilitates seamless project matchmaking, team progress tracking, mental health & reflection monitoring, and robust final grade assessments.

## 🚀 Key Features

- **Multi-tenant Role Architecture**: Dedicated, securely isolated portals for Students, Tutors/Admins, and Sponsors.
- **Smart Project Matchmaking**: Streamlined submission, review, preference voting, and algorithm-ready team allocation capabilities.
- **Student Reflection & Mental Health Monitoring**: Weekly tracking of Personal, Team, and Project dispositions with built-in tutor alert systems.
- **Dynamic Grading Engine**: Customizable assessment rubrics mapped directly to team and individual contributions across the semester.
- **Zero-Downtime Deployment**: Leveraging Azure Deployment Slots to update grading configurations during live semesters without interrupting active user sessions.

## 🛠️ Technical Stack (Cloud-Native & Modular Monolith)

- **Frontend Environment**: React, TypeScript, TailwindCSS, Ant Design, Zustand, Axios
- **Backend API**: Java 21, Spring Boot 3.x, Spring Security (JWT, BCrypt)
- **Data & Caching**: MySQL 8.0 (MyBatis-Plus ORM), Redis (Distributed caching & locks)
- **Cloud Infrastructure (Microsoft Azure)**:
  - Azure App Service (Compute layer with Auto-scaling)
  - Azure Static Web Apps (Global CDN)
  - Azure Database for MySQL Flexible Server
  - Azure Cache for Redis
  - Azure Blob Storage (Document object storage)

## 🔒 Security Best Practices

To ensure enterprise-level security, CAS enforces:
1. **Strict Contextual RBAC**: Implemented at the Java interceptor level to prevent URL object manipulation and horizontal privilege escalation.
2. **Aggressive XSS Sanitization**: OWASP Java HTML Sanitizer deployed across all Rich Text interfaces.
3. **UTC Persistence**: Mandatory UTC standards across MySQL instances to eradicate timezone variances for remote participants.

## 📚 Documentation Archive

- **[Technical Architecture Document (TAD) v1.0](./CAS_Technical_Architecture_Document.md)**: Details the architectural decisions, deployment topologies, and technical resolution strategies for high-concurrency and data consistency.
- **[Product Requirements Document (PRD) v4.0](./CAS_Product_Requirements_Document_v4.0.md)**: Contains exhaustive UI/UX functional breakdowns, role-permission matrices, and behavioral flows for all portals.

---
*Developed for the core Capstone Team curriculum framework.*