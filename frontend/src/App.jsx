import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import StudentManagement from './components/Students/StudentManagement';
import TeacherManagement from './components/Teachers/TeacherManagement';
import ClassManagement from './components/Classes/ClassManagement';
import GradeManagement from './components/Grades/GradeManagement';
import FeeManagement from './components/Fees/FeeManagement';
import AnnouncementManagement from './components/Announcements/AnnouncementManagement';
import CalendarView from './components/Calendar/CalendarView';
import UserManagement from './components/UserManagement.jsx';
import AttendanceManagement from './components/Attendance/AttendanceManagement';
import ProfileSettings from './components/Profile/ProfileSettings';
import ExamManagement from './components/Exams/ExamManagement';
import FinanceModule from './components/Finance/FinanceModule';
import ChatInterface from './components/Communication/ChatInterface';
import ResourceLibrary from './components/Resources/ResourceLibrary';
import AnalyticsReports from './components/Analytics/AnalyticsReports';
import TimetableManagement from './components/Timetable/TimetableManagement';
import TimetableViewer from './components/Timetable/TimetableViewer';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <StudentDashboard />; // Parent sees similar view to student
      case 'accountant':
        return <AdminDashboard />; // Accountant sees admin-like view
      default:
        return <AdminDashboard />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'grades':
        return <GradeManagement />;
      case 'fees':
        return <FeeManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'announcements':
        return <AnnouncementManagement />;
      case 'users':
        return <UserManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'profile':
        return <ProfileSettings />;
      case 'exams':
        return <ExamManagement />;
      case 'finance':
        return <FinanceModule />;
      case 'chat':
        return <ChatInterface />;
      case 'resources':
        return <ResourceLibrary />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'timetable':
        return user?.role === 'student' ? <TimetableViewer /> : <TimetableManagement />;
      case 'settings':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-2">Settings will be implemented here</p>
        </div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;