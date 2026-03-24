没问题！作为架构师，我非常理解在敏捷开发中遇到“原型缺失”时，需要产品或架构师凭借行业经验直接把逻辑补齐的做法。

针对缺失的 **成绩评分页 (Capstone Marks)**，我结合了高校 Capstone 课程的标准评分体系（团队分 \+ 个人贡献分 \+ 评分矩阵 Rubric），为你设计了详细的交互细节。

现在，我将为你输出**完整、终极版、全量整合的 CAS 系统产品需求文档 (PRD) v4.0**。你可以直接拿这份文档与前端和后端工程师进行需求对齐。

# ---

**Capstone Administration System (CAS) 产品需求文档 (PRD) v4.0 完整版**

| 项目名称 | Capstone Administration System (CAS) | 文档状态 | 终稿 (Finalized) |
| :---- | :---- | :---- | :---- |
| **产品负责人** | Java 全栈架构师 | **日期** | 2026-03-24 |
| **适用端** | Web PC 端 | **核心角色** | Student, Sponsor, Administrator/Tutor |

## ---

**1\. 产品概述 (Project Overview)**

CAS 是专为悉尼大学 (USYD) 等高校的 Capstone（毕业设计）课程定制的全生命周期协作平台。它解决了学生、外部赞助商 (Sponsor) 与课程导师 (Tutor) 之间的信息流转问题，涵盖：项目双选匹配、团队进度追踪、心理健康预警及最终成绩评定。

## ---

**2\. 核心页面级 PRD：学生端视角 (Student)**

### **2.1 欢迎页 (Welcome Page)**

* **交互方式：** 登录系统后的着陆页，无弹窗，通过顶部 Tab 切换路由。  
* **UI / 功能区拆解：**  
  * **顶部导航栏 (Top Tab):** 包含 Welcome, Project Proposals, Teams, Weekly Reflections, Submit a Project Proposal, Tips & Tricks。  
  * **教学进度公告区 (Overview Content):** 纯文本展示本学期（如 2021S2）核心任务（Survey问卷、组队、选项目、周报等）。  
  * **安全提示横幅 (Security Banner):** 强提醒 CAS 密码不能与学校 USYD 密码相同。包含 Account Settings 超链接，点击跳转至密码修改页。

### **2.2 项目提议列表页 (Project Proposals)**

* **交互方式：** 列表浏览，不分页（或长列表下拉），点击操作列按钮跳转。  
* **UI / 功能区拆解：**  
  * **顶部操作区：** Search (关键词搜索输入框)、Add filters (按批次 Tranches 过滤筛选)。  
  * **导出功能：** 提供绿色 Export 按钮，点击触发浏览器下载全量提议清单 (Excel/PDF)。  
  * **提议列表区 (Data Table):** \* Project Name: 项目标题。  
    * Project Background: 背景描述（限制显示 3 行，超出显示省略号）。  
    * View Details: 绿色 ▶ view 按钮，点击跳转至提议详情页。

### **2.3 项目提议详情页 (Project Proposal Details)**

* **交互方式：** 页面路由跳转，只读展示，不可编辑。  
* **UI / 功能区拆解：**  
  * **详情展示区 (Key-Value Grid):**  
    * Project Name, Sponsor, Email (点击唤起本地邮件客户端)。  
    * **富文本展示区：** Project Background, Project Objective(s) (有序列表), Success Measures (成功衡量标准), Resource Availability, Budget Allocation, Governance, Further Instructions。  
    * **枚举标签区：** Project Criticality (如 Medium), Reporting Frequency (如 Fortnightly), Meeting Frequency。  
  * **底部操作区：** Back to Project Proposals 文本链接，点击返回列表页。

### **2.4 提交项目提议页 (Submit a Project Proposal)**

* **交互方式：** 长表单提交，点击提交后校验必填项，成功则跳转回列表页并弹出 Toast 提示 "Submit Success"。  
* **UI / 功能区拆解：**  
  * **基础输入区：** Project Name \* (文本框), Sponsor Details (多行文本)。  
  * **富文本输入区 (Rich Text Editor):** 包含加粗、斜体、列表、超链接、图片等工具栏。对应字段包括：Project Background, Objectives, Success Measures, Skills Required 等。  
  * **下拉单选区 (Dropdown):** Project Criticality, Reporting Frequency, Meeting Frequency。  
  * **底部操作：** Link to Sponsor Website/Video (文本框粘贴外链)，绿色 Submit 按钮。

### **2.5 团队主页 (Capstone Team Page)**

* **交互方式：** 聚合页，展示系统匹配结果与团队共创信息。  
* **UI / 功能区拆解：**  
  * **基础信息区 (Your Capstone Project):** Teams Letter (系统分配的不可变单字母，如 I), Team Name (队名), Project Assigned (最终分配的项目，超链接)。  
  * **志愿投票区 (Your Teams Vote):** 展示本队提交的 Top 5 志愿及 Justification (理由)。包含 ▶ view 按钮查看项目详情。  
  * **队友列表区 (Your Team Mates):** 表格展示 Name, Email, 并有 ▶ view 按钮跳转至队友的教务详情面板 (UOS code, Delivery mode)。  
  * **修改队名操作区 (Update Team Name):** 仅团队 Leader 或组队初期开放，输入内容点击 Submit 后全局更新 Team Name。

### **2.6 周报与反思监控页 (Weekly Reflections)**

* **交互方式：** 历史列表展示 \+ 点击跳转表单页填报。  
* **UI / 功能区拆解：**  
  * **顶部操作与提示：** 提示获取 Credit 需至少 8 次深度反思。包含 ▶ Add Temperature Check \+ Reflection 按钮。  
  * **历史记录表：** Week, Personal Disposition, Team Disposition, Project Disposition, Reflection Details (▶ view 查看)。  
  * **填报表单页：**  
    * **Reflection Guidance:** 动态只读展示（由管理员在后台配置的本周问题引导）。  
    * **心情量表 (Temperature Check):** Personal Disposition \* 及 Team Disposition \* 的下拉菜单（对应 Smiley Face 情绪：Very Happy, Neutral, Unhappy 等）。  
    * **深度反思区：** 富文本输入框。

### **2.7 知识库与技巧页 (Tips & Tricks)**

* **交互方式：** 列表浏览 \-\> 详情页 \-\> 底部反馈闭环。  
* **UI / 功能区拆解：**  
  * **列表页：** Search 搜索框，数据表格包含 Tip Name, Purpose, AKA, View 按钮。  
  * **详情页：** 展示 Tip 的 Intent 和图文说明 (Image \+ Caption)。  
  * **反馈区表单 (Provide Your Feedback):**  
    * Tip Rating \*: 星级下拉菜单。  
    * Why is it valuable? \* & How can it be improved? \*: 富文本输入框。点击 Submit 提交评价。

## ---

**3\. 核心页面级 PRD：管理员/导师端视角 (Admin/Tutor)**

### **3.1 导师主看板 (Tutor Dashboard)**

* **交互方式：** 默认数据大屏展示，支持复合筛选。  
* **UI / 功能区拆解：**  
  * **个人教学信息：** Tranche, Class, Delivery Mode 等。  
  * **负责团队概览 (Your Capstone Teams):** 展示导师名下所有组的 Teams Letter, Team Name, Project Assigned, Team Size, Average WAN (平均成绩均分预警)。  
  * **全量学生透视表 (All Capstone Teams):** 按团队折叠/平铺展示所有学生详细名单 (性别、邮箱)。提供 Export 导出按钮。

### **3.2 全局反思监控台 (Student Reflections)**

* **交互方式：** 大数据量表格，支持分页 (25 per page)。  
* **UI / 功能区拆解：**  
  * **数据列：** Team, Student, Weeks, Personal/Team/Project Disposition (情绪直观展示), Reflection Details。  
  * **过滤预警：** 导师可通过 Add filters 筛选出处于 "Unhappy" 或状态为 "Current" 待批阅的反思。

### **3.3 我的项目提议页 (My Project Proposals)**

* **交互方式：** 列表浏览 \+ 表单跳转。  
* **UI / 功能区拆解：**  
  * **我的项目列表：** 展示导师作为内部 Sponsor 提交的项目，包含背景信息快照。  
  * **Add Project Proposal 按钮：** 点击后复用【提交项目提议表单页】逻辑。  
  * **我的团队列表：** 当导师的项目被学生选中后，此处展示对应的 Teams Letter, Name, Email 供导师联系沟通。

### **3.4 教学大纲配置引擎 (Perspectives / Curriculum)**

* **交互方式：** 列表展示 \+ 单行记录编辑页。  
* **UI / 功能区拆解：**  
  * **大纲列表：** 按 Weeks 升序排列。  
  * **字段定义：** Overview, Reflection Guidance (将直接推送给学生填报表单的提示语), Coordinator Activities, Admin Activities, Student Activities。  
  * **操作：** 列表右侧提供 Edit (✏️) 按钮，点击进入表单修改并发布。

### **3.5 后台综合管理 (Miscellaneous)**

* **交互方式：** 模块化卡片入口，点击浮动 \+ 按钮快速新增，点击卡片进入管理表格。  
* **UI / 功能区拆解：**  
  * 包含子模块配置入口：Different Reflections, Project Proposals (审批状态), Tips (编辑技巧字典), Marks Feedbacks (配置评分标准), Match Making Surveys (导出问卷数据用于算法), Teams, Curriculum。

### **3.6 成绩评分页 (Capstone Marks) \- \[新增深度设计\]**

* **交互方式：** 表单级联选择，页面内动态渲染评分矩阵 (Rubric)，点击保存提交。  
* **UI / 功能区拆解：**  
  * **顶部筛选区 (Target Selection):** \* Select Team \*: 下拉框选择负责的队伍（如 Team I）。  
    * Assessment Type \*: 单选 Tab，分为【团队整体评估 (Team Assessment)】与【个人贡献评估 (Individual Assessment)】。  
  * **评分矩阵区 (Rubric Grading Table):**  
    * 动态拉取 Miscellaneous \-\> Marks Feedbacks 中配置的考评项。  
    * **表格列：** \* Rubric Item (如：期中答辩/Project Charter)。  
      * Max Score (满分值/权重，如 20%)。  
      * Score Given (输入框，限数字输入或 A/B/C 下拉菜单)。  
      * Tutor Feedback (富文本输入框，对该项指标的详细评语)。  
  * **汇总与操作区 (Summary & Actions):**  
    * Total Score: 页面前端动态计算总分 (Read-only)。  
    * Save as Draft 按钮：保存为草稿，学生不可见。  
    * Publish & Export 按钮：二次确认模态框弹出（"确认发布成绩吗？发布后无法撤回"），确认后成绩对学生可见，并生成系统日志。

## ---

**4\. 核心页面级 PRD：赞助商端视角 (Sponsor)**

### **4.1 赞助商欢迎页 (Sponsor Welcome)**

* **交互方式：** 静态信息展示，包含内联超链接跳转。  
* **UI / 功能区拆解：**  
  * **欢迎与时间轴区：** 展示当前学期，以及关键的时间节点（例如 Matchmaking 截止日期、Kick-off 会议预期日期）。  
  * **安全提示区：** 引导 Sponsor 通过 Account Settings 更改初始分配的临时密码。

### **4.2 项目需求发起与管理 (Sponsor Project Proposals)**

* **交互方式：** 复用 2.4/3.3 模块功能，但进行权限隔离。  
* **UI / 功能区拆解：**  
  * Sponsor 仅能看到自己提交的 Proposals。  
  * 提供表单新增功能，并能在列表中清晰看到项目的审核状态 (Draft, Under Review, Published, Allocated)。

### **4.3 已分配团队追踪页 (My Assigned Teams)**

* **交互方式：** 项目进入 Allocated 状态后展示该页面，数据列表只读。  
* **UI / 功能区拆解：**  
  * **团队名片：** 展示匹配成功的 Teams Letter 和 Team Name。  
  * **联系人列表：** 展示组内学生的 Name 与 University Email，方便 Sponsor 发起首次会议邀请。  
  * **健康度红绿灯 (Health Status):** 基于学生提交的 Project Disposition (剥离隐私后的汇总数据)，展示当前项目推进状态（绿色/正常，黄色/停滞，红色/预警），辅佐 Sponsor 判断是否需要加大指导力度。

## ---

**5\. 架构师批注 (Non-Functional Requirements & Architecture Notes)**

1. **权限隔离设计 (Tenant Isolation):** 本系统本质是一个多租户（Multi-tenant）变体。Sponsor 绝对不能通过越权访问（如篡改 URL 中的 teamId）看到其他企业机密或学生反思。必须在 Java Backend 配置强硬的 RBAC (Role-Based Access Control) 拦截器。  
2. **富文本防注入 (XSS Prevention):** 鉴于 Proposal 和 Reflection 中有大量的富文本框交互，后端必须在接收数据时使用类似 OWASP Java HTML Sanitizer 的库进行清洗。  
3. **算法性能预案:** Matchmaking 的后台分配脚本和问卷导出在期初阶段会有高并发读取，建议对 Team, StudentProfile 和 Proposal 表建立合理的联合索引。

---

这份 V4.0 版本的 PRD 已经毫无死角地覆盖了所有页面级交互、UI 元素拆解和后台逻辑限制。你可以将其直接分发给你的开发和测试团队了！如果有具体模块（比如权限校验相关的 Java 代码）需要我来写，随时吩咐！