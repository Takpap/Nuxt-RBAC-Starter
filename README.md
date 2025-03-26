# Nuxt RBAC (基于角色的访问控制系统)

这是一个使用Nuxt 3构建的基于角色的访问控制(RBAC)系统示例项目。该项目展示了如何在Nuxt应用中实现用户认证和基于角色的权限控制。

## 功能特性

- 用户认证（注册、登录、登出）
- 基于角色的权限控制
- 用户管理
- 角色管理
- 权限管理
- API权限验证中间件
- 现代化UI设计与动画效果
- 图标库展示和管理
- 系统活动日志记录和查询

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js框架
- [Prisma](https://www.prisma.io/) - ORM数据库工具
- [Element Plus](https://element-plus.org/) - UI组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [SQLite](https://www.sqlite.org/) - 数据库（开发环境）
- [JWT](https://jwt.io/) - JSON Web Token认证
- [@nuxt/icon](https://nuxt.com/modules/icon) - 图标管理，支持200,000+图标
- [Iconify](https://iconify.design/) - 开源图标集合
- [DayJS](https://day.js.org/) - 轻量级日期处理库

## 界面预览

系统提供了美观的现代化UI设计：

- 响应式布局，适配移动设备和桌面端
- 动态卡片和悬停效果
- 清晰的数据可视化
- 丰富的图标库和自定义图标支持
- 优化的表单和表格设计

## 系统架构

### 数据模型

- **User**: 用户信息，包含角色关联
- **Role**: 角色定义，包含多个权限
- **Permission**: 权限定义，基于资源和操作
- **RolePermission**: 角色-权限关联表
- **Session**: 用户会话管理

### API接口

- **/api/auth**: 认证相关接口（登录、注册、登出）
- **/api/users**: 用户管理接口
- **/api/roles**: 角色管理接口
- **/api/permissions**: 权限管理接口
- **/api/sessions**: 会话管理接口
- **/api/activities**: 活动日志接口

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 9+

### 安装

```bash
# 安装依赖
pnpm install
```

### 数据库初始化

```bash
# 初始化并填充测试数据
pnpm db:seed
```

### 开发环境运行

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看应用。

### 生产环境构建

```bash
# 构建生产环境应用
pnpm build

# 本地预览生产环境
pnpm preview
```

## 项目结构

```
├── prisma/                  # Prisma配置和迁移
│   ├── schema.prisma        # 数据库模型定义
│   └── seed.ts              # 种子数据脚本
├── server/                  # 服务端代码
│   ├── api/                 # API端点
│   │   ├── auth/            # 认证相关API
│   │   ├── users/           # 用户管理API
│   │   ├── roles/           # 角色管理API
│   │   ├── permissions/     # 权限管理API
│   │   ├── sessions/        # 会话管理API
│   │   └── activities/      # 活动日志API
│   ├── middleware/          # 中间件
│   │   └── auth.ts          # 认证和权限验证中间件
│   └── utils/               # 工具函数
├── components/              # 共享组件
│   └── ui/                  # UI组件
│       └── IconsDisplay.vue # 图标展示组件
├── pages/                   # 页面组件
│   ├── dashboard.vue        # 控制台页面
│   ├── users.vue            # 用户管理页面
│   ├── roles.vue            # 角色管理页面
│   ├── permissions.vue      # 权限管理页面
│   ├── profile.vue          # 个人资料页面
│   ├── icons.vue            # 图标库页面
│   ├── activities.vue       # 活动日志页面
│   ├── login.vue            # 登录页面
│   └── register.vue         # 注册页面
├── layouts/                 # 布局组件
│   ├── default.vue          # 默认布局
│   ├── admin.vue            # 管理员布局，带侧边栏
│   └── home.vue             # 首页布局，带营销页脚
├── middleware/              # 客户端中间件
│   ├── auth.ts              # 认证中间件
│   └── guest.ts             # 访客中间件
├── composables/             # 可组合函数
│   └── useAuth.ts           # 认证相关函数
├── app.vue                  # 应用入口组件
├── nuxt.config.ts           # Nuxt配置
└── package.json             # 项目依赖
```

## 图标库特性

本项目集成了 @nuxt/icon 模块，提供以下功能：

- 访问超过 200,000 个开源图标
- 图标分类展示和管理
- 便捷的图标搜索和预览
- 一键复制图标名称
- 自定义图标预览

使用方法非常简单：

```vue
<Icon name="i-ph-user-duotone" />
```

其中 `i-ph-user-duotone` 为图标名称，格式为 `i-[集合名称]-[图标名称]`，例如：
- `i-ph-user-duotone`: Phosphor Icons 的 user 图标（双色版本）
- `i-mdi-home`: Material Design Icons 的 home 图标
- `i-tabler-settings`: Tabler Icons 的 settings 图标

## 活动日志功能

本系统提供完整的活动日志记录和查询功能：

### 日志记录

系统会自动记录以下类型的活动：

- 用户登录和登出
- 资源的创建、更新和删除（用户、角色、权限等）
- 角色分配变更
- 权限变更
- 其他重要系统操作

每条日志包含以下信息：
- 操作类型（login、logout、create、update、delete、assign_role等）
- 资源类型（user、role、permission等）
- 资源ID
- 详细描述
- 操作用户信息
- IP地址与用户代理
- 时间戳

### 日志查询

系统提供强大的日志查询功能：

- 按操作类型筛选
- 按资源类型筛选
- 按用户筛选
- 分页和排序
- 清晰的视觉区分（不同操作类型使用不同颜色标记）

### 仪表板集成

控制台仪表板显示最近的系统活动，提供系统运行状态的实时概览。

### 实现技术

- Prisma ORM 数据模型
- RESTful API 接口
- Vue 3 + Element Plus UI
- TypeScript 类型安全

## 权限系统设计

本项目采用了基于角色的访问控制（RBAC）模型：

1. 每个用户关联一个角色
2. 每个角色包含多个权限
3. 每个权限定义为资源（resource）和操作（action）的组合
4. API访问时通过中间件验证用户是否拥有对应的权限

## 开发与贡献

欢迎提交Issues和Pull Requests。

## 许可证

[MIT](LICENSE)

管理后台支持侧边栏折叠功能，提供更大的内容显示空间：

- 支持菜单栏折叠/展开切换
- 显示图标化菜单
- 自动保存用户的折叠状态偏好
- 顶部导航栏的快捷折叠按钮
