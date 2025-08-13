import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Bell, 
  BarChart3,
  Settings,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
    pendingFees: 0,
    todayAttendance: 0,
    activeAnnouncements: 0
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      color: 'bg-blue-500',
      roles: ['admin', 'teacher', 'student', 'parent', 'accountant']
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      color: 'bg-purple-500',
      roles: ['admin']
    },
    {
      id: 'students',
      name: 'Student Management',
      icon: GraduationCap,
      color: 'bg-green-500',
      roles: ['admin', 'teacher']
    },
    {
      id: 'teachers',
      name: 'Teacher Management',
      icon: Users,
      color: 'bg-indigo-500',
      roles: ['admin']
    },
    {
      id: 'classes',
      name: 'Class Management',
      icon: BookOpen,
      color: 'bg-orange-500',
      roles: ['admin', 'teacher']
    },
    {
      id: 'grades',
      name: 'Grade Management',
      icon: FileText,
      color: 'bg-red-500',
      roles: ['admin', 'teacher']
    },
    {
      id: 'fees',
      name: 'Fee Management',
      icon: DollarSign,
      color: 'bg-yellow-500',
      roles: ['admin', 'accountant', 'parent']
    },
    {
      id: 'attendance',
      name: 'Attendance',
      icon: UserCheck,
      color: 'bg-teal-500',
      roles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      id: 'announcements',
      name: 'Announcements',
      icon: Bell,
      color: 'bg-pink-500',
      roles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      id: 'exams',
      name: 'Exam Management',
      icon: Clock,
      color: 'bg-cyan-500',
      roles: ['admin', 'teacher']
    }
  ];

  const filteredModules = modules.filter(module => 
    module.roles.includes(user?.role || 'student')
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="bg-blue-500"
          trend="+12% this month"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          color="bg-green-500"
          trend="+3% this month"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          color="bg-orange-500"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.todayAttendance}%`}
          icon={UserCheck}
          color="bg-teal-500"
          trend="+5% vs yesterday"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredModules.slice(1, 5).map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`${module.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{module.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">New student registration: John Doe</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Grade submitted for Mathematics - Class 10A</span>
            <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Fee payment received from Sarah Wilson</span>
            <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ModuleContent = ({ moduleId }) => {
    switch (moduleId) {
      case 'users':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">User Management</h3>
          <p>Manage all system users including admins, teachers, students, parents, and accountants.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Admin Users</h4>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Teachers</h4>
              <p className="text-2xl font-bold text-green-600">{stats.totalTeachers}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Students</h4>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
          </div>
        </div>;
      
      case 'students':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Student Management</h3>
          <p>Manage student registration, profiles, and academic records.</p>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Add New Student</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Import Students</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">Generate Reports</button>
          </div>
        </div>;
      
      case 'teachers':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Teacher Management</h3>
          <p>Manage teacher profiles, assignments, and schedules.</p>
          <div className="mt-4">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg mr-2">Add New Teacher</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg mr-2">Assign Classes</button>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">View Schedules</button>
          </div>
        </div>;
      
      case 'classes':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Class Management</h3>
          <p>Manage class creation, scheduling, and timetable management.</p>
          <div className="mt-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mr-2">Create Class</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">Manage Timetable</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">View Schedule</button>
          </div>
        </div>;
      
      case 'grades':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Grade Management</h3>
          <p>Manage grade recording, report cards, and academic assessments.</p>
          <div className="mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">Enter Grades</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Generate Report Cards</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Academic Reports</button>
          </div>
        </div>;
      
      case 'fees':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Fee Management</h3>
          <p>Manage fee structure, payment tracking, and financial reports.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Total Collected</h4>
              <p className="text-2xl font-bold text-green-600">$125,000</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Pending</h4>
              <p className="text-2xl font-bold text-red-600">$25,000</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Overdue</h4>
              <p className="text-2xl font-bold text-orange-600">$5,000</p>
            </div>
          </div>
        </div>;
      
      case 'attendance':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Attendance Management</h3>
          <p>Daily attendance tracking and reporting.</p>
          <div className="mt-4">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg mr-2">Mark Attendance</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">View Reports</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Generate Summary</button>
          </div>
        </div>;
      
      case 'announcements':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Announcement System</h3>
          <p>School-wide announcements and notifications.</p>
          <div className="mt-4">
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg mr-2">Create Announcement</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg mr-2">Send Notification</button>
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg">View History</button>
          </div>
        </div>;
      
      case 'exams':
        return <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Exam Management</h3>
          <p>Create and manage exams for all classes in the school.</p>
          <div className="mt-4">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg mr-2">Create School-wide Exam</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Create Class Exam</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">View Results</button>
          </div>
        </div>;
      
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-white/20 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              School Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name || 'User'}</p>
          </div>
          
          <nav className="px-4 space-y-2">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeModule === module.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{module.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {filteredModules.find(m => m.id === activeModule)?.name || 'Dashboard'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'admin' ? 'Full system access' : 
               user?.role === 'teacher' ? 'Teacher dashboard' :
               user?.role === 'student' ? 'Student portal' :
               user?.role === 'parent' ? 'Parent portal' :
               user?.role === 'accountant' ? 'Financial management' : 'Dashboard'}
            </p>
          </div>

          <ModuleContent moduleId={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;