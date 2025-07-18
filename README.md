# School Management System

A comprehensive web-based school management system built with React.js frontend and Node.js backend. This system provides complete functionality for managing students, teachers, classes, grades, fees, attendance, and announcements.

## 🚀 Features

### Core Modules

- **User Management** - Admin, Teacher, Student, Parent, and Accountant roles
- **Student Management** - Student registration, profiles, and academic records
- **Teacher Management** - Teacher profiles, assignments, and schedules
- **Class Management** - Class creation, scheduling, and timetable management
- **Grade Management** - Grade recording, report cards, and academic assessments
- **Fee Management** - Fee structure, payment tracking, and financial reports
- **Attendance Management** - Daily attendance tracking and reporting
- **Announcement System** - School-wide announcements and notifications

### Dashboard Features

- **Admin Dashboard** - Complete system overview with analytics and management tools
- **Teacher Dashboard** - Class schedules, student grades, and attendance tracking
- **Student Dashboard** - Personal academic records, schedules, and announcements

### Additional Features

- **Calendar Integration** - Academic calendar and event management
- **Email Notifications** - Automated emails for announcements, grades, and fee reminders
- **Real-time Updates** - Socket.io integration for live notifications
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Security** - JWT authentication, role-based access control, and data validation

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization and charts
- **Date-fns** - Date manipulation utilities

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Socket.io** - Real-time communication
- **Nodemailer** - Email service integration
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation middleware
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run setup
```

### 3. Environment Configuration

#### Backend Configuration

```bash
cd backend/server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/school_management
DB_NAME=school_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourschool.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Frontend Configuration

```bash
cd frontend
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 4. Database Setup

Start MongoDB service:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. Seed Initial Data

```bash
npm run seed
```

### 6. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run frontend:dev  # Frontend on http://localhost:5173
npm run backend:dev   # Backend on http://localhost:3001
```

## 🔐 Initial Setup

### Create Initial Admin User

After starting the backend server, create your first admin user:

```bash
curl -X POST http://localhost:3001/api/auth/create-initial-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "School Administrator",
    "email": "admin@yourschool.com",
    "password": "SecurePassword123!"
  }'
```

### Default Login Credentials

After seeding, you can use these default credentials:

**Admin:**

- Email: admin@school.com
- Password: admin123

**Teacher:**

- Email: teacher@school.com
- Password: teacher123

**Student:**

- Email: student@school.com
- Password: student123

> ⚠️ **Important:** Change these default passwords immediately in production!

## 📁 Project Structure

```
school-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Dashboard/   # Dashboard components
│   │   │   ├── Layout/      # Layout components
│   │   │   ├── Students/    # Student management
│   │   │   ├── Teachers/    # Teacher management
│   │   │   ├── Classes/     # Class management
│   │   │   ├── Grades/      # Grade management
│   │   │   ├── Fees/        # Fee management
│   │   │   ├── Attendance/  # Attendance management
│   │   │   └── Announcements/ # Announcement system
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS and styling files
│   ├── public/              # Static assets
│   └── package.json
├── backend/
│   └── server/              # Node.js backend application
│       ├── routes/          # API route handlers
│       ├── models/          # MongoDB data models
│       ├── middleware/      # Express middleware
│       ├── services/        # Business logic services
│       ├── utils/           # Utility functions
│       ├── config/          # Configuration files
│       └── scripts/         # Database scripts
├── docs/                    # Documentation
├── package.json            # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Level Scripts

```bash
npm run dev              # Start both frontend and backend in development
npm run setup            # Install all dependencies and seed database
npm run frontend:dev     # Start only frontend development server
npm run backend:dev      # Start only backend development server
npm run frontend:build   # Build frontend for production
npm run backend:build    # Build backend for production
npm run seed             # Seed database with initial data
npm run clean            # Clean all node_modules and build files
npm run lint             # Run linting on both frontend and backend
```

### Frontend Scripts

```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend Scripts

```bash
cd backend/server
npm run dev              # Start with nodemon (development)
npm start                # Start production server
npm run seed             # Seed database with sample data
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/create-initial-admin` - Create initial admin
- `GET /api/auth/me` - Get current user profile

### User Management

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers

- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes

- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Grades

- `GET /api/grades` - Get grades
- `POST /api/grades` - Create grade entry
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Fees

- `GET /api/fees` - Get fee records
- `POST /api/fees` - Create fee record
- `PUT /api/fees/:id` - Update fee record
- `DELETE /api/fees/:id` - Delete fee record

### Attendance

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance record

### Announcements

- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Different permissions for different user roles
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Cross-origin resource sharing setup
- **Helmet Security** - Security headers and protection
- **Environment Variables** - Sensitive data protection

## 🎨 User Interface

The application features a modern, responsive design with:

- **Clean Dashboard** - Role-specific dashboards for different user types
- **Mobile Responsive** - Works seamlessly on all device sizes
- **Dark/Light Theme** - User preference-based theming
- **Interactive Charts** - Data visualization with Recharts
- **Modern Icons** - Lucide React icon library
- **Smooth Animations** - CSS transitions and animations
- **Accessible Design** - WCAG compliance and keyboard navigation

## 📊 Database Schema

### Collections

#### Users

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String, // 'admin', 'teacher', 'student', 'parent', 'accountant'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Students

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  studentId: String,
  class: ObjectId, // Reference to Classes
  dateOfBirth: Date,
  address: String,
  parentContact: String,
  enrollmentDate: Date,
  isActive: Boolean
}
```

#### Teachers

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  teacherId: String,
  subjects: [String],
  classes: [ObjectId], // References to Classes
  qualification: String,
  experience: Number,
  joinDate: Date,
  isActive: Boolean
}
```

#### Classes

```javascript
{
  _id: ObjectId,
  name: String,
  grade: String,
  section: String,
  classTeacher: ObjectId, // Reference to Teachers
  subjects: [String],
  maxStudents: Number,
  academicYear: String,
  isActive: Boolean
}
```

## 🚀 Deployment

### Production Build

1. **Build Frontend:**

```bash
npm run frontend:build
```

2. **Prepare Backend:**

```bash
npm run backend:build
```

3. **Environment Setup:**
   - Update production environment variables
   - Configure production database
   - Set up email service
   - Configure file upload paths

### Docker Deployment

```bash
# Build and start containers
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Manual Deployment

1. **Server Setup:**

   - Install Node.js and MongoDB on production server
   - Configure reverse proxy (Nginx/Apache)
   - Set up SSL certificates
   - Configure firewall rules

2. **Application Deployment:**
   - Clone repository on server
   - Install dependencies
   - Set production environment variables
   - Start application with PM2 or similar process manager

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend/server && npm test

# Run all tests
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@yourschool.com or create an issue in the GitHub repository.

## 📞 Contact

- **Project Maintainer:** School Management Team
- **Email:** admin@yourschool.com
- **GitHub:** [https://github.com/yourusername/school-management-system](https://github.com/yourusername/school-management-system)

## 🙏 Acknowledgments

- React.js team for the amazing frontend framework
- Express.js team for the robust backend framework
- MongoDB team for the flexible database solution
- All contributors who have helped improve this project

---

**Made with ❤️ for educational institutions worldwide**
