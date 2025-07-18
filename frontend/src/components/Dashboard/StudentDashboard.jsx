import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, Clock, Target, TrendingUp, CheckCircle, AlertTriangle, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const StudentDashboard = () => {
  const [studentStats, setStudentStats] = useState({
    overallGrade: '-',
    attendance: 0,
    assignments: 0,
    upcomingExams: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [gradesTrend, setGradesTrend] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch student dashboard data from backend
    const fetchStudentDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the dedicated student dashboard endpoint
        const dashboardRes = await fetch(`${API_URL}/api/dashboard/student`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          const data = dashboardData.data;
          
          // Set stats
          setStudentStats({
            overallGrade: data.stats.overallGrade,
            attendance: data.stats.attendance,
            assignments: data.stats.pendingAssignments,
            upcomingExams: data.stats.upcomingExams
          });
          
          // Set today's schedule
          setTodaySchedule(data.todaySchedule || []);
          
          // Set recent grades
          setRecentGrades(data.recentGrades?.map(grade => ({
            subject: grade.subjectName,
            type: grade.examType,
            grade: grade.score,
            maxGrade: grade.maxScore,
            date: new Date(grade.date).toLocaleDateString()
          })) || []);
          
          // Set assignments
          setAssignments(data.assignments || []);
          
          // Set subject performance
          setSubjectPerformance(data.subjects?.map(subj => ({
            subject: subj.subject,
            current: subj.average,
            target: 90
          })) || []);
          
          // Mock grades trend for now
          setGradesTrend([
            { month: 'Jan', average: 85 },
            { month: 'Feb', average: 88 },
            { month: 'Mar', average: 82 },
            { month: 'Apr', average: 90 },
            { month: 'May', average: 87 },
            { month: 'Jun', average: 92 }
          ]);
          
          // Set attendance data
          const attendanceRate = data.stats.attendance;
          const totalDays = 100; // Mock total days
          const presentDays = Math.round((attendanceRate / 100) * totalDays);
          const absentDays = totalDays - presentDays;
          
          setAttendanceData([
            { name: 'Present', value: presentDays, color: '#10B981' },
            { name: 'Absent', value: absentDays, color: '#EF4444' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch student dashboard data:', error);
        // Set default values on error
        setStudentStats({
          overallGrade: '-',
          attendance: 0,
          assignments: 0,
          upcomingExams: 0
        });
      }
    };
    
    fetchStudentDashboard();

    // Mock weekly schedule for now - this would come from a real API
    setWeeklySchedule([
      { day: 'Monday', time: '09:00 AM', subject: 'Mathematics', teacher: 'John Smith', room: 'Room 101' },
      { day: 'Monday', time: '11:00 AM', subject: 'Physics', teacher: 'Maria Garcia', room: 'Room 203' },
      { day: 'Tuesday', time: '09:00 AM', subject: 'Chemistry', teacher: 'David Lee', room: 'Room 105' },
      { day: 'Tuesday', time: '11:00 AM', subject: 'English', teacher: 'Sarah Wilson', room: 'Room 201' },
      { day: 'Wednesday', time: '09:00 AM', subject: 'Biology', teacher: 'Maria Garcia', room: 'Room 204' },
      { day: 'Wednesday', time: '11:00 AM', subject: 'Mathematics', teacher: 'John Smith', room: 'Room 101' }
    ]);
  }, [API_URL]);

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
          Student Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Track your academic progress and stay organized</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Grade"
          value={studentStats.overallGrade}
          icon={Award}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Current semester"
        />
        <StatCard
          title="Attendance"
          value={`${studentStats.attendance}%`}
          icon={CheckCircle}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="This month"
        />
        <StatCard
          title="Assignments"
          value={studentStats.assignments}
          icon={BookOpen}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Pending"
        />
        <StatCard
          title="Upcoming Exams"
          value={studentStats.upcomingExams}
          icon={Calendar}
          color="bg-gradient-to-r from-orange-500 to-red-500"
          subtitle="This month"
        />
      </div>

      {/* Today's Schedule and Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Classes</h3>
          <div className="space-y-3">
            {todaySchedule.map((schedule) => (
              <div key={schedule.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.subject}</h4>
                    <p className="text-sm text-gray-600">{schedule.teacher} • {schedule.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{schedule.time}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-xs text-blue-600">Upcoming</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{grade.subject}</p>
                  <p className="text-sm text-gray-600">{grade.type} • {grade.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    grade.grade >= 90 ? 'bg-green-100 text-green-800' :
                    grade.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                    grade.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {grade.grade}/{grade.maxGrade}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{((grade.grade / grade.maxGrade) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance and Grades Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#3B82F6" name="Current Grade" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#E5E7EB" name="Target Grade" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grades Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Grade Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gradesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assignments and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Assignments</h3>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-sm text-gray-600">{assignment.subject} • Due: {assignment.dueDate}</p>
                </div>
                <div className="flex items-center">
                  {assignment.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {assignment.status === 'in-progress' && <Clock className="w-5 h-5 text-blue-500" />}
                  {assignment.status === 'pending' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {assignment.status === 'in-progress' ? 'In Progress' : assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{studentStats.attendance}%</p>
            <p className="text-sm text-gray-600">Overall Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">View Assignments</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Award className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-900">Check Grades</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">View Schedule</span>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
            <Target className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Set Goals</span>
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
                    <th className="px-2 py-1 text-left">Subject</th>
                    <th className="px-2 py-1 text-left">Teacher</th>
                    <th className="px-2 py-1 text-left">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{item.day}</td>
                      <td className="px-2 py-1">{item.time}</td>
                      <td className="px-2 py-1">{item.subject}</td>
                      <td className="px-2 py-1">{item.teacher}</td>
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

export default StudentDashboard;