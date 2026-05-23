# FactoryFlow — Fleet & Workforce Management System

> Full-stack enterprise application built with **Java Spring Boot** + **MySQL** + **Angular**

## 🚀 Quick Start

### Prerequisites
- **JDK 17+** — [Download](https://adoptium.net/)
- **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **Maven 3.9+** — [Download](https://maven.apache.org/)

### 1. Database Setup
```sql
-- MySQL will auto-create the database, but ensure the server is running:
-- Default credentials: root / root (change your credentials in backend/application.properties)
-- The app connects to: localhost:3306/factoryflow
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
The API starts at **http://localhost:8080**

### 3. Frontend (Angular)
```bash
cd frontend
npm install   # (only first time)
npx ng serve
```
The UI starts at **http://localhost:4200**

### 4. Login
- Default Passcode: `admin123`

---

## 📁 Project Structure

```
FactoryFlow/
├── backend/                    # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/factoryflow/
│       │   ├── config/         # CORS, Security
│       │   ├── controller/     # REST endpoints
│       │   ├── model/          # JPA entities
│       │   ├── repository/     # Spring Data repos
│       │   └── service/        # Business logic
│       └── resources/
│           ├── application.properties
│           └── data.sql        # Seed data
│
└── frontend/                   # Angular 19 SPA
    └── src/app/
        ├── core/               # Services, guards
        ├── shared/             # Header component
        └── features/           # Login, Workforce, Fleet
```

## 🔧 API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Auth | POST | `/api/auth/login` | Verify passcode |
| Employees | GET | `/api/employees` | List all |
| Employees | POST | `/api/employees` | Add employee |
| Employees | PUT | `/api/employees/{id}` | Update employee |
| Employees | DELETE | `/api/employees/{id}` | Delete employee |
| Attendance | GET | `/api/attendance?date=` | Get by date |
| Attendance | POST | `/api/attendance` | Mark attendance |
| Machines | GET | `/api/machines` | List all |
| Machines | POST | `/api/machines` | Add machine |
| Machines | DELETE | `/api/machines/{id}` | Delete machine |
| Logs | GET | `/api/machine-logs?date=` | Get by date |
| Logs | POST | `/api/machine-logs` | Create/update log |

## 📋 Leave Deduction Rules
1. First absence in a month (non-Sunday) → deducts from **Paid Leave** (base: 12)
2. Subsequent absences → deducts from **Sick Leave** (base: 12, can go negative)
3. Sunday absences → **no deduction**
