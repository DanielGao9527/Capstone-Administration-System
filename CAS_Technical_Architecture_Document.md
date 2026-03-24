# Capstone Administration System (CAS) - Technical Architecture Document (TAD) v1.0

| Project Name | Capstone Administration System (CAS) | Document Status | Finalized Architecture (V1.0) |
| :--- | :--- | :--- | :--- |
| **Architecture Lead** | Java Full-Stack Architect | **Deployment Environment** | Microsoft Azure Cloud Platform |
| **Architecture Type** | Frontend/Backend Separation / Modular Monolith | **Date Updated** | 2026-03-24 |

---

## 1. Architecture Overview

Considering the business volume and user scale of the CAS system (serving students, faculty, and external sponsors within a single university), the system deliberately **avoids overly complex microservices architectures**. Instead, it adopts a **Frontend/Backend Separated Modular Monolith Architecture**.

This strategy guarantees high development efficiency and low maintenance costs, while achieving high availability and seamless upgrades through a Cloud-Native deployment model.

---

## 2. Core Technology Stack Matrix

The system fully embraces the enterprise-grade "React + Spring Boot" full-stack ecosystem to ensure long-term maintainability and scalability.

### 2.1 Frontend

* **Core Framework:** React + TypeScript (Strict typing to minimize runtime errors).
* **UI & Styling:** TailwindCSS (Utility-first CSS) + Ant Design (Enterprise-class out-of-the-box UI components for tables and forms).
* **State Management & Networking:** Zustand (Lightweight state management) + Axios.

### 2.2 Backend API Services

* **Core Framework:** Spring Boot 3.x + Java 21 (Leveraging Virtual Threads for high concurrency scenarios).
* **API Paradigm:** Standard RESTful API (JSON payload formatting).
* **Security & Authentication:** Spring Security + JSON Web Token (JWT) + BCrypt password hashing.
* **Data Validation:** Hibernate Validator (Strict backend parameter interception).
* **Content Sanitization:** Jsoup (Robust HTML tag sanitization for rich text fields, e.g., Proposal Backgrounds, to prevent XSS attacks).

### 2.3 Data & Caching Layer

* **Relational Database:** MySQL 8.0 (Storage of core business data).
* **ORM Framework:** MyBatis-Plus (Highly efficient complex SQL and multi-table joining capabilities).
* **Caching Layer:** Redis (Memory caching for high-frequency access data, e.g., Tips & Tricks, globally accessible project lists).

---

## 3. Azure Deployment Topology

The system is built entirely on Microsoft Azure, transitioning from traditional on-premise hosting to a true cloud-native, highly available infrastructure.

* **Frontend Hosting:** **Azure Static Web Apps**
  * Global CDN distribution of React static assets with optimized low-latency access in Sydney.
* **Backend Compute:** **Azure App Service (PaaS)**
  * Hosts the Spring Boot `.jar` runtime environment, supporting robust horizontal auto-scaling based on traffic metrics.
* **Core Storage:** **Azure Database for MySQL (Flexible Server)**
  * Microsoft-managed MySQL cluster featuring automated daily snapshot backups and Point-in-time Restore capabilities, ensuring zero data loss for student grades and matchmaking configurations.
* **In-Memory Cache:** **Azure Cache for Redis**
  * Boosts throughput during high-concurrency scenarios (e.g., moments preceding the Matchmaking submission deadline).
* **Object Storage:** **Azure Blob Storage**
  * Replaces local file storage. Student-uploaded prototypes and Sponsor attachments are directly uploaded to Blob, returning globally unique CDN URLs.

---

## 4. Core Architecture Mechanisms & Technical Solutions

### 4.1 Zero-Downtime Deployment Strategy

* **Business Challenge:** Requiring full system restarts for minor patches disrupts active student sessions.
* **Architectural Solution:** Utilizing **Azure App Service Deployment Slots** to bypass the need for microservices.
* **Implementation Logic:** A "Staging Slot" is allocated alongside the production environment. New builds are deployed to the staging slot for validation. Upon approval, a "Swap" operation is executed, enabling Azure to route traffic seamlessly at the underlying level, thus achieving pure **zero-downtime updates** for the monolithic application.

### 4.2 Concurrency & Conflict Control

* **Challenge 1 (Preemptive Modifications):** Two tutors simultaneously editing the same Tip, causing data override.
  * **Solution:** Implementation of **Optimistic Locking** at the MySQL entity level. A `version` field is utilized during commits; mismatches trigger automatic interception and a prompt: "Data has been modified by another user. Please refresh."
* **Challenge 2 (Burst Concurrency):** High volume of concurrent student submissions (Surveys/Project Votes) during the final hour before deadlines.
  * **Solution:** Integration of **Redis Distributed Locks and Message Queue Peak Shaving**. Submissions are initially queued and validated rapidly within Redis, followed by smooth background thread persistence into MySQL, preventing database connection pool exhaustion.

### 4.3 Timezone Management and Data Consistency

* **Architectural Solution:** To accommodate potential remote international students, all timestamp fields (e.g., `created_at`, `deadline`) in both MySQL databases and Spring Boot entities are **strictly persisted in UTC (Coordinated Universal Time)**.
* **Presentation Logic:** The React frontend automatically detects the user's local browser timezone or explicitly converts it to Sydney Time (AEST/AEDT) for consistent countdowns and uniform display formats, completely eliminating timezone calculation discrepancies.

---
*End of Document*