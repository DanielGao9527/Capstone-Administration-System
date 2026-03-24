太棒了！作为你的架构师导师，我把我们刚才讨论的所有核心决策，正式整理成了这份\*\*《CAS 系统技术架构文档 (TAD) v1.0》\*\*。

这份文档去掉了花里胡哨的废话，直接瞄准“用什么技术”、“怎么解决痛点”以及“怎么上云部署”。你可以直接拿着它和未来的开发团队、或者评审老师交差。

# ---

**Capstone Administration System (CAS) \- 技术架构文档 (TAD) v1.0**

| 项目名称 | Capstone Administration System (CAS) | 文档状态 | 架构定稿 (V1.0) |
| :---- | :---- | :---- | :---- |
| **架构负责** | Java 全栈架构师 | **部署环境** | Microsoft Azure 云平台 |
| **架构类型** | 前后端分离 / 模块化单体架构 | **更新日期** | 2026-03-24 |

## ---

**1\. 总体架构设计 (Architecture Overview)**

鉴于 CAS 系统的业务体量与用户规模（服务于单所高校的师生及外部赞助商），系统明确**拒绝引入过度复杂的微服务架构**，而是采用**前后端分离的模块化单体架构 (Modular Monolith)**。

这种设计既保证了开发效率和极低的运维成本，又通过云原生 (Cloud-Native) 的部署方案实现了高可用性和无缝升级。

## ---

**2\. 核心技术栈选型矩阵 (Technology Stack)**

系统全面拥抱主流的“React \+ Spring Boot”企业级全栈生态，完美替代小型的 Node.js 方案。

### **2.1 前端应用 (Frontend)**

* **核心框架:** React \+ TypeScript (强类型约束，减少低级 Bug)  
* **UI 与样式:** TailwindCSS (原子化 CSS，高效排版) \+ Ant Design (提供开箱即用的企业级表格、表单组件)  
* **状态管理 & 请求:** Zustand (轻量级状态管理) \+ Axios

### **2.2 后端服务 (Backend API)**

* **核心框架:** Spring Boot 3.x \+ Java 21 (利用 Virtual Threads 虚拟线程轻松应对高并发)  
* **API 风格:** 标准 RESTful API (数据交互格式为 JSON)  
* **权限与安全:** Spring Security \+ JWT (JSON Web Token) \+ BCrypt 密码加密  
* **数据校验:** Hibernate Validator (后端严格拦截非法参数)  
* **内容消毒 (防黑客):** Jsoup (针对项目中大量的富文本字段，如 Proposal Background，严格清洗恶意 HTML 标签，防止 XSS 攻击)

### **2.3 数据与缓存层 (Data & Cache)**

* **关系型数据库:** MySQL 8.0 (存储高价值的核心业务数据)  
* **ORM 框架:** MyBatis-Plus (替代 Prisma，极大提升复杂 SQL 查询与多表联查的开发效率)  
* **缓存数据库:** Redis (存储高频访问的热点数据，如 Tips 列表、全量项目列表缓存)

## ---

**3\. Azure 云部署拓扑架构 (Azure Deployment Topology)**

系统全面基于 Microsoft Azure 构建，抛弃传统的“本地服务器硬盘存储”思维，实现真正的云原生高可用。

* **前端托管:** **Azure Static Web Apps**  
  * React 静态文件全球 CDN 分发，悉尼本地极速访问。  
* **后端计算:** **Azure App Service (PaaS)**  
  * 托管 Spring Boot 的 .jar 运行环境，支持按流量自动横向扩容 (Auto-scaling)。  
* **核心存储:** **Azure Database for MySQL (Flexible Server)**  
  * 微软托管的 MySQL 集群，自带每日快照备份，支持时间点恢复 (Point-in-time Restore)，确保学生成绩与匹配数据绝对安全。  
* **缓存加速:** **Azure Cache for Redis**  
  * 提升高并发场景（如 Matchmaking 提交截止前）的吞吐量。  
* **文件对象存储:** **Azure Blob Storage**  
  * 取代本地存储。学生上传的原型图、赞助商上传的附件均直传至 Blob，返回全球唯一的 CDN 图片链接。

## ---

**4\. 核心架构机制与痛点解决方案 (Core Mechanisms)**

### **4.1 无缝升级策略 (Zero-Downtime Deployment)**

* **业务痛点:** “改了一点 Bug，不想全盘重启影响学生使用。”  
* **架构方案:** 不上微服务，利用 **Azure App Service 的部署槽 (Deployment Slots)** 技术。  
* **实现原理:** 在生产环境旁开辟一个“预发槽 (Staging Slot)”。新代码部署在预发槽，测试无误后，点击“交换 (Swap)”，Azure 会在底层进行毫秒级的流量路由切换，**实现单体应用的不停机更新**。

### **4.2 高并发与冲突控制 (Concurrency & Conflict Control)**

* **业务痛点 1 (抢占式修改):** 两名导师同时编辑同一个 Tip，导致数据互相覆盖。  
  * **架构方案:** 在 MySQL 表结构中引入 **乐观锁 (Optimistic Locking)**。添加 version 字段，提交时对比版本号，如果版本不一致，直接拦截并抛出异常提示：“数据已被他人修改，请刷新”。  
* **业务痛点 2 (突发高并发):** 截止日前一小时，全校学生同时提交 Survey 或进行 Project Vote。  
  * **架构方案:** 引入 **Redis 分布式锁与消息队列削峰**。学生点击提交后，请求先落入 Redis 进行极速排队验证，再由后台线程平滑地写入 MySQL，防止数据库连接池被打爆。

### **4.3 跨时区数据一致性 (Timezone Management)**

* **架构方案:** 鉴于可能有远程参与的留学生，MySQL 数据库和 Spring Boot 实体类中的所有时间字段（如 created\_at, deadline）**强制统一使用 UTC (协调世界时) 存储**。  
* **展现逻辑:** 由前端 React 获取到用户的浏览器本地时区，或固定转换为悉尼时间 (AEST/AEDT) 进行倒计时和页面展示，彻底杜绝截止时间计算错乱的 Bug。

---

**架构师的下一步建议：**

这份 TAD 骨架已经非常清晰了，它回答了“我们用什么”以及“为什么这么用”。

既然技术底座和架构规约都定好了，我们真正进入开发的“深水区”了。**下一步，我们就该把 PRD 里的业务和 TAD 里的技术结合起来，设计核心的《数据库 ER 图与表结构 (DDL)》了。**

你准备好和我一起设计 **用户表、项目提议表、团队表** 这几个最核心的数据库表了吗？我会教你怎么把“不可修改的 Team Letter”和“一对多关系”在 MySQL 里建出来。