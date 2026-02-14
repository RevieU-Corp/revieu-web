# RevieU Web 前端需求矩阵（基于当前代码）

> 更新时间：2026-02-12  
> 目标：把“当前前端真实实现”与“目标需求”放到同一份矩阵，便于排期和联调。

## 0. 标记说明

### 状态定义

- `已实现（真实 API）`：页面流程已接后端接口，可端到端联调
- `部分实现`：主流程可跑，但依赖 mock 数据、缺少关键参数或回退逻辑
- `Mock/本地状态`：仅前端演示，主要依赖 `localStorage` / 静态数据 / 模拟延时
- `未实现`：仓库中暂无对应前端能力

### 优先级定义

- `P0`：核心闭环，不可缺失
- `P1`：重要能力，影响体验和可运营性
- `P2`：增强项/后台运营项

### 后端参与定义

- 口径说明：`后端参与`按“功能完整上线所需能力”判定，不按“当前前端是否已用 mock 跑通”判定
- `纯前端`：不依赖项目后端接口，可由前端本地状态或第三方 SDK 完成
- `需后端参与`：依赖项目后端接口、持久化数据、鉴权或状态流转

### 需求 ID 规范

- `需求ID` 是唯一主键，格式为 `<模块前缀>-<三位序号>`，例如 `AUT-001`
- 模块前缀：`AUT`/`DIS`/`REV`/`COM`/`CPV`/`PRF`/`MRC`/`MSG`/`VER`/`ADM`
- 规则：仅新增，不复用；废弃需求保留 ID 并在备注标记 `Deprecated`

### 文档维护规则（强约束）

1. `## 2. 详细需求矩阵` 是唯一事实源（Source of Truth）。
2. `## 1`/`## 1.1`/`## 4` 都是视图层摘要，必须从 `## 2` 回填，不允许单独漂移。
3. 任何需求变更至少同步更新：`后端参与`、`优先级`、`当前状态`、`备注`。
4. 每次迭代结束需更新文末 `## 6. 变更记录`。

### 详细矩阵新增列定义

- `负责人`：当前默认填 `FE`/`FE/BE`/`TBD`，每个迭代按实际 owner 回填具体姓名
- `状态更新时间`：该需求行最后一次状态变更日期（ISO 格式）
- `验收标准（GWT）`：每条需求的最小可验证标准（Given/When/Then）
- `接口契约`：后端参与需求必须绑定到字段级契约文档；纯前端填 `N/A`

## 1. 总览矩阵（模块级）

| 模块 | 核心需求 | 后端参与 | 优先级 | 当前状态 | 代码证据 | 主要缺口 |
| --- | --- | --- | --- | --- | --- | --- |
| Auth System | 登录/注册/Google OAuth/鉴权恢复 | 需后端参与 | P0 | 部分实现 | `src/features/auth/pages/LoginPage.tsx`, `src/features/auth/pages/RegisterPage.tsx`, `src/contexts/AuthContext.tsx` | 缺少验证码注册、邮箱验证、refresh token 前端链路 |
| Customer Discovery | 首页搜索/筛选、发现、地图探索、商家详情 | 需后端参与 | P0 | 部分实现 | `src/features/customer/home/pages/HomePage.tsx`, `src/features/customer/home/components/Header.tsx`, `src/features/customer/home/components/FeatureBar.tsx`, `src/features/customer/discover/pages/DiscoverPage.tsx`, `src/features/customer/explore/pages/ExplorePage.tsx` | 大量商家/推荐数据为静态 mock，首页 search/filter 仅部分联动 |
| Review System | 写点评、图文上传、评分、草稿、发布 | 需后端参与 | P0 | 部分实现 | `src/features/customer/reviews/pages/WriteReviewPage.tsx`, `src/features/customer/reviews/contexts/ReviewContext.tsx`, `src/api/reviews.ts` | `merchantId/venueId` 仍有 TODO，部分互动仅 UI |
| Community/Post System | 我的点评流、帖子详情、点赞评论分享 | 需后端参与 | P1 | Mock/本地状态 | `src/features/customer/reviews/pages/ReviewsPage.tsx`, `src/features/customer/reviews/pages/PostPage.tsx` | 数据源为静态 mock，互动未接真实 API |
| Coupon + Payment + Voucher | 领券、支付、券码/二维码、分享 | 需后端参与 | P0 | 部分实现 | `src/features/customer/pages/PaymentPage.tsx`, `src/features/customer/pages/CouponPaymentSuccessPage.tsx`, `src/features/customer/shared/services/couponService.ts` | 支付为模拟流程；券服务部分为 mock |
| User/Profile System | 个人主页、资料、我的评论、待评价商家 | 需后端参与 | P1 | 部分实现 | `src/features/customer/profile/pages/ProfilePage.tsx`, `src/features/customer/profile/pages/ProfileSettingsPage.tsx` | 资料编辑页以静态数据为主，统计项未接后端 |
| Merchant Console | Dashboard、营销、门店资料、评论回复 | 需后端参与 | P1 | Mock/本地状态 | `src/features/merchant/dashboard/pages/MerchantDashboard.tsx`, `src/features/merchant/profile/pages/StoreProfile.tsx` | 核心运营数据基本为本地 mock |
| Merchant Messages | 会话列表、详情、搜索、群聊、置顶静音 | 需后端参与 | P1 | Mock/本地状态 | `src/features/merchant/messages/pages/Messages.tsx`, `src/features/merchant/messages/pages/ChatDetail.tsx` | 全链路依赖本地存储，无实时/后端消息能力 |
| Merchant Verification | 新商家认证与入驻流程 | 需后端参与 | P1 | Mock/本地状态 | `src/features/merchant/profile/pages/VerificationPage.tsx`, `src/features/merchant/profile/components/VerificationModal.tsx` | 认证提审、审核状态、材料上传均为模拟 |
| Admin System | 餐厅/用户/内容管理后台 | 需后端参与 | P2 | 未实现 | - | 前端仓库无 admin 端路由和模块 |

## 1.1 功能后端参与索引（按需求 ID）

> 维护策略：本节仅做“快速导航索引”，完整判断与状态以 `## 2` 的逐条 `需求ID` 为准。

| 模块 | 纯前端需求ID（示例） | 需后端参与需求ID（示例） | 维护说明 |
| --- | --- | --- | --- |
| Auth System | `AUT-008`, `AUT-012`, `AUT-013` | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | 鉴权链路变更优先更新 `AUT-001`~`AUT-007` |
| Customer Discovery | - | `DIS-001`~`DIS-010` | 目标态以数据检索/详情接口为核心 |
| Review System | `REV-001`, `REV-002`, `REV-005`, `REV-006`, `REV-008` | `REV-003`, `REV-004`, `REV-007` | 发布链路以 `REV-003`/`REV-004` 为关键 |
| Community/Post System | - | `COM-001`~`COM-005` | 当前虽为 mock，但目标态均需后端持久化 |
| Coupon + Payment + Voucher | - | `CPV-001`~`CPV-009` | 支付与券码链路全量后端参与 |
| User/Profile System | `PRF-004` | `PRF-001`~`PRF-003`, `PRF-005`, `PRF-006` | 用户资产以后端数据为准 |
| Merchant Console | - | `MRC-001`~`MRC-009` | 商家运营能力均需后端 CRUD |
| Merchant Messages | - | `MSG-001`~`MSG-005` | 会话、检索、设置都需服务端一致性 |
| Merchant Verification | `VER-003` | `VER-001`, `VER-002` | 审核流与账号激活为后端关键 |
| Admin System | - | `ADM-001`, `ADM-002` | 后台能力全量依赖后端 |

## 2. 详细需求矩阵

## Auth System

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUT-001 | 用户邮箱登录 | email, password | 调 `AuthContext.login -> /auth/login -> /auth/me` | 登录态 + 用户信息 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given email, password; When 执行用户邮箱登录; Then 登录态 + 用户信息达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `src/contexts/AuthContext.tsx` |
| AUT-002 | 商家邮箱登录 | email, password | 与用户共用登录接口，前端校验 role=merchant | 商家进入 dashboard | 需后端参与 | P0 | 部分实现 | FE | 2026-02-12 | Given email, password; When 执行商家邮箱登录; Then 商家进入 dashboard达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | 角色依赖本地 `user` 缓存二次判断 |
| AUT-003 | 用户注册 | username, email, password | 调 `/auth/register`，成功后拉取 `/auth/me` | 登录态 + 跳转 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given username, email, password; When 执行用户注册; Then 登录态 + 跳转达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `src/features/auth/pages/RegisterPage.tsx` |
| AUT-004 | Google 登录入口 | - | 跳转到后端 OAuth URL | 第三方登录授权 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given -; When 执行Google 登录入口; Then 第三方登录授权达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `authService.getGoogleLoginUrl()` |
| AUT-005 | Google 回调处理 | query token | 解析 token，拉取 `/auth/me` + `/user/profile` | 登录态恢复 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given query token; When 执行Google 回调处理; Then 登录态恢复达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `src/features/auth/pages/GoogleCallbackPage.tsx` |
| AUT-006 | 忘记密码（发邮件） | email | 调 `/auth/forgot-password` | 成功提示 | 需后端参与 | P1 | 已实现（真实 API） | FE | 2026-02-12 | Given email; When 执行忘记密码（发邮件）; Then 成功提示达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | 仅“发起重置” |
| AUT-007 | 启动时鉴权恢复 | local token | 调 `/auth/me` 校验 token | 自动恢复登录态 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given local token; When 执行启动时鉴权恢复; Then 自动恢复登录态达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `AuthProvider` 启动逻辑 |
| AUT-008 | 退出登录 | 当前登录态 | 清 token + user 缓存 | 未登录状态 | 纯前端 | P0 | 已实现（前端） | FE | 2026-02-12 | Given 当前登录态; When 执行退出登录; Then 未登录状态达成，失败有提示。 | N/A | 暂无后端 logout 接口调用 |
| AUT-009 | 发送验证码 | email | 发送验证码并冷却计时 | 验证码发送状态 | 需后端参与 | P1 | 未实现 | FE | 2026-02-12 | Given email; When 执行发送验证码; Then 验证码发送状态达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | 当前注册流程不是验证码模式 |
| AUT-010 | 邮箱验证/激活 | email, code | 校验 code 后激活账号 | 账号激活状态 | 需后端参与 | P1 | 未实现 | FE | 2026-02-12 | Given email, code; When 执行邮箱验证/激活; Then 账号激活状态达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | 当前无验证页 |
| AUT-011 | refresh token | refresh token | 静默续期 access token | 新 token | 需后端参与 | P1 | 未实现 | FE | 2026-02-12 | Given refresh token; When 执行refresh token; Then 新 token达成，失败有提示。 | [AUT-API](contracts/README.md#aut-api) | `apiClient` 仅处理 401 跳登录 |
| AUT-012 | 未登录写点评拦截 | 用户点击 write-review 入口 | 未登录时弹登录引导，登录后再进入流程 | 受保护操作提示 | 纯前端 | P1 | 已实现（前端） | FE | 2026-02-12 | Given 用户点击 write-review 入口; When 执行未登录写点评拦截; Then 受保护操作提示达成，失败有提示。 | N/A | `BottomNav` 有登录弹窗拦截 |
| AUT-013 | 商家路由守卫 | 当前登录态与角色 | 非商家/未登录访问商家端时拦截重定向 | 安全访问控制 | 纯前端 | P0 | 已实现（前端） | FE | 2026-02-12 | Given 当前登录态与角色; When 执行商家路由守卫; Then 安全访问控制达成，失败有提示。 | N/A | `MerchantLayout` 鉴权与角色检查 |

## Customer Discovery + Merchant Detail

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DIS-001 | 首页推荐流 | 用户信息（可选） | 展示活动卡片、商家流 | 首页内容 | 需后端参与 | P0 | Mock/本地状态 | FE | 2026-02-12 | Given 用户信息（可选）; When 执行首页推荐流; Then 首页内容达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端提供推荐流数据 |
| DIS-002 | 首页搜索 | 关键词 | Header 输入关键词触发 `onSearch` | 搜索后的商家结果 | 需后端参与 | P1 | 部分实现 | FE | 2026-02-12 | Given 关键词; When 执行首页搜索; Then 搜索后的商家结果达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端检索与分页能力 |
| DIS-003 | 首页快捷筛选（Filter Bar） | 筛选项（Coupons/Open Now/Top Rated/Budget） | 切换筛选标签高亮态 | 筛选后的商家结果 | 需后端参与 | P1 | 部分实现 | FE | 2026-02-12 | Given 筛选项（Coupons/Open Now/Top Rated/Budget）; When 执行首页快捷筛选（Filter Bar）; Then 筛选后的商家结果达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端支持筛选条件组合查询 |
| DIS-004 | Discover 分类筛选 | 分类/标签 | 本地筛选 + 推荐算法 | 商家列表 | 需后端参与 | P0 | Mock/本地状态 | FE | 2026-02-12 | Given 分类/标签; When 执行Discover 分类筛选; Then 商家列表达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端提供分类与标签检索 |
| DIS-005 | Discover 文本搜索 | 关键词 | 搜索输入触发检索并过滤商家 | 搜索结果列表 | 需后端参与 | P1 | 未实现 | FE | 2026-02-12 | Given 关键词; When 执行Discover 文本搜索; Then 搜索结果列表达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端搜索接口 |
| DIS-006 | Explore 地图探索 | 地图 key、搜索词 | Google Map + 标记点 | 地图与商家详情抽屉 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given 地图 key、搜索词; When 执行Explore 地图探索; Then 地图与商家详情抽屉达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 地图点位与商家详情目标来自后端 |
| DIS-007 | Explore 地图搜索 | 关键词 | 根据关键词过滤地图点位与详情 | 地图筛选结果 | 需后端参与 | P2 | 部分实现 | FE | 2026-02-12 | Given 关键词; When 执行Explore 地图搜索; Then 地图筛选结果达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端地理检索/筛选 |
| DIS-008 | 商家详情页 | merchantId | 展示店铺信息、Deals、菜单、简评 | 商家详情 | 需后端参与 | P0 | Mock/本地状态 | FE | 2026-02-12 | Given merchantId; When 执行商家详情页; Then 商家详情达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端详情接口 |
| DIS-009 | 商家全量评论页 | merchantId | 展示评分摘要与评论列表 | 评论列表页 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given merchantId; When 执行商家全量评论页; Then 评论列表页达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 目标需后端评论查询与分页 |
| DIS-010 | 菜单查看/放大 | menuImageUrl（可选） | 图片查看 + 全屏预览 | 菜单详情 | 需后端参与 | P2 | 已实现（前端） | FE | 2026-02-12 | Given menuImageUrl（可选）; When 执行菜单查看/放大; Then 菜单详情达成，失败有提示。 | [DIS-API](contracts/README.md#dis-api) | 查看交互可纯前端，菜单数据源需后端 |

## Review System

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REV-001 | 写点评基础信息 | 总评分、子评分、文本、标签 | 前端校验评分与文本、标签必选 | 可提交表单 | 纯前端 | P0 | 已实现（前端） | FE | 2026-02-12 | Given 总评分、子评分、文本、标签; When 执行写点评基础信息; Then 可提交表单达成，失败有提示。 | N/A | `WriteReviewPage` + `ReviewContext` |
| REV-002 | 图片/视频选择与校验 | 本地文件 | 尺寸/类型校验，上传状态管理 | 待上传媒体列表 | 纯前端 | P0 | 部分实现 | FE | 2026-02-12 | Given 本地文件; When 执行图片/视频选择与校验; Then 待上传媒体列表达成，失败有提示。 | N/A | 支持 9 张，含错误态/重试 |
| REV-003 | 媒体上传到 R2 | 文件列表 | 调 `/media/presigned-urls` + PUT 上传 | fileUrl 数组 | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given 文件列表; When 执行媒体上传到 R2; Then fileUrl 数组达成，失败有提示。 | [REV-API](contracts/README.md#rev-api) | `mediaApi` + `uploadToR2` |
| REV-004 | 发布点评 | review payload | 调 `/reviews` 创建点评 | 发布成功状态 | 需后端参与 | P0 | 部分实现 | FE | 2026-02-12 | Given review payload; When 执行发布点评; Then 发布成功状态达成，失败有提示。 | [REV-API](contracts/README.md#rev-api) | `merchantId/venueId` 传参仍有 TODO |
| REV-005 | 草稿自动保存/恢复 | 表单状态 | 延时写入 `localStorage` + 启动恢复 | 草稿状态提示 | 纯前端 | P1 | 已实现（前端） | FE | 2026-02-12 | Given 表单状态; When 执行草稿自动保存/恢复; Then 草稿状态提示达成，失败有提示。 | N/A | `review:draft` |
| REV-006 | AI 文案建议 | 分类、文本上下文 | 调 Gemini 生成建议文案 | 文案建议列表 | 纯前端（第三方服务） | P2 | 部分实现 | FE | 2026-02-12 | Given 分类、文本上下文; When 执行AI 文案建议; Then 文案建议列表达成，失败有提示。 | N/A | 依赖 API key 配置，稳定性待验证 |
| REV-007 | 评论点赞/评论互动 | reviewId, text | SDK 层有 `like/comment` 方法 | 点赞/评论状态 | 需后端参与 | P1 | 部分实现 | FE | 2026-02-12 | Given reviewId, text; When 执行评论点赞/评论互动; Then 点赞/评论状态达成，失败有提示。 | [REV-API](contracts/README.md#rev-api) | API 方法存在，UI未形成完整闭环 |
| REV-008 | 点评成功页 | - | 展示激励文案与返回动作 | 成功反馈 | 纯前端 | P2 | 已实现（前端） | FE | 2026-02-12 | Given -; When 执行点评成功页; Then 成功反馈达成，失败有提示。 | N/A | `ReviewSuccessPage` |

## Community/Post System

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| COM-001 | 我的点评流页面 | 用户路由入口 | 展示用户历史点评卡片与互动按钮 | 点评流页面 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given 用户路由入口; When 执行我的点评流页面; Then 点评流页面达成，失败有提示。 | [COM-API](contracts/README.md#com-api) | 目标需后端提供用户点评流数据 |
| COM-002 | 帖子详情页 | postId | 按 id 加载帖子详情并渲染内容 | 帖子详情 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given postId; When 执行帖子详情页; Then 帖子详情达成，失败有提示。 | [COM-API](contracts/README.md#com-api) | 目标需后端帖子详情接口 |
| COM-003 | 帖子点赞 | postId | 本地切换点赞态并更新计数显示 | 点赞结果 | 需后端参与 | P2 | Mock/本地状态 | FE | 2026-02-12 | Given postId; When 执行帖子点赞; Then 点赞结果达成，失败有提示。 | [COM-API](contracts/README.md#com-api) | 目标需后端持久化点赞状态 |
| COM-004 | 帖子评论输入 | postId, comment | 输入框收集评论文本 | 评论草稿 | 需后端参与 | P2 | Mock/本地状态 | FE | 2026-02-12 | Given postId, comment; When 执行帖子评论输入; Then 评论草稿达成，失败有提示。 | [COM-API](contracts/README.md#com-api) | 目标需后端评论提交与拉取 |
| COM-005 | 帖子分享动作 | postId | 触发分享按钮交互 | 分享反馈 | 需后端参与 | P2 | Mock/本地状态 | FE | 2026-02-12 | Given postId; When 执行帖子分享动作; Then 分享反馈达成，失败有提示。 | [COM-API](contracts/README.md#com-api) | 分享按钮可纯前端，分享统计需后端 |

## Coupon + Payment + Voucher

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CPV-001 | 优惠券校验 | couponId, userId | 资格校验 + 错误兜底 | 可用/不可用结果 | 需后端参与 | P0 | 部分实现 | FE | 2026-02-12 | Given couponId, userId; When 执行优惠券校验; Then 可用/不可用结果达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | `couponService` 内同时存在真实请求与 mock |
| CPV-002 | 免费券领取 | couponId, userId | 校验后生成 voucher | voucher + QR 数据 | 需后端参与 | P0 | Mock/本地状态 | FE | 2026-02-12 | Given couponId, userId; When 执行免费券领取; Then voucher + QR 数据达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | `redeemFreeCoupon` 明确写了 mock |
| CPV-003 | 付费券支付初始化 | couponId, userId | 调 `/coupons/:id/payment/initiate` | paymentData/sessionId | 需后端参与 | P0 | 已实现（真实 API） | FE | 2026-02-12 | Given couponId, userId; When 执行付费券支付初始化; Then paymentData/sessionId达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | 需后端接口可用 |
| CPV-004 | 支付页 | deal/coupon 数据 | 用户选支付方式 + 模拟支付 | success 页跳转 | 需后端参与 | P0 | Mock/本地状态 | FE | 2026-02-12 | Given deal/coupon 数据; When 执行支付页; Then success 页跳转达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | 目标需后端支付状态确认与订单落库 |
| CPV-005 | 支付成功页（普通） | order 信息 | 展示券码与下载占位 | 成功反馈页 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given order 信息; When 执行支付成功页（普通）; Then 成功反馈页达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | 目标需后端返回真实订单与券码状态 |
| CPV-006 | 支付成功页（优惠券） | payment state | 调 voucherService 生成券码 | 二维码/条码/券码 | 需后端参与 | P0 | 部分实现 | FE | 2026-02-12 | Given payment state; When 执行支付成功页（优惠券）; Then 二维码/条码/券码达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | 依赖 `/vouchers` 接口，部分功能可跑 |
| CPV-007 | Voucher 展示与分享 | voucherId/分享方式 | 获取券详情、复制、分享、导出 | 券展示页 | 需后端参与 | P1 | 部分实现 | FE | 2026-02-12 | Given voucherId/分享方式; When 执行Voucher 展示与分享; Then 券展示页达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | `share/export` 依赖后端接口 |
| CPV-008 | 我的券包 | - | 券列表渲染与激活动画 | 券包页 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given -; When 执行我的券包; Then 券包页达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | `VouchersPage` 静态数据 |
| CPV-009 | 商家核销扫码/手输 | couponCode | 扫码或手输校验核销 | 核销结果提示 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given couponCode; When 执行商家核销扫码/手输; Then 核销结果提示达成，失败有提示。 | [CPV-API](contracts/README.md#cpv-api) | `RedemptionButton` 内置 mock 券库 |

## User/Profile System

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PRF-001 | 个人主页聚合 | auth user | 展示头像、统计、最近点评、待点评商家 | 我的主页 | 需后端参与 | P1 | 部分实现 | FE | 2026-02-12 | Given auth user; When 执行个人主页聚合; Then 我的主页达成，失败有提示。 | [PRF-API](contracts/README.md#prf-api) | `reviewsApi.list()` 已接，统计多为 mock |
| PRF-002 | 我的评论列表 | userId（隐式） | 拉取 `/reviews` 并转换展示 | 评论卡片列表 | 需后端参与 | P1 | 已实现（真实 API） | FE | 2026-02-12 | Given userId（隐式）; When 执行我的评论列表; Then 评论卡片列表达成，失败有提示。 | [PRF-API](contracts/README.md#prf-api) | 在 `ProfilePage` 内已接接口 |
| PRF-003 | 资料设置页 | 资料字段 | 表单编辑 UI | 保存反馈 | 需后端参与 | P1 | Mock/本地状态 | FE | 2026-02-12 | Given 资料字段; When 执行资料设置页; Then 保存反馈达成，失败有提示。 | [PRF-API](contracts/README.md#prf-api) | `ProfileSettingsPage` 静态展示 |
| PRF-004 | AI Bio 生成 | 用户画像+兴趣 | 调 Gemini 生成短简介 | 新 bio 文案 | 纯前端（第三方服务） | P2 | 部分实现 | FE | 2026-02-12 | Given 用户画像+兴趣; When 执行AI Bio 生成; Then 新 bio 文案达成，失败有提示。 | N/A | API key 目前硬编码在前端代码 |
| PRF-005 | 待评价商家提醒 | userId | 先尝试 API，回退 mock | 待评价商家列表 | 需后端参与 | P2 | 部分实现 | FE | 2026-02-12 | Given userId; When 执行待评价商家提醒; Then 待评价商家列表达成，失败有提示。 | [PRF-API](contracts/README.md#prf-api) | `profileService` API 预留+mock 回退 |
| PRF-006 | Following/最近浏览/Coupon 历史 | userId | 个人关系和历史行为查询 | 列表数据 | 需后端参与 | P2 | 未实现 | FE | 2026-02-12 | Given userId; When 执行Following/最近浏览/Coupon 历史; Then 列表数据达成，失败有提示。 | [PRF-API](contracts/README.md#prf-api) | 当前无完整数据链路 |

## Merchant Console（Dashboard/Marketing/Profile/Reviews）

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MRC-001 | 商家仪表盘 | 商家身份 | 展示评分、评论、券包等运营面板 | dashboard | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 商家身份; When 执行商家仪表盘; Then dashboard达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `MerchantDashboard` 主要本地状态 |
| MRC-002 | 评论回复管理 | reviewId, replyText | 弹窗回复/编辑、状态更新 | 已回复评论 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given reviewId, replyText; When 执行评论回复管理; Then 已回复评论达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | 本地数组维护 |
| MRC-003 | Coupon 管理 | 券信息表单 | 创建/编辑/启停/删除 | 券列表状态 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 券信息表单; When 执行Coupon 管理; Then 券列表状态达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `CouponManager` 本地状态 |
| MRC-004 | Package 管理 | 套餐/价格/图片 | 创建编辑并算折扣 | 套餐列表状态 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 套餐/价格/图片; When 执行Package 管理; Then 套餐列表状态达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `PackageManager` 本地状态 |
| MRC-005 | 营销发帖 | 文案、媒体、CTA、标签 | 前端校验 + 模拟发布 | 发布状态 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 文案、媒体、CTA、标签; When 执行营销发帖; Then 发布状态达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `PostCreation` 模拟 API |
| MRC-006 | 门店资料维护 | 店铺信息、菜单、图片 | 前端编辑与本地图像预览 | 门店资料页 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 店铺信息、菜单、图片; When 执行门店资料维护; Then 门店资料页达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `StoreProfile` 明确 mockStoreData |
| MRC-007 | 经营分析页 | 时间范围 | 展示访问、客群、转化指标 | analytics 看板 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 时间范围; When 执行经营分析页; Then analytics 看板达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `StoreAnalytics` 全静态数据 |
| MRC-008 | 广告管理页 | 活动配置 | 广告目标/素材/预算占位 | Ad 页面 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 活动配置; When 执行广告管理页; Then Ad 页面达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `AdManager` placeholder |
| MRC-009 | 通知中心 | 通知内容 | 分类展示占位 | Notifications 页面 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 通知内容; When 执行通知中心; Then Notifications 页面达成，失败有提示。 | [MRC-API](contracts/README.md#mrc-api) | `Notifications` placeholder |

## Merchant Messages

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MSG-001 | 会话列表 | 搜索词 | 加载/搜索/创建会话 | 会话列表 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 搜索词; When 执行会话列表; Then 会话列表达成，失败有提示。 | [MSG-API](contracts/README.md#msg-api) | `chatStorage` + `localStorage` |
| MSG-002 | 会话详情 | chatId, 消息内容 | 读写消息、发送文件、更新最后消息 | 消息流 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given chatId, 消息内容; When 执行会话详情; Then 消息流达成，失败有提示。 | [MSG-API](contracts/README.md#msg-api) | 文件只生成本地 URL |
| MSG-003 | 会话设置 | mute/pin/clear | 本地设置持久化 | 会话状态更新 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given mute/pin/clear; When 执行会话设置; Then 会话状态更新达成，失败有提示。 | [MSG-API](contracts/README.md#msg-api) | 目标需跨端同步会话设置 |
| MSG-004 | 消息搜索 | query | 对当前会话消息过滤高亮 | 搜索结果 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given query; When 执行消息搜索; Then 搜索结果达成，失败有提示。 | [MSG-API](contracts/README.md#msg-api) | 目标需支持服务端历史消息检索 |
| MSG-005 | 群聊创建/批量删除 | 群名、选中会话 | 创建群/删除会话 | 列表更新 | 需后端参与 | P2 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 群名、选中会话; When 执行群聊创建/批量删除; Then 列表更新达成，失败有提示。 | [MSG-API](contracts/README.md#msg-api) | 本地状态 + toast 提示 |

## Merchant Verification

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VER-001 | 新商家认证表单 | 资质文件、主体信息 | 前端校验文件类型/大小 | 提交状态 | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 资质文件、主体信息; When 执行新商家认证表单; Then 提交状态达成，失败有提示。 | [VER-API](contracts/README.md#ver-api) | 提交与审核倒计时为模拟 |
| VER-002 | 审核通过后建账号 | 邮箱/密码 | 设置本地商家身份、标记验证完成 | 进入 dashboard | 需后端参与 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 邮箱/密码; When 执行审核通过后建账号; Then 进入 dashboard达成，失败有提示。 | [VER-API](contracts/README.md#ver-api) | `AccountSetupModal` 写本地 token |
| VER-003 | 认证弹窗拦截 | 当前商家身份 | 未认证时拦截进入后台 | 弹窗引导 | 纯前端 | P1 | Mock/本地状态 | FE/BE | 2026-02-12 | Given 当前商家身份; When 执行认证弹窗拦截; Then 弹窗引导达成，失败有提示。 | N/A | `MerchantLayout` 读本地 key |

## Admin System

| 需求ID | 功能点 | 输入 | 业务逻辑 | 输出 | 后端参与 | 优先级 | 当前状态 | 负责人 | 状态更新时间 | 验收标准（GWT） | 接口契约 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ADM-001 | 餐厅管理（增删改） | 商家信息 | 后台管理流程 | 管理结果 | 需后端参与 | P2 | 未实现 | TBD | 2026-02-12 | Given 商家信息; When 执行餐厅管理（增删改）; Then 管理结果达成，失败有提示。 | [ADM-API](contracts/README.md#adm-api) | 仓库暂无 admin 前端模块 |
| ADM-002 | 评论审核/举报处置 | reviewId, reason | 审核与风控处理 | 审核结果 | 需后端参与 | P2 | 未实现 | TBD | 2026-02-12 | Given reviewId, reason; When 执行评论审核/举报处置; Then 审核结果达成，失败有提示。 | [ADM-API](contracts/README.md#adm-api) | 仅留有需求语义，无页面与路由 |

## 3. 推荐优先补齐（讨论版）

1. `P0`：打通 Review 发布闭环（`REV-003`, `REV-004`, `REV-007`）  
`merchantId/venueId` 传参、失败重试、发布成功后数据回流。

2. `P0`：统一 Coupon/Payment 真实链路（`CPV-001`~`CPV-009`）  
去掉支付模拟逻辑，统一免费券/付费券/voucher 生成接口契约。

3. `P1`：Profile 与 Merchant Console 去 mock（`PRF-001`~`PRF-003`, `MRC-001`~`MRC-006`）  
优先接通用户统计、店铺运营数据、商家营销配置落库。

4. `P1`：Merchant Messages 最小可用后端化（`MSG-001`~`MSG-005`）  
至少支持会话拉取、发送消息、历史消息查询，替代纯本地存储。

## 4. 目标矩阵 v2（Beta 4-6 周）

> 以 2026-02-12 为起点，Beta 周期建议：`2026-02-12` 至 `2026-03-26`。

### 4.1 Beta 范围边界

| 类型 | 内容 |
| --- | --- |
| In Scope | Review 发布闭环、Coupon/Payment/Voucher 真链路、Profile 去 mock（核心字段）、Merchant Console 去 mock（核心运营）、Merchant Messages 最小后端化 |
| Out of Scope | Admin 后台、复杂营销自动化、推荐算法重构、全量埋点平台化、IM 实时推送（可先轮询） |

### 4.2 Beta 模块目标矩阵

| 模块 | 关键需求ID（Section 2） | Beta 目标 | 后端参与 | 起始状态 | Beta 验收标准（DoD） | 目标优先级 |
| --- | --- | --- | --- | --- | --- | --- |
| Auth System | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | 补齐稳定鉴权体验 | 需后端参与 | 部分实现 | 登录/注册/OAuth/启动恢复稳定可用；401 跳转一致；错误提示统一 | P0 |
| Customer Discovery | `DIS-001`~`DIS-009` | 首页 search/filter 与商家列表形成可用联动 | 需后端参与 | 部分实现 | 首页搜索可过滤商家列表；Filter Bar 至少支持 2 个真实筛选维度（如评分/营业状态）；空结果与重置操作可用 | P1 |
| Review System | `REV-003`, `REV-004`, `REV-007` | 打通“可发布且可回看”的完整链路 | 需后端参与 | 部分实现 | 从商家详情进入写点评可携带 `merchantId/venueId`；图文上传成功率可观测；发布后在个人页可见 | P0 |
| Coupon + Payment + Voucher | `CPV-001`~`CPV-009` | 去模拟支付，走真实支付会话与券码生成 | 需后端参与 | 部分实现 | 付费券下单->支付->券码/二维码展示全链路成功；免费券不再走纯 mock；失败有可恢复提示 | P0 |
| User/Profile System | `PRF-001`, `PRF-002`, `PRF-003`, `PRF-005`, `PRF-006` | 把“核心用户资产”从 mock 切到 API | 需后端参与 | 部分实现 | 昵称/头像/简介/评论数等核心字段来自后端；设置页至少支持保存核心字段 | P1 |
| Merchant Console | `MRC-001`~`MRC-009` | 商家运营核心功能可联调 | 需后端参与 | Mock/本地状态 | 优惠券/套餐/门店资料至少一条完整增改流程落库；评论回复可持久化 | P1 |
| Merchant Messages | `MSG-001`~`MSG-005` | 达到最小可用消息系统 | 需后端参与 | Mock/本地状态 | 会话列表、消息历史、发送文本消息接后端；本地存储仅作缓存而非单一数据源 | P1 |
| Merchant Verification | `VER-001`, `VER-002` | 保留流程但弱化改造优先级 | 需后端参与 | Mock/本地状态 | 可继续 demo，接口定义冻结，为 GA 做后端接入预留 | P2 |

### 4.3 Beta 分阶段执行（建议）

| 阶段 | 时间 | 目标 | 里程碑 |
| --- | --- | --- | --- |
| Phase 1 | Week 1-2 | 收敛 P0 数据契约 | Review/Coupon/Voucher API 契约冻结，前后端联调环境稳定 |
| Phase 2 | Week 3-4 | 打通 P0 核心闭环 | Review 发布闭环 + 支付券链路完成，主路径可验收 |
| Phase 3 | Week 5 | 推进 P1 去 mock | Profile 核心字段与 Merchant Console 核心操作接后端 |
| Phase 4 | Week 6 | 稳定性与回归 | 关键路径回归通过，错误处理、空态、重试策略补齐 |

### 4.4 Beta 出口验收清单

| 验收项 | 验收标准 |
| --- | --- |
| 功能闭环 | 至少 2 条 P0 主路径端到端可跑通且可回溯数据（Review、Coupon/Payment） |
| 稳定性 | 主路径无阻断性 P0 缺陷；失败分支有提示与恢复动作 |
| 一致性 | 鉴权态、路由守卫、错误提示风格统一 |
| 可测试性 | 核心模块具备最小自动化测试或可重复手工验收脚本 |
| 可运营性 | 商家侧至少可执行基础运营动作（发券/编辑资料/回复评论）并持久化 |

### 4.5 当前对外依赖（Beta 前需确认）

| 依赖项 | 对应模块 | 需要后端提供 |
| --- | --- | --- |
| Review 上下文参数 | Review System | 商家与场地 ID 的可靠来源（路由或接口） |
| Payment 会话与回调 | Coupon + Payment + Voucher | 支付发起、状态查询、回调确认接口 |
| Voucher 生命周期 | Coupon + Payment + Voucher | 创建、查询、核销、过期状态定义 |
| Merchant 运营数据 | Merchant Console | 券包/套餐/评论回复的 CRUD 接口 |
| Messaging 最小接口 | Merchant Messages | 会话列表、消息历史、发消息接口（先非实时） |

### 4.6 字段级接口契约索引

| 契约ID | 对应需求ID范围 | 契约文档 |
| --- | --- | --- |
| AUT-API | `AUT-001`~`AUT-007`, `AUT-009`~`AUT-011` | `docs/requirements/contracts/README.md#aut-api` |
| DIS-API | `DIS-001`~`DIS-010` | `docs/requirements/contracts/README.md#dis-api` |
| REV-API | `REV-003`, `REV-004`, `REV-007` | `docs/requirements/contracts/README.md#rev-api` |
| COM-API | `COM-001`~`COM-005` | `docs/requirements/contracts/README.md#com-api` |
| CPV-API | `CPV-001`~`CPV-009` | `docs/requirements/contracts/README.md#cpv-api` |
| PRF-API | `PRF-001`~`PRF-003`, `PRF-005`, `PRF-006` | `docs/requirements/contracts/README.md#prf-api` |
| MRC-API | `MRC-001`~`MRC-009` | `docs/requirements/contracts/README.md#mrc-api` |
| MSG-API | `MSG-001`~`MSG-005` | `docs/requirements/contracts/README.md#msg-api` |
| VER-API | `VER-001`, `VER-002` | `docs/requirements/contracts/README.md#ver-api` |
| ADM-API | `ADM-001`, `ADM-002` | `docs/requirements/contracts/README.md#adm-api` |

## 5. 非功能需求矩阵（NFR）

> 目标：避免“功能能跑但不可上线”的风险，给 Beta/GA 设定可验收的工程标准。

| 维度 | 需求项 | Beta 目标（4-6 周） | GA 建议目标 | 当前状态 |
| --- | --- | --- | --- | --- |
| 性能 | 首屏与关键页加载 | 关键页面（Home/Discover/Profile）在常规网络下可用首屏 | LCP 稳定达标，持续监控 | 未系统化定义 |
| 性能 | 列表与交互流畅度 | 列表滚动不卡顿，筛选/搜索有可见反馈 | 低端机场景持续优化 | 部分实现 |
| 可靠性 | API 失败兜底 | 主路径接口失败有统一错误提示与重试入口 | 关键接口具备熔断/降级策略 | 部分实现 |
| 可靠性 | 提交幂等与防重复 | 支付/发布点评按钮防连点、状态锁定 | 幂等键与服务端对齐 | 部分实现 |
| 安全 | 密钥与敏感信息 | 前端移除硬编码密钥，全部走环境变量 | 敏感配置托管化 | 部分实现 |
| 安全 | 鉴权边界 | 路由守卫一致，401 处理统一 | token 续期与会话策略完善 | 部分实现 |
| 可观测性 | 前端错误监控 | 接入基础错误上报（页面错误、接口错误） | 分模块告警与趋势分析 | 未实现 |
| 可观测性 | 关键事件埋点 | 至少覆盖登录、发点评、支付、领券 | 漏斗与转化分析可视化 | 未实现 |
| 可测试性 | 自动化测试覆盖 | P0 主路径具备最小可回归用例 | 核心模块回归基线稳定 | 部分实现 |
| 可访问性 | 基础可访问性 | 关键操作具备可聚焦与语义标签 | WCAG 关键条款对齐 | 部分实现 |
| 兼容性 | 设备与浏览器支持 | 主流程在主流移动端与桌面端可用 | 明确支持矩阵并持续验证 | 部分实现 |
| 可维护性 | 错误码与状态语义统一 | 前后端错误码映射表落地 | 契约变更自动化校验 | 未实现 |

### 5.1 NFR 对应当前风险（建议优先处理）

| 风险 | 影响模块 | 建议优先级 |
| --- | --- | --- |
| 前端存在硬编码第三方密钥 | Profile/AI 能力 | P0 |
| 支付与发点评链路失败恢复策略不统一 | Review、Coupon/Payment | P0 |
| 缺少统一前端错误上报与关键埋点 | 全局 | P1 |
| 搜索/筛选交互存在 UI 与真实数据联动脱节 | Customer Discovery | P1 |

### 5.2 Beta 结束前最低 NFR 验收

1. P0 主路径都具备统一错误提示与可恢复操作（重试/返回）。
2. 移除前端硬编码密钥，敏感配置改为环境变量。
3. 至少接入一套前端错误上报，并覆盖生产构建。
4. 为 `登录 -> 发点评 -> 支付/领券` 建立最小回归用例。

## 6. 变更记录

| 日期 | 版本 | 变更类型 | 变更摘要 | 责任人 |
| --- | --- | --- | --- | --- |
| 2026-02-12 | v2.2 | 结构升级 | 引入 `需求ID` 体系；`## 2` 升级为唯一事实源；`## 1.1` 改为 ID 索引；`## 4.2` 增加需求追踪列 | Wayne/Codex |
| 2026-02-12 | v2.3 | 可验证性升级 | `## 2` 每条需求新增 `负责人/状态更新时间/GWT/接口契约`；新增字段级契约索引与契约文档 | Wayne/Codex |
