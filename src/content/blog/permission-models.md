---
title: 权限模式设计：RBAC、ABAC、ReBAC 及其组合选型
author: caterpi11ar
pubDatetime: 2026-04-24T10:00:00
featured: false
draft: false
tags:
  - 架构
  - 权限
  - 后端
description: 主流权限控制模式（RBAC / ABAC / ReBAC）的对比与选型指南，综合 Google Zanzibar、Oso、Permify、Evolveum 等海外资料。
---

## 为什么权限这块，起步最简单、失控最快

几乎每个系统上线时的权限都长得差不多：两三个角色、一张用户-角色对照表、中间件里判断一下当前用户是不是管理员就完事了。问题是它很少停在这里。

几个月后常见的情况：

- 权限判断里堆叠的角色名越来越多，一条分支要列四五个才能覆盖所有"管理员变体"
- 每加一个功能就要讨论"这个按钮应该哪个角色能点"，然后新增一个角色
- 客户开始提"我想只让 A 看到他自己负责的订单"、"文件夹里的权限要继承"这类需求
- 员工离职或转岗时，没人说得清他到底还保留哪些访问权

这些信号都指向同一件事：最初那套"角色 → 权限"的模型已经到极限了。业界对这件事已经研究很多年，沉淀出几个主流模式——**RBAC（角色）、ABAC（属性）、ReBAC（关系）**，再加上把三者统一起来的视角 **PBAC（策略）**。

这篇文章把它们各自的适用场景、典型痛点和组合方式梳理一遍，素材以海外资料为主（Google Zanzibar 论文、Oso、Permify、Permit.io、Evolveum 文档等），末尾列出参考链接。文章只讲概念和选型，不涉及代码与数据结构示例。

---

## 一、RBAC：从清爽到臃肿的必经之路

RBAC（Role-Based Access Control）的想法很直接：**把权限挂到"角色"上，把角色分配给"用户"**。用户绑定角色，角色带着一堆权限，判断时只要看用户是不是这个角色即可。

它受欢迎有三个朴素的原因：

1. **符合人的直觉**。岗位 → 权限的映射方式，跟现实组织架构天然对齐。
2. **查询便宜**。基本上是一次哈希或索引查询，O(1) 级别。
3. **上手快**。一张用户表、一张角色表、一张中间表，十分钟能画出来。

它也有非常明确的适用场景：**岗位职能稳定、权限按职能聚合、不太涉及资源级分享**。典型代表是公司内部的后台管理系统、ERP、财务系统——这些系统的权限模型本身就是"职位说明书"的数字化。

RBAC 之前其实还有一个更原始的模式叫 ACL（Access Control List），直接把权限挂到每个资源上列白名单。RBAC 可以看成是对 ACL 的一次聚合：与其给每个资源维护一张人员名单，不如维护一个"谁能做什么"的角色，再把角色塞给人。

### Role explosion：RBAC 最常见的病

RBAC 一旦遇到**多维度叠加**就会开始膨胀。业界把这个现象叫 *role explosion*（角色爆炸），Evolveum 的文档对它的描述很精准：**笛卡尔积问题**。

举个常见的例子。银行里有三种岗位：柜员、主管、分行行长。在伦敦、柏林、布拉迪斯拉发三个城市运营。于是我们需要：伦敦柜员、伦敦主管、伦敦行长、柏林柜员……一共 9 个角色。如果再加一个"项目组"维度，就是 27 个；再加"数据敏感级别"，就是 81 个。

真实公司的情况通常更糟，因为角色还有另一个"不死"的特性——**几乎没人会去删它**。Evolveum 的原文大意是：角色创建出来以后，最多是往里加权限，但删除一个角色意味着要去逐个排查受影响的用户，成本太高，所以大家都选择视而不见。久而久之，系统里堆积的是一座权限化石博物馆。

这个问题的直接后果是安全风险。2013 年美国零售商 Target 被攻破，攻击者最初的入口是一家供应商（空调维保商）的凭证——这家供应商在 Target 系统里的权限远远超过它实际需要的范围。Permify 在分析这个案例时指出：这就是典型的角色过度聚合，本来该给的是"提交工单"的能力，实际给出去的是大半个内网。

### RBAC 什么时候开始扛不住

几个典型信号：

- **资源级分享需求**。比如"我想把这个文档分享给某个外部用户"——RBAC 解不了，因为角色是全局的。
- **租户隔离**。SaaS 场景下每个租户的"管理员"彼此互不越权，RBAC 做起来得在每个判断里再嵌一层租户过滤，很丑。
- **临时授权**。"周末让 X 代替 Y 审批一下"——角色模型没有"有效期"这种概念。
- **动态条件**。权限要随时间、位置、设备状态变化时，RBAC 完全无能为力。

当这些需求出现时，继续往 RBAC 里加角色只会让 role explosion 雪上加霜。到这一步，就该考虑下面两条路径了。

---

## 二、ABAC：把策略从代码里抽出来

ABAC（Attribute-Based Access Control）的出发点是：**别再把判断逻辑写成角色**，而是**根据一组属性去评估策略**。它关注的属性通常有四类：

- **Subject（主体）**：用户的部门、职级、所在地域、入职时间
- **Resource（资源）**：文件的分类、敏感级别、所属部门
- **Action（动作）**：读、写、导出、分享
- **Environment（环境）**：当前时间、IP 网段、设备是否合规、是否走了 VPN

判断语句更像自然语言："**财务部**的员工，在**工作时间**内，使用**公司设备**，可以**读取**本部门**非机密**的报表"。这句话里每一个加粗词都是一个属性。

### XACML 的经典四组件

NIST SP 800-162 和 OASIS 的 XACML 标准定义了一套职责分离架构，是理解 ABAC 绕不开的基础：

| 组件 | 全称 | 职责 |
|------|------|------|
| PEP | Policy Enforcement Point | 拦截请求、执行判断结果 |
| PDP | Policy Decision Point | 根据策略做决策，返回 Permit/Deny/NotApplicable/Indeterminate |
| PAP | Policy Administration Point | 管理和分发策略 |
| PIP | Policy Information Point | 提供属性值（用户信息、资源信息、环境信息） |

这套架构最大的价值不在于 XML（XACML 的 XML 语法恶名昭彰），而在于**把"如何判断"从业务代码里剥离出来**。业务代码只负责在入口处调用 PEP，策略在独立的服务里集中治理。

### OPA 是怎么"偷走"了 ABAC

真正让 ABAC 走进现代后端的，是 Open Policy Agent（OPA）和它的策略语言 Rego。XACML 的 XML 过于笨重，写起来像上世纪的企业级 Java；OPA 用 JSON + 声明式的 Rego，跟云原生栈无缝贴合，最后变成了 Kubernetes 策略控制器的事实底层。

它和 XACML 的差别不是理念，而是工程形态：

- **XACML**：成熟的企业标准，偏 API 中心、面向合规场景，代表引擎是 AuthZForce、Axiomatics、NextLabs
- **OPA/Rego**：云原生取向，面向基础设施（Kubernetes、Envoy、CI/CD），策略代码可版本化、可测试

两者的共同点是：**都在实践 ABAC 的核心模式——从属性中做决策**。

### ABAC 的真实痛点

ABAC 很强，但它不是免费的。Oso 和几家授权厂商在总结经验时反复提到：

- **属性源治理难**。每个属性背后都有一个来源系统，来源不统一、时效不一致时，决策结果就会漂移。一个员工的部门已经调整，但 HR 系统和 AD 还没同步，PDP 就会基于旧属性做出错误的允许。
- **策略调试难**。一条策略可能引用了十几个属性，测试用例写起来很长，调查"为什么这个请求被拒绝"往往要打开 PDP 的执行日志逐条看。
- **审计路径长**。"为什么 A 能访问 X"的回答不再是"他是管理员"，而是"他属于财务部 + 当前时间在工作时段 + 设备合规 + 资源等级不超过 3"，这对合规审查和事故复盘都是新的挑战。

所以 ABAC 真正值得上的场景，是那些**本身就要求细粒度动态决策**的业务：强合规行业（金融、医疗、军工）、零信任架构、跨系统的统一策略层。如果只是想解决"用户能不能改别人的订单"，ABAC 是牛刀。

---

## 三、ReBAC：Google Zanzibar 带火的关系图

ReBAC（Relationship-Based Access Control）换了一个完全不同的视角：**权限由 subject 和 resource 之间的关系决定**。不是看"他是不是管理员"，而是看"他和这个东西是什么关系"。

这个视角在协作类产品里非常自然。Google Drive 里一个文件的权限可以是："我是 owner"、"我是这个文件所在文件夹的 editor"、"我是这个文件夹所属团队的 member"。这里没有一个叫"编辑角色"的全局东西，权限是沿着关系图一步步传递过来的。

### Google Zanzibar 是怎么工作的

Google 在 2019 年 USENIX 上发表了 Zanzibar 论文，这篇论文几乎是现代 ReBAC 的教科书。核心抽象只有一个——**关系元组（relation tuple）**：用三段式描述一条关系——"某个对象"、"有某种关系"、"指向某个用户或群组"，读起来就像"user 对 object 有某种 relation"。

举几个常见的例子：alice 是某份报销单的 editor；bob 是 engineers 组的成员；再往上一步，engineers 组本身又是这份报销单的 editor。

最后那一层是 Zanzibar 的精髓：**元组可以指向另一个元组**，关系因此可以嵌套、可以组合。判断"bob 能不能编辑报销单"时，系统沿着文档 → 所属群组 → 群组成员的图往下走，走得通就允许。

Zanzibar 在工程上的几个关键设计：

- **Namespace 配置**：每类对象（document、folder、group）有自己的命名空间和关系定义，相当于 schema。
- **超大规模**：Google 公开的数字是超过 2 万亿条关系元组、每秒千万级请求、p95 延迟小于 10ms，支撑 Drive、Photos、YouTube、Calendar 等等。
- **Zookie 协议**：为了解决"新旧权限与新旧资源的时序一致性"问题（论文里叫 New Enemy Problem），每次权限变更会生成一个叫 zookie 的 token，后续请求带上它，保证不会用旧策略判断新资源。

### 开源继承：SpiceDB 和 OpenFGA

Zanzibar 本身是 Google 内部系统，但论文出来后开源世界很快跟上，目前两个主流实现：

- **SpiceDB**（Authzed）：支持多种数据库（PostgreSQL、CockroachDB、Spanner），提供了比 protobuf 更友好的 schema 语言，把用户也建模为图中的对象，支持更复杂的委托场景。
- **OpenFGA**（Auth0/Okta）：2025 年 10 月被 CNCF 接纳为孵化项目，生态成长很快，贡献者一年增长约 49%，目标是成为"FGA（Fine-Grained Authorization）领域的通用基础设施"。

### ReBAC 的强项和代价

它天然解决 role explosion：**不需要为"伦敦柜员"这种维度组合新建角色**，因为那不是一个角色，而是一组关系（user 属于 london 分行 + 担任 teller 职位）。协作型 SaaS 里的"嵌套共享"、"继承权限"、"按资源分享"这些老大难问题，在 ReBAC 下都变成了"在图里连一条边"。

代价也很直接：

- **建模门槛高**。团队第一次写 Zanzibar schema 时普遍会卡住，因为大家习惯了"用户-角色"的扁平思维，换成"对象-关系"的图思维需要时间。
- **查询更重**。虽然 Zanzibar 在 Google 内部做到了 10ms p95，但普通团队如果没有那种基础设施，图遍历的成本会明显高于 RBAC 的一次索引查询。
- **属性表达弱**。ReBAC 本身不是为动态属性设计的，处理"工作时间内"、"仅限合规设备"这种条件时，还是要借助 ABAC 的思路。

ReBAC 适合的场景很清晰：**文档/文件夹/团队嵌套共享、多租户资源归属、协作型 SaaS 的细粒度分享**。如果系统没有这类需求，直接上 ReBAC 就是过度设计。

---

## 四、三种模式怎么选：一张决策表

在真实项目里，一个偷懒但有效的判断方法是：**问自己几个问题，信号指向哪里就选哪里**。

| 问题 | 典型信号 | 推荐模式 |
|------|----------|----------|
| 角色是否稳定且可枚举？ | 岗位清晰、内部后台系统 | RBAC 起步 |
| 是否需要资源级分享、嵌套继承？ | 文件夹、团队、项目层级 | ReBAC |
| 决策是否依赖动态上下文？ | 时间、位置、设备、合规级别 | ABAC |
| 是否需要跨系统的统一策略治理？ | 多服务、审计要求、零信任 | ABAC + PDP（OPA 或 XACML） |
| 租户 × 资源 × 关系都复杂吗？ | 协作型 SaaS、B 端 C 端混合 | ReBAC 为主、RBAC 做默认 |

再具体一些，几个自检问题有助于判断当前阶段：

1. 最近三次新增的功能里，是否有两次都伴随着"新增一个角色"？
2. 代码里有没有出现"先判断角色、再叠加一个资源归属条件"这种混合判断？
3. 客户或产品有没有提过"我想把这个**具体的东西**分享给某个**具体的人**"？
4. 是否出现过因为属性（部门、状态）过期或不同步导致的权限误授/误拒？
5. 离职或转岗时权限清理是靠脚本，还是靠手动排查？

命中越多，说明 RBAC 已经到瓶颈，是时候引入 ABAC 或 ReBAC 的某一面。

---

## 五、生产上其实没人单选：混合模型才是答案

Oso、Permit.io、Permify 等厂商在 2025—2026 的行业综述里几乎口径一致：**这三种模式不是互斥选项，而是分层叠加的积木**。

一个成熟生产系统常见的形态是：

- **RBAC 定默认**：大部分"岗位级"权限继续用角色表达，减少噪音
- **ReBAC 管资源**：具体到单个文档、文件夹、订单的分享和继承，用关系图
- **ABAC 做兜底**：在最外层加一条"不管前面怎么允许，只要不满足合规约束，就拒绝"

这种叠加的统称是 **PBAC（Policy-Based Access Control）**——它不是第四种模式，而是"把前三种模式纳入同一个策略引擎"的视角。这也是 OPA 和 XACML 这类 PDP 真正的价值：**它们不在乎底层用什么模式，只负责把决策集中起来**。

### 生态正在标准化

两个值得关注的动向：

- **OpenFGA 2025 年 10 月成为 CNCF 孵化项目**。这意味着"授权"作为独立基础设施的地位，正在向"日志、监控、配置中心"那样被标准化。
- **OpenID AuthZEN 1.0 在 2026 年 1 月成为 Final Specification**。AuthZEN 定义了 PDP 和 PEP 之间的通信协议，类似 OIDC 之于认证。有了它，换授权引擎或同时接入多个系统，会比今天容易很多。

这两个动作背后的信号很一致：**授权正在从"每个应用自己写一套"，变成"调用外部服务"的模式**。对应用层来说，长期看"怎么调用"会比"怎么自建"更重要。

---

## 六、写在最后

没有银弹，但有演化路径：

- **一开始不要过度设计**。两三个角色的 RBAC 足够撑很久，真正需要 ABAC 或 ReBAC 时，你会从信号里感受到。
- **识别信号，而不是追潮流**。代码里频繁出现"判断角色 + 叠加条件"的混合分支、产品需求开始谈"分享"和"继承"、审计要求开始谈"为什么"而不只是"是谁"——这些都是重构的契机。
- **好的权限模型不取决于技术先进度**，而取决于**它和业务心智是否对齐**。如果业务方说"所有主管都能看本部门数据"，那 RBAC 就是对的；如果业务方说"这个文件夹的权限要继承给子文件夹"，那 ReBAC 就是对的。

权限是系统里少数几个"加起来容易、减下去难"的模块。少设计比多设计更重要，演化比一次到位更重要。

---

## 参考资料

以下英文资料是本文的主要素材来源：

1. [RBAC vs ABAC vs ReBAC: How to Choose and Implement Access Control Models — DEV Community](https://dev.to/kanywst/rbac-vs-abac-vs-rebac-how-to-choose-and-implement-access-control-models-3i2d)
2. [RBAC vs ABAC vs PBAC: Understanding Access Control Models in 2025 — Oso](https://www.osohq.com/learn/rbac-vs-abac-vs-pbac)
3. [RBAC vs ABAC vs ReBAC: What is the best access policy paradigm? — Oso](https://www.osohq.com/learn/rbac-vs-abac-vs-rebac-what-is-the-best-access-policy-paradigm)
4. [RBAC vs ABAC & ReBAC: Choosing the Right Authorization Model — Permit.io](https://www.permit.io/blog/rbac-vs-abac-and-rebac-choosing-the-right-authorization-model)
5. [An Introduction to Google Zanzibar and Relationship-Based Authorization Control — Authzed](https://authzed.com/learn/google-zanzibar)
6. [Google Zanzibar — Wikipedia](https://en.wikipedia.org/wiki/Google_Zanzibar)
7. [Relationship-based access control — Wikipedia](https://en.wikipedia.org/wiki/Relationship-based_access_control)
8. [Role Explosion — Evolveum Docs](https://docs.evolveum.com/iam/role-explosion/)
9. [Role Explosion: The Hidden Cost of RBAC — Permify](https://permify.co/post/role-explosion/)
10. [Access Control Systems — Open Policy Agent](https://www.openpolicyagent.org/docs/comparisons/access-control-systems)
11. [Guide to Attribute Based Access Control (ABAC) — NIST SP 800-162](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-162.pdf)
12. [XACML — Wikipedia](https://en.wikipedia.org/wiki/XACML)
