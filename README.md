# Oduuhackathon
# 🕒 DAYFLOW — Human Resource Management System

> **"Every workday, perfectly aligned."**

Dayflow is a modern, full-stack Human Resource Management System (HRMS) built to digitize and streamline employee authentication, attendance, leave management, payroll visibility, notifications, and HR approval workflows — all through a clean, responsive, role-based interface.

The UI/UX structure of this project is based on the following Excalidraw design, which serves as the **source of truth** for layout, navigation, and workflow:

🔗 **[Dayflow UI/UX Design (Excalidraw)](https://app.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [User Roles](#-user-roles)
- [Core Features](#-core-features)
- [Database Schema](#-database-schema)
- [REST API Endpoints](#-rest-api-endpoints)
- [Frontend Project Structure](#-frontend-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Security](#-security)
- [Responsive Design](#-responsive-design)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

Dayflow supports two primary roles — **Employee** and **HR/Admin** — each with a dedicated dashboard and permission set. The system covers the full employee lifecycle flow:

```
Sign Up → Sign In → Role Detection → Dashboard → Profile → Attendance → Leave → HR Approval → Payroll → Notifications → Reports
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI library |
| TypeScript | Type safety |
| Vite | Build tool / dev server |
| Tailwind CSS | Styling |
| shadcn/ui | UI component library |
| Lucide React | Icons |
| React Router | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| Java | Language |
| Spring Boot | Application framework |
| Spring Web | REST API layer |
| Spring Security | Authentication & authorization |
| Spring Data JPA | ORM / persistence |
| JWT | Token-based authentication |
| Maven | Build & dependency management |

### Database
- **MySQL** (only supported database)

> ❌ MongoDB, Firebase, Supabase, and PostgreSQL are **not** used in this project.

---

## 🏗 Architecture

```
              DAYFLOW
                 │
       ┌─────────┴─────────┐
       │                   │
 React + TypeScript    Spring Boot
       │                   │
       └─────────┬─────────┘
                 │
               MySQL
```

Data flow: **React + TypeScript (frontend)** → **Spring Boot REST API (backend)** → **MySQL (database)**

---

## 👥 User Roles

### Employee
Regular user with access limited to their own data.
- Dashboard · Profile · Attendance · Leave Requests · Payroll (read-only) · Notifications · Logout

### Admin / HR Officer
Management and approval user with organization-wide access.
- Dashboard · Employee Management · Attendance Management · Leave Management · Payroll · Reports/Analytics · Notifications · Logout

> Role-based access is enforced on **both** the frontend (protected routes) and backend (Spring Security authorization) — frontend restrictions alone are never relied upon.

---

## ✨ Core Features

### 🔐 Authentication
- Sign Up (Employee ID, Email, Password, Confirm Password, Role)
- Duplicate email / employee ID validation
- Password strength validation
- Email verification flow
- Sign In with JWT-based session
- Role-based redirect (Employee → Employee Dashboard, HR → HR Dashboard)

### 📊 Dashboards
- **Employee Dashboard** — quick access to Profile, Attendance, Leave, Logout, recent activity, and alerts
- **HR/Admin Dashboard** — employee list, attendance records, leave approvals, and employee switching

### 🪪 Employee Profile
- Personal details (ID, name, email, phone, address, photo)
- Job details (department, title, joining date, status)
- Salary structure (basic, allowances, deductions, gross, net)
- Documents
- Employees can edit only *phone, address, and profile picture*; HR can edit all fields

### 🕘 Attendance Management
- Check-In / Check-Out with timestamps
- Daily, weekly, and historical views
- Statuses: Present, Absent, Half-day, Leave
- Employees view only their own records; HR can filter by employee, date, department, and status

### 🏖 Leave Management
- Apply for Leave (Paid / Sick / Unpaid), with date range and remarks
- Leave statuses: Pending, Approved, Rejected
- Full leave history per employee
- HR approval interface with approve/reject actions and comments
- Automatic notifications on status change

### 💰 Payroll / Salary Management
- Employees: read-only salary slip view (basic, allowances, deductions, gross, net)
- HR: view and update salary structure for all employees

### 🔔 Notifications
- Real-time-style alerts for leave, attendance, and payroll events
- Unread count, read/unread state, timestamps, mark-as-read

### 📈 Analytics & Reports
- Attendance reports (daily, weekly, by employee, by status)
- Leave reports (pending, approved, rejected)
- Payroll reports (salary info, salary slips)

### 🧑‍💼 Employee Management (HR)
- Searchable employee list with ID, photo, name, email, department, title, status
- View/edit employee profiles
- Switch between employees

---

## 🗄 Database Schema

**users**
| Column | Type |
|---|---|
| id | PK |
| employee_id | |
| email | |
| password | |
| role | |
| email_verified | |
| created_at | |
| updated_at | |

**employee_profiles**
| Column | Type |
|---|---|
| id | PK |
| user_id | FK → users.id |
| full_name | |
| phone | |
| address | |
| profile_picture | |
| department | |
| job_title | |
| joining_date | |
| employment_status | |

**attendance**
| Column | Type |
|---|---|
| id | PK |
| employee_id | FK → users.id |
| attendance_date | |
| check_in | |
| check_out | |
| status | |
| working_hours | |

**leave_requests**
| Column | Type |
|---|---|
| id | PK |
| employee_id | FK → users.id |
| leave_type | |
| start_date | |
| end_date | |
| remarks | |
| status | |
| hr_comment | |
| created_at | |
| updated_at | |

**payroll**
| Column | Type |
|---|---|
| id | PK |
| employee_id | FK → users.id |
| basic_salary | |
| allowances | |
| deductions | |
| gross_salary | |
| net_salary | |
| updated_at | |

**notifications**
| Column | Type |
|---|---|
| id | PK |
| user_id | FK → users.id |
| title | |
| message | |
| notification_type | |
| is_read | |
| created_at | |

---

## 🔌 REST API Endpoints

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/verify-email
```

### Employees
```
GET    /api/employees
GET    /api/employees/{id}
PUT    /api/employees/{id}
```

### Attendance
```
POST   /api/attendance/check-in
POST   /api/attendance/check-out
GET    /api/attendance/my
GET    /api/attendance/all
```

### Leave
```
POST   /api/leaves
GET    /api/leaves/my
GET    /api/leaves/all
PUT    /api/leaves/{id}/approve
PUT    /api/leaves/{id}/reject
```

### Payroll
```
GET    /api/payroll/my
GET    /api/payroll/all
PUT    /api/payroll/{employeeId}
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/{id}/read
```

---

## 📁 Frontend Project Structure

```
src/
├── components/     # Reusable UI components (Sidebar, Header, Cards, Tables, Modals...)
├── pages/          # Route-level pages (Dashboard, Profile, Attendance, Leave, Payroll...)
├── layouts/        # Layout wrappers (Employee layout, HR layout)
├── routes/         # Route definitions & protected route guards
├── services/        # API service modules
│   ├── authService.ts
│   ├── employeeService.ts
│   ├── attendanceService.ts
│   ├── leaveService.ts
│   ├── payrollService.ts
│   ├── notificationService.ts
│   └── reportService.ts
├── hooks/          # Custom React hooks
├── context/        # Auth/User context providers
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

> All API calls are centralized in the `services/` layer — UI components never call APIs directly.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8+

### Frontend Setup
```bash
git clone https://github.com/<your-username>/dayflow-hrms.git
cd dayflow-hrms/frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd dayflow-hrms/backend
mvn clean install
mvn spring-boot:run
```

### Database Setup
```sql
CREATE DATABASE dayflow_db;
```
Configure your MySQL credentials in `backend/src/main/resources/application.properties`.

---

## 🔑 Environment Variables

**Frontend (`.env`)**
```
VITE_API_BASE_URL=http://localhost:8080/api
```

**Backend (`application.properties`)**
```
spring.datasource.url=jdbc:mysql://localhost:3306/dayflow_db
spring.datasource.username=root
spring.datasource.password=yourpassword
jwt.secret=your-jwt-secret-key
jwt.expiration=86400000
```

---

## 🔒 Security

- JWT-based authentication with Spring Security
- Password hashing (BCrypt)
- Strict role-based authorization enforced at the API level (not just the UI)
- Protected frontend routes and protected backend endpoints
- Server-side input validation

**Employees can never:**
- View another employee's private data or attendance
- Modify payroll
- Approve/reject leave requests
- Access HR-only APIs or routes

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Desktop | Sidebar + Header + Main Content |
| Tablet | Collapsible Sidebar + Main Content |
| Mobile | Mobile Header + Navigation Drawer + Stacked Content |

Tables remain scrollable/usable on mobile, cards stack vertically, and forms collapse to a single column on small screens.

---

## 🗺 Roadmap

- [ ] Full Spring Boot backend integration (currently uses realistic demo data)
- [ ] Email verification service integration
- [ ] Document upload & management
- [ ] Advanced analytics dashboard
- [ ] Multi-department reporting

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss any major changes before submitting a pull request, and ensure the Excalidraw-defined UI/UX structure is preserved.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---