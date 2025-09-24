import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import StudentManagement from './components/Students/StudentManagement';
import TeacherManagement from './components/Teachers/TeacherManagement';
import ClassManagement from './components/Classes/ClassManagement';
import GradeManagement from './components/Grades/GradeManagement';
import FeeManagement from './components/Fees/FeeManagement';
import AttendanceManagement from './components/Attendance/AttendanceManagement';
import EnhancedAttendanceManagement from './components/Attendance/EnhancedAttendanceManagement';
import AnnouncementManagement from './components/Announcements/AnnouncementManagement';
import ParentManagement from './components/Parents/ParentManagement';
import SubjectManagement from './components/Subjects/SubjectManagement';
import LibraryManagement from './components/Library/LibraryManagement';
import TransportManagement from './components/Transport/TransportManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard Routes */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<EnhancedDashboard />} />
              <Route path="dashboard/classic" element={<Dashboard />} />
              
              {/* Core Management Routes */}
              <Route path="students" element={<StudentManagement />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="parents" element={<ParentManagement />} />
              <Route path="subjects" element={<SubjectManagement />} />
              
              {/* Academic Management Routes */}
              <Route path="grades" element={<GradeManagement />} />
              <Route path="attendance" element={<EnhancedAttendanceManagement />} />
              <Route path="attendance/classic" element={<AttendanceManagement />} />
              
              {/* Financial Management Routes */}
              <Route path="fees" element={<FeeManagement />} />
              
              {/* Additional Services Routes */}
              <Route path="library" element={<LibraryManagement />} />
              <Route path="transport" element={<TransportManagement />} />
              
              {/* Communication Routes */}
              <Route path="announcements" element={<AnnouncementManagement />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;