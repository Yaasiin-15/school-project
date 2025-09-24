# School Management System

A comprehensive web-based school management system built with React.js frontend and Node.js backend. This system provides complete functionality for managing students, teachers, classes, grades, fees, attendance, and announcements.

## 🔥 Latest Updates (Authentication Fixed!)

**✅ Authentication Issues Resolved** - All login and registration problems have been fixed!

- Fixed password validation (now requires only 6+ characters)
- Enhanced CORS configuration for better compatibility
- Added comprehensive debugging tools
- Created testing interfaces for easy verification

**🧪 New Testing Tools:**

- `test-frontend-auth.html` - User-friendly authentication testing
- `test-auth-debug.html` - Comprehensive backend testing
- `AUTH_TROUBLESHOOTING_GUIDE.md` - Complete troubleshooting guide

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

## ✨ Key Features

### 🎯 Core Management

- **👥 Student Management**: Complete student lifecycle from admission to graduation
- **👨‍🏫 Teacher Management**: Staff profiles, qualifications, performance tracking
- **👪 Parent Management**: Parent portals, communication, progress monitoring
- **🏫 Class Management**: Dynamic class creation, enrollment, teacher assignments
- **📚 Subject Management**: Curriculum planning, subject-teacher mapping

### 📊 Academic Excellence

- **📋 Attendance System**: Real-time tracking, automated reports, parent notifications
- **🎯 Grade Management**: Comprehensive assessment, report cards, progress analytics
- **📅 Timetable Management**: Intelligent scheduling, conflict resolution, resource optimization
- **📝 Examination System**: Exam planning, result processing, statistical analysis
- **💰 Financial Management**: Fee automation, payment processing, financial analytics
- **💾 Backup**: Automated data backup and recovery systems

### 🏗️ System Administration

- **🔧 System Configuration**: Customizable settings, school branding, academic year setup
- **📈 Analytics & Reports**: Comprehensive reporting dashboard with data visualization
- **🔔 Notification Center**: Multi-channel notifications (email, SMS, in-app)
- **🌐 Multi-language Support**: Internationalization for global accessibility
- **📱 Mobile App Integration**: Native mobile app support for iOS and Android
- **🔄 Data Import/Export**: Bulk data operations, CSV/Excel integration
- **🎨 Theme Customization**: Custom branding, logos, color schemes
- **⚡ Performance Monitoring**: System health monitoring and optimization

### 🛡️ Advanced Security

- **🔐 Two-Factor Authentication**: Enhanced security with 2FA support
- **📊 Audit Logs**: Complete activity tracking and compliance reporting
- **🚫 Access Control**: IP whitelisting, session management, device tracking
- **🔒 Data Encryption**: End-to-end encryption for sensitive information
- **🛡️ GDPR Compliance**: Privacy controls and data protection features
- **🚨 Security Alerts**: Real-time security monitoring and threat detection

### 📚 Academic Features

- **📖 Library Management**: Book inventory, lending system, digital resources
- **🚌 Transport Management**: Route planning, vehicle tracking, student pickup
- **🏥 Health Records**: Medical information, vaccination tracking, health reports
- **🎯 Homework Management**: Assignment distribution, submission tracking
- **📋 Event Management**: School events, calendar integration, RSVP system
- **🏆 Achievement Tracking**: Awards, certificates, student accomplishments

### 💼 Administrative Tools

- **📊 Resource Management**: Classroom allocation, equipment tracking
- **💳 Payment Gateway**: Multiple payment options, online fee collection
- **📞 Communication Hub**: Messaging system, video conferencing integration
- **📝 Document Management**: Digital file storage, document templates
- **🔄 Workflow Automation**: Automated processes, approval workflows
- **📈 Performance Analytics**: Student progress tracking, predictive analytics

## User Roles & Permissions

### Admin

- Full system access
- User management
- System configuration
- All CRUD operations

### Teacher

- Student management (limited)
- Grade management
- Attendance marking
- Class management
- Communication access

### Student

- View own records
- Access timetable
- View grades and attendance
- Event participation

### Parent

- View child's records
- Communication with teachers
- Fee payment access
- Event information

### Accountant

- Fee management and collection
- Financial reporting and analytics
- Payment processing and tracking
- Budget planning and monitoring
- Invoice generation and management

## 🖥️ Server Implementation

### 🎯 Core Management APIs

#### 👥 Student Management

```javascript
// Backend Routes: /api/students
GET    /api/students              // List all students with pagination
POST   /api/students              // Create new student profile
GET    /api/students/:id          // Get student details
PUT    /api/students/:id          // Update student information
DELETE /api/students/:id          // Soft delete student
GET    /api/students/:id/academic // Get academic history
POST   /api/students/bulk-import  // Bulk import from CSV/Excel
GET    /api/students/reports      // Generate student reports
```

#### 👨‍🏫 Teacher Management

```javascript
// Backend Routes: /api/teachers
GET    /api/teachers              // List all teachers
POST   /api/teachers              // Create teacher profile
GET    /api/teachers/:id          // Get teacher details
PUT    /api/teachers/:id          // Update teacher information
DELETE /api/teachers/:id          // Soft delete teacher
GET    /api/teachers/:id/schedule // Get teacher schedule
POST   /api/teachers/:id/assign   // Assign subjects/classes
GET    /api/teachers/performance  // Performance analytics
```

#### 👪 Parent Management

```javascript
// Backend Routes: /api/parents
GET    /api/parents               // List all parents
POST   /api/parents               // Create parent profile
GET    /api/parents/:id           // Get parent details
PUT    /api/parents/:id           // Update parent information
GET    /api/parents/:id/children  // Get linked children
POST   /api/parents/link-child    // Link parent to student
GET    /api/parents/communications // Parent-teacher messages
```

#### 🏫 Class Management

```javascript
// Backend Routes: /api/classes
GET    /api/classes               // List all classes
POST   /api/classes               // Create new class
GET    /api/classes/:id           // Get class details
PUT    /api/classes/:id           // Update class information
DELETE /api/classes/:id           // Delete class
POST   /api/classes/:id/enroll    // Enroll students
GET    /api/classes/:id/students  // Get class roster
POST   /api/classes/timetable     // Generate timetable
```

#### 📚 Subject Management

```javascript
// Backend Routes: /api/subjects
GET    /api/subjects              // List all subjects
POST   /api/subjects              // Create new subject
GET    /api/subjects/:id          // Get subject details
PUT    /api/subjects/:id          // Update subject
DELETE /api/subjects/:id          // Delete subject
POST   /api/subjects/curriculum   // Curriculum planning
GET    /api/subjects/mapping      // Subject-teacher mapping
```

### 📊 Academic Excellence APIs

#### 📋 Attendance System

```javascript
// Backend Routes: /api/attendance
GET    /api/attendance            // Get attendance records
POST   /api/attendance/mark       // Mark attendance
PUT    /api/attendance/:id        // Update attendance
GET    /api/attendance/reports    // Generate reports
POST   /api/attendance/bulk       // Bulk attendance marking
GET    /api/attendance/analytics  // Attendance analytics
POST   /api/attendance/notify     // Send parent notifications
```

#### 🎯 Grade Management

```javascript
// Backend Routes: /api/grades
GET    /api/grades                // Get grade records
POST   /api/grades                // Create grade entry
PUT    /api/grades/:id            // Update grade
DELETE /api/grades/:id            // Delete grade
GET    /api/grades/reports        // Generate report cards
GET    /api/grades/analytics      // Progress analytics
POST   /api/grades/bulk           // Bulk grade entry
GET    /api/grades/transcripts    // Generate transcripts
```

#### 📅 Timetable Management

```javascript
// Backend Routes: /api/timetable
GET    /api/timetable             // Get timetables
POST   /api/timetable/generate    // Auto-generate timetable
PUT    /api/timetable/:id         // Update timetable
GET    /api/timetable/conflicts   // Check conflicts
POST   /api/timetable/optimize    // Optimize scheduling
GET    /api/timetable/resources   // Resource allocation
```

#### 📝 Examination System

```javascript
// Backend Routes: /api/exams
GET    /api/exams                 // List examinations
POST   /api/exams                 // Create exam
PUT    /api/exams/:id             // Update exam
DELETE /api/exams/:id             // Delete exam
POST   /api/exams/schedule        // Schedule exams
GET    /api/exams/results         // Process results
POST   /api/exams/analytics       // Statistical analysis
```

#### 💰 Financial Management

```javascript
// Backend Routes: /api/fees
GET    /api/fees                  // Get fee records
POST   /api/fees                  // Create fee structure
PUT    /api/fees/:id              // Update fee
GET    /api/fees/payments         // Payment tracking
POST   /api/fees/process-payment  // Process payments
GET    /api/fees/analytics        // Financial analytics
POST   /api/fees/reminders        // Send fee reminders
GET    /api/fees/reports          // Financial reports
```

### 🛡️ Security & System APIs

#### 🔐 Authentication & Authorization

```javascript
// Backend Routes: /api/auth
POST   /api/auth/login            // User login
POST   /api/auth/register         // User registration
POST   /api/auth/refresh          // Refresh JWT token
POST   /api/auth/logout           // User logout
POST   /api/auth/forgot-password  // Password reset
POST   /api/auth/2fa/enable       // Enable 2FA
POST   /api/auth/2fa/verify       // Verify 2FA token
GET    /api/auth/audit-logs       // Security audit logs
```

#### 📊 System Administration

```javascript
// Backend Routes: /api/admin
GET / api / admin / dashboard; // Admin dashboard data
POST / api / admin / backup; // Create system backup
POST / api / admin / restore; // Restore from backup
GET / api / admin / analytics; // System analytics
POST / api / admin / notifications; // Send notifications
GET / api / admin / logs; // System logs
PUT / api / admin / settings; // Update system settings
```

## 🎨 Frontend Implementation

### 🎯 Core Management Components

#### 👥 Student Management Frontend

```javascript
// Frontend Components: /src/components/Students/
StudentList.jsx; // Student listing with search/filter
StudentForm.jsx; // Add/Edit student form
StudentProfile.jsx; // Detailed student profile
StudentDashboard.jsx; // Student personal dashboard
AcademicHistory.jsx; // Academic records display
BulkImport.jsx; // CSV/Excel import interface
StudentReports.jsx; // Generate student reports
```

#### 👨‍🏫 Teacher Management Frontend

```javascript
// Frontend Components: /src/components/Teachers/
TeacherList.jsx; // Teacher listing and management
TeacherForm.jsx; // Teacher profile form
TeacherDashboard.jsx; // Teacher dashboard
ScheduleView.jsx; // Teacher schedule display
SubjectAssignment.jsx; // Subject/class assignment
PerformanceMetrics.jsx; // Teacher performance analytics
```

#### 👪 Parent Management Frontend

```javascript
// Frontend Components: /src/components/Parents/
ParentList.jsx; // Parent listing
ParentForm.jsx; // Parent registration form
ParentDashboard.jsx; // Parent portal dashboard
ChildProgress.jsx; // Child progress monitoring
CommunicationHub.jsx; // Parent-teacher communication
FeePayment.jsx; // Online fee payment interface
```

#### 🏫 Class Management Frontend

```javascript
// Frontend Components: /src/components/Classes/
ClassList.jsx; // Class listing and management
ClassForm.jsx; // Create/edit class form
ClassDashboard.jsx; // Class overview dashboard
StudentEnrollment.jsx; // Student enrollment interface
TimetableView.jsx; // Class timetable display
ResourceAllocation.jsx; // Classroom resource management
```

### 📊 Academic Excellence Components

#### 📋 Attendance System Frontend

```javascript
// Frontend Components: /src/components/Attendance/
AttendanceMarking.jsx; // Daily attendance marking
AttendanceReports.jsx; // Attendance reports and analytics
AttendanceCalendar.jsx; // Calendar view of attendance
BulkAttendance.jsx; // Bulk attendance marking
ParentNotifications.jsx; // Attendance notifications
AttendanceAnalytics.jsx; // Attendance analytics dashboard
```

#### 🎯 Grade Management Frontend

```javascript
// Frontend Components: /src/components/Grades/
GradeEntry.jsx; // Grade entry interface
GradeBook.jsx; // Teacher gradebook
ReportCards.jsx; // Generate report cards
ProgressAnalytics.jsx; // Student progress analytics
BulkGrading.jsx; // Bulk grade entry
TranscriptGenerator.jsx; // Academic transcript generation
```

#### 📅 Timetable Management Frontend

```javascript
// Frontend Components: /src/components/Timetable/
TimetableGenerator.jsx; // Auto-generate timetables
TimetableEditor.jsx; // Manual timetable editing
ConflictResolver.jsx; // Resolve scheduling conflicts
ResourceScheduler.jsx; // Resource allocation scheduler
TimetableView.jsx; // Display timetables
OptimizationTools.jsx; // Timetable optimization
```

#### 📝 Examination System Frontend

```javascript
// Frontend Components: /src/components/Exams/
ExamScheduler.jsx; // Exam scheduling interface
ExamManagement.jsx; // Exam creation and management
ResultEntry.jsx; // Result entry interface
ResultAnalytics.jsx; // Statistical analysis
ExamReports.jsx; // Exam reports generation
```

### 🎨 Dashboard & UI Components

#### 📊 Dashboard Components

```javascript
// Frontend Components: /src/components/Dashboard/
AdminDashboard.jsx; // Admin overview dashboard
TeacherDashboard.jsx; // Teacher-specific dashboard
StudentDashboard.jsx; // Student personal dashboard
ParentDashboard.jsx; // Parent portal dashboard
AnalyticsCharts.jsx; // Data visualization charts
NotificationCenter.jsx; // Real-time notifications
QuickActions.jsx; // Quick action buttons
```

#### 🎨 UI/UX Components

```javascript
// Frontend Components: /src/components/UI/
Layout.jsx; // Main application layout
Sidebar.jsx; // Navigation sidebar
Header.jsx; // Application header
Footer.jsx; // Application footer
Modal.jsx; // Reusable modal component
DataTable.jsx; // Enhanced data table
SearchFilter.jsx; // Search and filter component
LoadingSpinner.jsx; // Loading indicators
```

### 🔧 State Management & Context

#### React Context Providers

```javascript
// Frontend Context: /src/context/
AuthContext.jsx; // Authentication state management
UserContext.jsx; // User profile and permissions
ThemeContext.jsx; // Theme and UI preferences
NotificationContext.jsx; // Real-time notifications
DataContext.jsx; // Global data state
SettingsContext.jsx; // Application settings
```

### 🌐 API Integration & Services

#### Frontend Services

```javascript
// Frontend Services: /src/services/
authService.js; // Authentication API calls
studentService.js; // Student management APIs
teacherService.js; // Teacher management APIs
classService.js; // Class management APIs
gradeService.js; // Grade management APIs
attendanceService.js; // Attendance APIs
feeService.js; // Fee management APIs
reportService.js; // Report generation APIs
```

### 📱 Responsive Design & Accessibility

#### Mobile-First Components

```javascript
// Frontend Mobile: /src/components/Mobile/
MobileNavigation.jsx; // Mobile navigation menu
MobileAttendance.jsx; // Mobile attendance marking
MobileGrades.jsx; // Mobile grade viewing
MobileDashboard.jsx; // Mobile dashboard layout
TouchOptimized.jsx; // Touch-optimized interfaces
```

#### Accessibility Features

```javascript
// Frontend A11y: /src/components/Accessibility/
ScreenReader.jsx; // Screen reader support
KeyboardNavigation.jsx; // Keyboard navigation
HighContrast.jsx; // High contrast mode
FontSizeControl.jsx; // Font size adjustment
VoiceCommands.jsx; // Voice command support
```

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

## 🧪 Testing Authentication

### Quick Test (Recommended)

1. Open `test-frontend-auth.html` in your browser
2. Try the "Quick Login" with admin credentials
3. Test registration with simple passwords (6+ characters)

### Comprehensive Testing

1. Open `test-auth-debug.html` for detailed backend testing
2. Use the "Create Initial Admin" if no admin exists
3. Test all authentication endpoints

### Troubleshooting

If you encounter authentication issues, check `AUTH_TROUBLESHOOTING_GUIDE.md` for detailed solutions.

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

### Testing & Debugging Scripts

```bash
node fix-auth-issues.js  # Run automated authentication diagnostics
# Open test-frontend-auth.html in browser for user-friendly testing
# Open test-auth-debug.html in browser for comprehensive backend testing
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
- **Input Validation** - Express-validator for request validation (recently updated for better UX)
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Enhanced cross-origin resource sharing setup
- **Helmet Security** - Security headers and protection
- **Environment Variables** - Sensitive data protection
- **Debug Logging** - Authentication attempt tracking for troubleshooting

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

### Automated Tests

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend/server && npm test

# Run all tests
npm run test
```

### Authentication Testing

```bash
# Run authentication diagnostics
node fix-auth-issues.js

# Manual testing with browser tools
# 1. Open test-frontend-auth.html - User-friendly interface
# 2. Open test-auth-debug.html - Comprehensive backend testing
```

### Common Test Scenarios

- ✅ Admin user creation and login
- ✅ Student/Teacher registration with simple passwords
- ✅ JWT token generation and validation
- ✅ CORS functionality across different origins
- ✅ Password validation (6+ characters required)

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

### Authentication Issues

If you're experiencing login or registration problems:

1. Check `AUTH_TROUBLESHOOTING_GUIDE.md` for detailed solutions
2. Use the testing tools: `test-frontend-auth.html` and `test-auth-debug.html`
3. Run the diagnostic script: `node fix-auth-issues.js`

### General Support

For other support needs, email support@yourschool.com or create an issue in the GitHub repository.

### Known Issues Fixed

- ✅ 401 Unauthorized errors during login
- ✅ 400 Bad Request errors during registration
- ✅ CORS issues with frontend-backend communication
- ✅ Overly strict password validation

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
