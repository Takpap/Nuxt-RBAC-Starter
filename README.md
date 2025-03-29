# Nuxt RBAC (Role-Based Access Control System)

This is an example project of a Role-Based Access Control (RBAC) system built with Nuxt 3. The project demonstrates how to implement user authentication and role-based permission control in a Nuxt application.

## Features

- User authentication (registration, login, logout)
- Role-based permission control
- User management
- Role management
- Permission management
- Menu management
- API permission verification middleware
- Modern UI design and animation effects
- Icon library display and management
- System activity log recording and querying
- System monitoring and data statistics
- Historical data analysis and chart display

## Technology Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework
- [Prisma](https://www.prisma.io/) - ORM database tool
- [Element Plus](https://element-plus.org/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [SQLite](https://www.sqlite.org/) - Database (development environment)
- [JWT](https://jwt.io/) - JSON Web Token authentication
- [@nuxt/icon](https://nuxt.com/modules/icon) - Icon management, supporting 200,000+ icons
- [Iconify](https://iconify.design/) - Open source icon collection
- [DayJS](https://day.js.org/) - Lightweight date processing library
- [Chart.js](https://www.chartjs.org/) - Chart drawing library
- [Vue-ChartJS](https://vue-chartjs.org/) - Chart.js integration for Vue.js
- [Systeminformation](https://systeminformation.io/) - System information retrieval library

## UI Preview

The system provides an aesthetic modern UI design:

- Responsive layout, adapting to mobile devices and desktop
- Dynamic cards and hover effects
- Clear data visualization
- Rich icon library and custom icon support
- Optimized form and table design
- Real-time system status monitoring charts

## System Architecture

### Data Models

- **User**: User information, including role associations
- **Role**: Role definitions, containing multiple permissions
- **Permission**: Permission definitions, based on resources and operations
- **RolePermission**: Role-permission association table
- **Session**: User session management
- **Menu**: Menu structure definition
- **RoleMenu**: Role-menu association table
- **ActivityLog**: System activity log

### API Interfaces

- **/api/auth**: Authentication-related interfaces (login, registration, logout)
- **/api/users**: User management interfaces
- **/api/roles**: Role management interfaces
- **/api/permissions**: Permission management interfaces
- **/api/sessions**: Session management interfaces
- **/api/activities**: Activity log interfaces
- **/api/menus**: Menu management interfaces
- **/api/system**: System monitoring and data statistics interfaces

## Quick Start

### Requirements

- Node.js 18+
- Bun 1.0+

### Installation

```bash
# Install dependencies
bun install
```

### Database Initialization

```bash
# Initialize and populate test data
bun db:seed
```

### Development Environment

```bash
# Start development server
bun dev
```

Visit http://localhost:3000 to view the application.

### Production Build

```bash
# Build for production
bun build

# Preview production locally
bun preview
```

## Project Structure

```
├── prisma/                  # Prisma configuration and migrations
│   ├── schema.prisma        # Database model definitions
│   └── seed.ts              # Seed data script
├── server/                  # Server-side code
│   ├── api/                 # API endpoints
│   │   ├── auth/            # Authentication-related APIs
│   │   ├── users/           # User management APIs
│   │   ├── roles/           # Role management APIs
│   │   ├── permissions/     # Permission management APIs
│   │   ├── sessions/        # Session management APIs
│   │   ├── menus/           # Menu management APIs
│   │   ├── activities/      # Activity log APIs
│   │   └── system/          # System monitoring APIs
│   ├── middleware/          # Middleware
│   │   └── auth.ts          # Authentication and permission verification middleware
│   ├── utils/               # Utility functions
│   └── services/            # Service layer
├── components/              # Shared components
│   └── ui/                  # UI components
│       └── IconsDisplay.vue # Icon display component
├── pages/                   # Page components
│   ├── dashboard.vue        # Dashboard page
│   ├── users.vue            # User management page
│   ├── roles.vue            # Role management page
│   ├── permissions.vue      # Permission management page
│   ├── menus/               # Menu management pages
│   ├── settings/            # System settings pages
│   ├── icons.vue            # Icon library page
│   ├── activities.vue       # Activity log page
│   ├── login.vue            # Login page
│   └── register.vue         # Registration page
├── layouts/                 # Layout components
│   ├── default.vue          # Default layout
│   ├── admin.vue            # Admin layout with sidebar
│   └── home.vue             # Home layout with marketing footer
├── middleware/              # Client-side middleware
│   ├── auth.ts              # Authentication middleware
│   └── guest.ts             # Guest middleware
├── composables/             # Composable functions
│   └── useAuth.ts           # Authentication-related functions
├── app.vue                  # Application entry component
├── nuxt.config.ts           # Nuxt configuration
└── package.json             # Project dependencies
```

## Icon Library Features

This project integrates the @nuxt/icon module, providing the following features:

- Access to over 200,000 open-source icons
- Icon categorization display and management
- Convenient icon search and preview
- One-click copy of icon names
- Custom icon preview

Usage is very simple:

```vue
<Icon name="i-ph-user-duotone" />
```

Where `i-ph-user-duotone` is the icon name, formatted as `i-[collection-name]-[icon-name]`, for example:
- `i-ph-user-duotone`: Phosphor Icons user icon (duotone version)
- `i-mdi-home`: Material Design Icons home icon
- `i-tabler-settings`: Tabler Icons settings icon

## Activity Log Features

The system provides comprehensive activity log recording and querying capabilities:

### Log Recording

The system automatically records the following types of activities:

- User login and logout
- Resource creation, update, and deletion (users, roles, permissions, etc.)
- Role assignment changes
- Permission changes
- Other important system operations

Each log entry contains the following information:
- Operation type (login, logout, create, update, delete, assign_role, etc.)
- Resource type (user, role, permission, etc.)
- Resource ID
- Detailed description
- Operating user information
- IP address and user agent
- Timestamp

### Log Querying

The system provides powerful log querying functionality:

- Filter by operation type
- Filter by resource type
- Filter by user
- Pagination and sorting
- Clear visual distinction (different operation types are marked with different colors)

### Dashboard Integration

The dashboard displays recent system activities, providing a real-time overview of system status.

### Implementation Technology

- Prisma ORM data models
- RESTful API interfaces
- Vue 3 + Element Plus UI
- TypeScript type safety

## System Monitoring and Statistics

The system provides comprehensive system monitoring and data statistics functionality:

### System Information

- CPU usage and core count
- Memory usage
- Disk space usage
- Operating system information
- Server uptime

### Business Data Statistics

- User registration trends
- Active user data
- System resource usage statistics
- Growth trends for various resources

### Historical Data Analysis

- Multi-dimensional data filtering
- Time range selection
- Chart visualization
- Data export functionality

### Chart Types

- Line charts: Display time series data
- Bar charts: Compare quantities across different categories
- Pie charts: Show proportion distributions
- Radar charts: Multi-dimensional metric comparison

## Permission System Design

This project adopts a Role-Based Access Control (RBAC) model:

1. Each user is associated with a role
2. Each role contains multiple permissions
3. Each permission is defined as a combination of resource and action
4. During API access, middleware verifies whether the user has the corresponding permission

## Menu Management Features

The system provides flexible menu management functionality:

- Multi-level menu structure support
- Role-based menu permission control
- Dynamic route generation
- Icon and sorting customization
- Menu display/hide control

The admin backend supports sidebar collapse functionality, providing more space for content display:

- Support for menu bar collapse/expand toggle
- Display iconified menu
- Automatic saving of user's collapse state preferences
- Quick collapse button in the top navigation bar

## Development and Contribution

Issues and Pull Requests are welcome.

## License

[MIT](LICENSE)

_Note: This is the English version of the README. Translations are available in [Chinese](README.zh.md) and [Japanese](README.ja.md)._
