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
| Technology |
|---|---|
| Node.js | Express | bcrypt 


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

Data flow: **React + TypeScript (frontend)** → **Node.js and Express REST API (backend)** → **MySQL (database)**

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
- HR after verification can add employees as admin

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
odoo_nmit_virtual (DATABASE)
├── companies
├── departments
├── users
├── employees
├── hr_profiles
├── attendance
├── leave_types
├── leave_requests
├── payroll
└── audit_logs

**users**
Column	Type	Foreign Key
id	INT	—
login_id	VARCHAR(100)	—
password_hash	VARCHAR(255)	—
role	ENUM('EMPLOYEE','HR','ADMIN')	—
is_active	TINYINT(1)	—
must_change_password	TINYINT(1)	—
last_login	DATETIME	—
created_at	TIMESTAMP	—
updated_at	TIMESTAMP	—
id is the Primary Key and login_id is UNIQUE.

**companies**
Column	Type	Foreign Key
id	INT	—
company_name	VARCHAR(150)	—
company_code	VARCHAR(50)	—
email	VARCHAR(150)	—
phone	VARCHAR(20)	—
address	TEXT	—
created_at	TIMESTAMP	—
id is the Primary Key and company_code is UNIQUE.

**departments**
Column	Type	Foreign Key
id	INT	—
department_name	VARCHAR(100)	—
description	VARCHAR(255)	—
is_active	TINYINT(1)	—
created_at	TIMESTAMP	—
id is the Primary Key and department_name is UNIQUE.

**employees**
Column	Type	 Foreign Key
id	INT	—
user_id	INT	users(id)
company_id	INT	companies(id)
department_id	INT	departments(id)
first_name	VARCHAR(100)	—
last_name	VARCHAR(100)	—
date_of_birth	DATE	—
year_of_joining	YEAR	—
serial_number	VARCHAR(50)	—
email	VARCHAR(150)	—
phone	VARCHAR(20)	—
job_title	VARCHAR(100)	—
employment_status	ENUM('ACTIVE','INACTIVE','RESIGNED','TERMINATED')	—
created_at	TIMESTAMP	—
updated_at	TIMESTAMP	—

***Foreign-key relationships are:***
user_id → users.id
company_id → companies.id
department_id → departments.id
id is the Primary Key and serial_number is UNIQUE.

**hr_profiles**
Column	Type	Foreign Key
id	INT	—
user_id	INT	users(id)
company_id	INT	companies(id)
first_name	VARCHAR(100)	—
last_name	VARCHAR(100)	—
email	VARCHAR(150)	—
phone	VARCHAR(20)	—
date_of_birth	DATE	—
created_at	TIMESTAMP	—
updated_at	TIMESTAMP	—




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
- React 
- VITE
- MySQL 8+
- Express

### Frontend Setup
```bash
git clone https://github.com/manikantaise-design/Oduuhackathon.git
cd Oduuhackathon/frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd Oduuhackathon/backend
npm install
npm start
```

### Database Setup

<div style="background: #f6f8fa; border-left: 5px solid #2563eb; padding: 20px; border-radius: 10px; margin: 20px 0; font-family: Arial, sans-serif;">
  <h3 style="margin-top: 0; color: #111827;">1. Create the database</h3>
  <p>Create a MySQL database named:</p>
  <p><strong>ODOO_NMIT_VIRTUAL</strong></p>

  <h3 style="color: #111827;">2. Import the provided database backup</h3>
  <p>From the folder containing the SQL backup file, run:</p>
  <pre style="background: #111827; color: #f9fafb; padding: 12px; border-radius: 8px; overflow-x: auto;"><code>mysql -u root -p ODOO_NMIT_VIRTUAL &lt; ODOO_NMIT_VIRTUAL_backup.sql</code></pre>
  <p>Enter your MySQL password when prompted.</p>

  <h3 style="color: #111827;">3. Configure the backend .env</h3>
  <p>Inside the <strong>backend</strong> folder, create a <strong>.env</strong> file:</p>
  <pre style="background: #111827; color: #f9fafb; padding: 12px; border-radius: 8px; overflow-x: auto;"><code>DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ODOO_NMIT_VIRTUAL
DB_PORT=3306
PORT=5000</code></pre>
  <p>Replace <strong>YOUR_MYSQL_PASSWORD</strong> with your local MySQL password.</p>

  <h3 style="color: #111827;">4. Start the backend</h3>
  <pre style="background: #111827; color: #f9fafb; padding: 12px; border-radius: 8px; overflow-x: auto;"><code>npm install
npm start</code></pre>
  <p>The backend should run on:</p>
  <p><strong>http://localhost:5000</strong></p>
</div>

> <strong>Important:</strong> The <strong>.env</strong> file is not included in GitHub for security reasons. Each evaluator/team member must create their own <strong>.env</strong> file using the configuration above.
>
> The SQL backup file is included so the database can be recreated locally.

---

## 🔑 Environment Variables

**Frontend (`.env`)**
```
VITE_API_BASE_URL=http://localhost:8080/api
```

**Backend (`application.properties`)**
```
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ODOO_NMIT_VIRTUAL
DB_PORT=3306
PORT=5000
```

---

## 🔒 Security

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

- [ ] backend integration (currently uses realistic demo data)
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
