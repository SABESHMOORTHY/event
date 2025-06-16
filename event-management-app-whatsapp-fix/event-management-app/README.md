# EventHub - Event Management Web Application

A complete fullstack Event Management Web Application built with React frontend and Spring Boot backend.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Role-based access control (User/Admin)
- Secure password hashing with BCrypt
- Session management with JWT tokens

### Event Management
- Create, edit, and delete events
- Event categories (Technology, Business, Arts, Sports, etc.)
- Event registration and participant management
- Search and filter events by category, date, and status
- Event status tracking (Upcoming, Ongoing, Completed, Cancelled)

### User Dashboard
- View registered events
- View organized events
- Event management for organizers
- Profile management

### Admin Dashboard
- User management and statistics
- System-wide event oversight
- Admin-only features and controls

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive UI framework
- **Axios** - HTTP client for API calls
- **Font Awesome** - Icons and visual elements
- **Vite** - Fast build tool and development server

### Backend
- **Spring Boot 2.7** - Java web framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **JWT (JSON Web Tokens)** - Stateless authentication
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management and build tool

## 📁 Project Structure

```
event-management-app/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                # React Context for state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/               # API service layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── server/                          # Spring Boot Backend
    ├── src/main/java/com/eventmanagement/
    │   ├── config/                 # Security and JWT configuration
    │   │   ├── AuthEntryPointJwt.java
    │   │   ├── AuthTokenFilter.java
    │   │   ├── JwtUtils.java
    │   │   ├── UserDetailsImpl.java
    │   │   ├── UserDetailsServiceImpl.java
    │   │   └── WebSecurityConfig.java
    │   ├── controller/             # REST API controllers
    │   │   ├── AuthController.java
    │   │   ├── EventController.java
    │   │   └── UserController.java
    │   ├── dto/                    # Data Transfer Objects
    │   │   ├── LoginRequest.java
    │   │   ├── SignupRequest.java
    │   │   ├── JwtResponse.java
    │   │   ├── MessageResponse.java
    │   │   ├── EventRequest.java
    │   │   └── EventResponse.java
    │   ├── model/                  # JPA Entity models
    │   │   ├── User.java
    │   │   ├── Event.java
    │   │   ├── Role.java
    │   │   └── EventStatus.java
    │   ├── repository/             # JPA Repositories
    │   │   ├── UserRepository.java
    │   │   └── EventRepository.java
    │   ├── service/                # Business logic layer
    │   │   ├── EventService.java
    │   │   └── UserService.java
    │   └── EventManagementApplication.java
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 🚀 Getting Started

### Prerequisites
- Java 11 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies and compile:
   ```bash
   mvn clean compile
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev --host
   # or
   npm run dev -- --host
   ```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Database Configuration
The application uses H2 in-memory database by default. Database configuration can be found in `server/src/main/resources/application.properties`.

### JWT Configuration
JWT secret and expiration settings are configured in the application properties file.

### CORS Configuration
CORS is configured to allow requests from the frontend application running on port 5173.

## 📱 Usage

1. **Registration**: Create a new account using the signup form
2. **Login**: Sign in with your credentials
3. **Browse Events**: View and search for available events
4. **Create Events**: Organize your own events (authenticated users)
5. **Register for Events**: Join events that interest you
6. **Dashboard**: Manage your events and registrations
7. **Admin Features**: Access admin dashboard for user and system management

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Bootstrap UI**: Clean and professional interface
- **Interactive Components**: Dynamic forms, modals, and navigation
- **Real-time Feedback**: Loading states and error handling
- **Intuitive Navigation**: Clear routing and user flow

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: Secure BCrypt password encryption
- **Role-based Access**: Different permissions for users and admins
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Frontend and backend validation

## 🚀 Deployment

The application is designed to be easily deployable:

- **Frontend**: Can be built and deployed as static files
- **Backend**: Can be packaged as a JAR file and deployed to any Java-compatible server
- **Database**: Can be easily switched to PostgreSQL or MySQL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Bootstrap team for the responsive CSS framework
- All contributors and testers

---

**EventHub** - Connecting people through amazing events! 🎉

