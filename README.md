# 🚗 DriveEasy — Vehicle Rental System

A full-stack vehicle rental web application built with **Spring Boot** (backend) + **React + Vite + Tailwind CSS** (frontend) + **MySQL** (database).

---

## 📁 Project Structure

```
vehicle-rental/
├── backend/               # Spring Boot REST API
│   ├── src/main/java/com/rental/
│   │   ├── config/        # Security & CORS config
│   │   ├── controller/    # REST controllers
│   │   ├── dto/           # Request/Response DTOs
│   │   ├── entity/        # JPA entities
│   │   ├── exception/     # Custom exceptions & handler
│   │   ├── repository/    # Spring Data JPA repositories
│   │   ├── security/      # JWT filter & utility
│   │   └── service/       # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/              # React + Vite + Tailwind
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # Auth context
│       ├── pages/         # Page components
│       │   └── admin/     # Admin panel pages
│       └── services/      # Axios API calls
└── database/
    └── schema.sql         # MySQL schema + seed data
```

---

## ✨ Features

### User Features
- Register & login with JWT authentication
- Browse all vehicles with search & filters
- View vehicle details
- Book a vehicle with date selection
- View and cancel bookings
- Edit profile

### Admin Features
- Dashboard with stats (vehicles, users, bookings, revenue)
- Add / edit / delete vehicles
- Update booking status & payment status
- Enable / disable user accounts

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, JWT |
| Database   | MySQL 8+, Spring Data JPA / Hibernate |
| Frontend   | React 18, Vite, Tailwind CSS, Axios |
| Auth       | JWT (jjwt 0.12), BCrypt             |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

---

### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

Or create the DB manually and let Hibernate auto-create tables:
```sql
CREATE DATABASE vehicle_rental_db;
```

---

### 2. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Run:
```bash
mvn spring-boot:run
```

API will be available at: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App will be available at: `http://localhost:3000`

---

## 🔐 Default Credentials

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@rental.com   | admin123  |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| POST   | /api/auth/register    | Public  |
| POST   | /api/auth/login       | Public  |

### Vehicles
| Method | Endpoint                    | Access      |
|--------|-----------------------------|-------------|
| GET    | /api/vehicles               | Public      |
| GET    | /api/vehicles/available     | Public      |
| GET    | /api/vehicles/search        | Public      |
| GET    | /api/vehicles/{id}          | Public      |
| POST   | /api/vehicles               | Admin only  |
| PUT    | /api/vehicles/{id}          | Admin only  |
| DELETE | /api/vehicles/{id}          | Admin only  |
| PATCH  | /api/vehicles/{id}/status   | Admin only  |

### Bookings
| Method | Endpoint                      | Access         |
|--------|-------------------------------|----------------|
| POST   | /api/bookings                 | Authenticated  |
| GET    | /api/bookings/my              | Authenticated  |
| GET    | /api/bookings/{id}            | Authenticated  |
| PATCH  | /api/bookings/{id}/cancel     | Authenticated  |
| GET    | /api/bookings                 | Admin only     |
| PATCH  | /api/bookings/{id}/status     | Admin only     |
| PATCH  | /api/bookings/{id}/payment    | Admin only     |

### Users
| Method | Endpoint              | Access         |
|--------|-----------------------|----------------|
| GET    | /api/users/me         | Authenticated  |
| PUT    | /api/users/me         | Authenticated  |

### Admin
| Method | Endpoint                       | Access     |
|--------|--------------------------------|------------|
| GET    | /api/admin/dashboard           | Admin only |
| GET    | /api/admin/users               | Admin only |
| PATCH  | /api/admin/users/{id}/toggle   | Admin only |

---

## 🔧 Environment Configuration

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vehicle_rental_db
spring.datasource.username=root
spring.datasource.password=your_password
app.jwt.secret=your_64_char_hex_secret
app.jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:3000
```

### Frontend (`.env` — optional)
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📦 Build for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/vehicle-rental-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License
MIT License — free to use and modify.
