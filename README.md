# 🍽️ Digital Recipe Organizer (Full Stack Project)

A full-stack **Digital Recipe Organizer** web application built using **Spring Boot, MongoDB, React (Vite), Tailwind CSS, and JWT Authentication**. This application allows users to securely register, log in, and manage recipes with a modern UI and secure backend APIs.

---

## 🚀 Features

- ✅ User Registration & Login with **JWT Authentication**
- ✅ Secure Password Storage using **BCrypt**
- ✅ Add, Edit, Delete & View Recipes (Full CRUD)
- ✅ Recipe Search Functionality (by title)
- ✅ Ingredient-based Recipe Management
- ✅ Secure API Access using **Bearer Token**
- ✅ MongoDB NoSQL Database Integration
- ✅ Responsive UI using **Tailwind CSS**
- ✅ Clean REST API Architecture

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- JavaScript
- Fetch API / Axios

**Backend:**
- Java 21
- Spring Boot
- Spring Security
- JWT (JSON Web Tokens)
- MongoDB
- Maven

**Database:**
- MongoDB (NoSQL)

---

## 📁 Project Structure
```
recipe-organizer/
├── backend/           # Spring Boot Backend
├── recipe-frontend/   # React Frontend (Vite + Tailwind)
└── README.md
```

---

## ⚙️ Backend Setup (Spring Boot)

1. **Navigate to backend folder:**
```bash
   cd recipe-organizer
```

2. **Run the backend:**
```bash
   mvn spring-boot:run
```

3. **Backend will run on:**
```
   http://localhost:8080
```

4. **MongoDB must be running on:**
```
   mongodb://localhost:27017/recipeOrganizer
```

---

## 🎨 Frontend Setup (React + Vite + Tailwind)

1. **Navigate to frontend folder:**
```bash
   cd recipe-frontend
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Start frontend:**
```bash
   npm run dev
```

4. **Frontend will run on:**
```
   http://localhost:5173
```

---

## 🔐 Authentication Flow

1. User registers → password stored using **BCrypt hashing**
2. On login → **JWT token** is generated
3. Token is stored in browser **localStorage**
4. Token is sent with every API request as:
```
   Authorization: Bearer <token>
```

---

## 📌 REST API Endpoints

### 🔹 Auth APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### 🔹 Recipe APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes |
| POST | `/api/recipes` | Add recipe |
| PUT | `/api/recipes/{id}` | Update recipe |
| DELETE | `/api/recipes/{id}` | Delete recipe |

---

## 📄 Environment Configuration

Add this to `application.properties`:
```properties
jwt.secret=YourSecretKeyHere
spring.data.mongodb.database=recipeOrganizer
spring.data.mongodb.uri=mongodb://localhost:27017/recipeOrganizer
```

---

## 🧠 Interview Highlights

- Implemented secure authentication using **JWT & BCrypt**
- Designed scalable **MongoDB NoSQL schema**
- Built secure **REST APIs** using Spring Boot
- Integrated protected routes using **Spring Security**
- Developed responsive UI using **React + Tailwind**
- Implemented full **CRUD workflow** with real-time updates

---

## 📌 Future Enhancements

- ✅ User-specific recipe ownership
- ✅ Favorite Recipes
- ✅ Recipe Images Upload
- ✅ Meal Planner
- ✅ Admin Dashboard
- ✅ Cloud Deployment (AWS / Render)

---

## 👨‍💻 Author

**Shinjini Sarkar**  
Java Full Stack Developer  
Spring Boot • React • MongoDB • JWT

---

⭐ **If you like this project, give it a star on GitHub!**