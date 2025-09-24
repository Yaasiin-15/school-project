import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck,
  TrendingUp,
  Calendar,
  Bell,
  BarChart3,
  Book,
  Bus,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalParents: 0,
      totalBooks: 0,
      attendanceToday: 0,
      overdueBooks: 0
    },
    recentActivities: [],
    upcomingEvents: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setDashboardData({
        stats: {
          totalStudents: 1250,
          totalTeachers: 85,
          totalParents: 980,
          totalBooks: 5420,
          attendanceToday: 92.5,
          overdueBooks: 23
        },
        recentActivities: [
          { id: 1, type: 'attendance', message: 'Attendance marked for Class 10A', time: '2 hours ago' },
          { id: 2, type: 'library', message: 'New book "Advanced Mathematics" added', time: '4 hours ago' },
          { id: 3, type: 'parent', message: 'Parent meeting scheduled for tomorrow', time: '6 hours ago' }
        ],
        upcomingEvents: [
          { id: 1, title: 'Parent-Teacher Meeting', date: '2024-02-15', type: 'meeting' },
          { id: 2, title: 'Science Fair', date: '2024-02-20', type: 'event' },
          { id: 3, title: 'Mid-term Exams', date: '2024-02-25', type: 'exam' }
        ],
        notifications: [
          { id: 1, message: '23 books are overdue', type: 'warning', urgent: true },
          { id: 2, message: 'Monthly attendance report ready', type: 'info', urgent: false },
          { id: 3, message: 'New parent registration pending approval', type: 'info', urgent: false }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at your school today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Students"
            value={dashboardData.stats.totalStudents}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            change="+5.2%"
          />
          <StatCard
            title="Teachers"
            value={dashboardData.stats.totalTeachers}
            icon={<GraduationCap className="w-6 h-6" />}
            color="green"
            change="+2.1%"
          />
          <StatCard
            title="Parents"
            value={dashboardData.stats.totalParents}
            icon={<Users className="w-6 h-6" />}
            color="purple"
            change="+3.8%"
          />
          <StatCard
            title="Library Books"
            value={dashboardData.stats.totalBooks}
            icon={<Book className="w-6 h-6" />}
            color="indigo"
            change="+12"
          />
          <StatCard
            title="Attendance Today"
            value={`${dashboardData.stats.attendanceToday}%`}
            icon={<UserCheck className="w-6 h-6" />}
            color="emerald"
            change="+1.2%"
          />
          <StatCard
            title="Overdue Books"
            value={dashboardData.stats.overdueBooks}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
            change="-3"
            urgent={true}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {dashboardData.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      notification.urgent
                        ? 'bg-red-50 border-red-400'
                        : 'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <QuickActionButton
                icon={<UserCheck className="w-6 h-6" />}
                label="Mark Attendance"
                href="/attendance"
              />
              <QuickActionButton
                icon={<Users className="w-6 h-6" />}
                label="Manage Parents"
                href="/parents"
              />
              <QuickActionButton
                icon={<Book className="w-6 h-6" />}
                label="Library"
                href="/library"
              />
              <QuickActionButton
                icon={<BookOpen className="w-6 h-6" />}
                label="Subjects"
                href="/subjects"
              />
              <QuickActionButton
                icon={<Bus className="w-6 h-6" />}
                label="Transport"
                href="/transport"
              />
              <QuickActionButton
                icon={<BarChart3 className="w-6 h-6" />}
                label="Reports"
                href="/reports"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, change, urgent = false }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${urgent ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon, label, href }) => {
  return (
    <a
      href={href}
      className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow hover:bg-gray-50"
    >
      <div className="text-blue-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
    </a>
  );
};

// Helper functions
const getActivityIcon = (type) => {
  switch (type) {
    case 'attendance':
      return <UserCheck className="w-4 h-4 text-blue-600" />;
    case 'library':
      return <Book className="w-4 h-4 text-blue-600" />;
    case 'parent':
      return <Users className="w-4 h-4 text-blue-600" />;
    default:
      return <Bell className="w-4 h-4 text-blue-600" />;
  }
};

const getEventTypeColor = (type) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-800';
    case 'event':
      return 'bg-green-100 text-green-800';
    case 'exam':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default EnhancedDashboard;