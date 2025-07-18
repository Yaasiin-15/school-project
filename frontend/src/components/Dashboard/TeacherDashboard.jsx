import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, Award, Clock, CheckCircle, AlertCircle, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const TeacherDashboard = () => {
  const [teacherStats, setTeacherStats] = useState({
    myStudents: 0,
    myClasses: 0,
    pendingGrades: 0,
    upcomingClasses: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [classPerformanceData, setClassPerformanceData] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    // Fetch teacher dashboard data from backend
    const fetchTeacherDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the dedicated teacher dashboard endpoint
        const dashboardRes = await fetch(`${API_URL}/api/dashboard/teacher`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          const data = dashboardData.data;
          
          // Set stats
          setTeacherStats(data.stats);
          
          // Set today's schedule
          setTodaySchedule(data.todaySchedule || []);
          
          // Set recent grades
          setRecentGrades(data.recentGrades?.map(grade => ({
            student: grade.studentName,
            subject: grade.subjectName,
            grade: `${grade.score}/${grade.maxScore}`,
            date: new Date(grade.date).toLocaleDateString()
          })) || []);
          
          // Set class performance
          setClassPerformanceData(data.classPerformance || []);
          
          // Mock attendance trend for now
          setAttendanceTrend([
            { week: 'Week 1', attendance: 95 },
            { week: 'Week 2', attendance: 92 },
            { week: 'Week 3', attendance: 88 },
            { week: 'Week 4', attendance: 94 }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch teacher dashboard data:', error);
        // Set default values on error
        setTeacherStats({
          myStudents: 0,
          myClasses: 0,
          pendingGrades: 0,
          upcomingClasses: 0
        });
      }
    };
    
    fetchTeacherDashboard();
  }, [API_URL]);

  useEffect(() => {
    // Fetch weekly schedule for timetable
    const fetchWeeklySchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/classes/schedule/teacher/me?weekly=true`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setWeeklySchedule(data.data?.weeklySchedule || []);
      } catch (e) {
        setWeeklySchedule([]);
      }
    };
    fetchWeeklySchedule();
  }, [API_URL]);

  // Helper to get week number
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('timetable')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'timetable' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}><Table className="inline w-5 h-5 mr-2" />Timetable</button>
      </div>
      {activeTab === 'dashboard' && (
        <>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your classes and students</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Students"
          value={teacherStats.myStudents}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Across all classes"
        />
        <StatCard
          title="My Classes"
          value={teacherStats.myClasses}
          icon={BookOpen}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Active this semester"
        />
        <StatCard
          title="Pending Grades"
          value={teacherStats.pendingGrades}
          icon={Award}
          color="bg-gradient-to-r from-orange-500 to-red-500"
          subtitle="Need to be entered"
        />
        <StatCard
          title="Today's Classes"
          value={teacherStats.upcomingClasses}
          icon={Calendar}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Remaining"
        />
      </div>

      {/* Today's Schedule and Class Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.map((schedule) => (
              <div key={schedule.id} className={`p-4 rounded-lg border-l-4 ${
                schedule.status === 'completed' ? 'border-green-500 bg-green-50' :
                schedule.status === 'current' ? 'border-blue-500 bg-blue-50' :
                'border-gray-300 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.subject}</h4>
                    <p className="text-sm text-gray-600">{schedule.class} • {schedule.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{schedule.time}</p>
                    <div className="flex items-center mt-1">
                      {schedule.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
                      {schedule.status === 'current' && <Clock className="w-4 h-4 text-blue-500 mr-1" />}
                      {schedule.status === 'upcoming' && <AlertCircle className="w-4 h-4 text-gray-400 mr-1" />}
                      <span className={`text-xs capitalize ${
                        schedule.status === 'completed' ? 'text-green-600' :
                        schedule.status === 'current' ? 'text-blue-600' :
                        'text-gray-500'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Class Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Grades and Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Grades Entered</h3>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{grade.student}</p>
                  <p className="text-sm text-gray-600">{grade.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                    grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {grade.grade}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{grade.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Award className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Enter Grades</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Users className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-900">Take Attendance</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Create Assignment</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Calendar className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Schedule Meeting</span>
          </button>
        </div>
      </div>
        </>
      )}
      {activeTab === 'timetable' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Table className="w-6 h-6" /> Weekly Timetable</h2>
          {weeklySchedule.length === 0 ? (
            <div className="text-gray-500">No timetable data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Day</th>
                    <th className="px-2 py-1 text-left">Time</th>
                    <th className="px-2 py-1 text-left">Class</th>
                    <th className="px-2 py-1 text-left">Subject</th>
                    <th className="px-2 py-1 text-left">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{item.day}</td>
                      <td className="px-2 py-1">{item.time}</td>
                      <td className="px-2 py-1">{item.className}</td>
                      <td className="px-2 py-1">{item.subject}</td>
                      <td className="px-2 py-1">{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
