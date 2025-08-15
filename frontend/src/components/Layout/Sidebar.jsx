import React from 'react';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronRight,
  FileText,
  MessageCircle,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'announcements', label: 'Announcements', icon: MessageSquare }
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'students', label: 'Students', icon: Users },
        { id: 'teachers', label: 'Teachers', icon: GraduationCap },
        { id: 'classes', label: 'Classes', icon: BookOpen },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'grades', label: 'Grades', icon: BarChart3 },
        { id: 'exams', label: 'Exams', icon: FileText },
        { id: 'finance', label: 'Finance', icon: DollarSign },
        { id: 'promotions', label: 'Promotions', icon: GraduationCap },
        { id: 'fee-reminders', label: 'Fee Reminders', icon: MessageSquare },
        { id: 'class-export', label: 'Class Export', icon: FileText },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'chat', label: 'Messages', icon: MessageCircle },
        { id: 'resources', label: 'Resources', icon: FolderOpen },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ],
      teacher: [
        { id: 'students', label: 'My Students', icon: Users },
        { id: 'classes', label: 'My Classes', icon: BookOpen },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'grades', label: 'Grades', icon: BarChart3 },
        { id: 'exams', label: 'Exams', icon: FileText },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'calendar', label: 'Schedule', icon: Calendar },
        { id: 'chat', label: 'Messages', icon: MessageCircle },
        { id: 'resources', label: 'Resources', icon: FolderOpen },
        { id: 'profile', label: 'Profile', icon: Users }
      ],
      student: [
        { id: 'grades', label: 'My Grades', icon: BarChart3 },
        { id: 'classes', label: 'My Classes', icon: BookOpen },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'exams', label: 'Exams', icon: FileText },
        { id: 'fees', label: 'Fee Status', icon: DollarSign },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'calendar', label: 'Schedule', icon: Calendar },
        { id: 'chat', label: 'Messages', icon: MessageCircle },
        { id: 'resources', label: 'Resources', icon: FolderOpen },
        { id: 'profile', label: 'Profile', icon: Users }
      ],
      parent: [
        { id: 'students', label: 'My Children', icon: Users },
        { id: 'grades', label: 'Grades', icon: BarChart3 },
        { id: 'fees', label: 'Fee Status', icon: DollarSign },
        { id: 'calendar', label: 'Schedule', icon: Calendar }
      ],
      accountant: [
        { id: 'fees', label: 'Fee Management', icon: DollarSign },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'reports', label: 'Financial Reports', icon: BarChart3 }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user?.role] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0 md:static md:inset-0`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">EduManage</h2>
              <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-gray-300'}`} />
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;