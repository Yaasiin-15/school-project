import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Bell, Award, Calendar as CalendarIcon, Table as TableIcon, Pencil, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import CalendarView from '../Calendar/CalendarView';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch admin dashboard data from backend
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the dedicated admin dashboard endpoint
        const dashboardRes = await fetch(`${API_URL}/api/dashboard/admin`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          const data = dashboardData.data;
          
          // Set stats
          setStats(data.stats);
          
          // Set recent activities
          setRecentActivities(data.recentActivities || []);
          
          // Set grade distribution
          setGradeDistribution(data.gradeDistribution || []);
          
          // Set monthly enrollment data as performance data
          setPerformanceData(data.monthlyEnrollment?.map(item => ({
            subject: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            average: item.count
          })) || []);
          
          // Mock attendance data for now
          setAttendanceData([
            { month: 'Jan', attendance: 95 },
            { month: 'Feb', attendance: 92 },
            { month: 'Mar', attendance: 88 },
            { month: 'Apr', attendance: 94 },
            { month: 'May', attendance: 91 },
            { month: 'Jun', attendance: 89 }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values on error
        setStats({
          totalStudents: 0,
          totalTeachers: 0,
          totalClasses: 0,
          totalRevenue: 0
        });
      }
    };
    
    fetchDashboardData();
  }, [API_URL]);

  // Fetch weekly schedule for timetable
  useEffect(() => {
    if (activeTab !== 'timetable') return;
    setScheduleLoading(true);
    setScheduleError(null);
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/classes/schedule?weekly=true`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setWeeklySchedule(data.data?.weeklySchedule || []);
        setScheduleLoading(false);
      })
      .catch(e => {
        setWeeklySchedule([]);
        setScheduleError('Failed to load timetable.');
        setScheduleLoading(false);
      });
  }, [API_URL, activeTab]);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  async function handleAddTimetable(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(false);
    const form = e.target;
    const entry = {
      day: form.day.value,
      time: form.time.value,
      className: form.className.value,
      subject: form.subject.value,
      teacher: form.teacher.value,
      room: form.room.value,
      details: form.details.value,
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/classes/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error('Failed to add timetable entry');
      setAddSuccess(true);
      form.reset();
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess(false);
      }, 1200);
      // Refresh timetable
      setScheduleLoading(true);
      fetch(`${API_URL}/api/classes/schedule?weekly=true`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setWeeklySchedule(data.data?.weeklySchedule || []);
          setScheduleLoading(false);
        });
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  }

  function handleEditClick(item) { setEditModal(item); setEditError(null); setEditSuccess(false); }
  function handleDeleteClick(item) { setDeleteModal(item); setDeleteError(null); }
  async function handleEditTimetable(e) {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(false);
    const form = e.target;
    const entry = {
      day: form.day.value,
      time: form.time.value,
      className: form.className.value,
      subject: form.subject.value,
      teacher: form.teacher.value,
      room: form.room.value,
      details: form.details.value,
    };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/classes/schedule/${editModal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error('Failed to update timetable entry');
      setEditSuccess(true);
      setTimeout(() => { setEditModal(null); setEditSuccess(false); }, 1200);
      // Refresh timetable
      setScheduleLoading(true);
      fetch(`${API_URL}/api/classes/schedule?weekly=true`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setWeeklySchedule(data.data?.weeklySchedule || []);
          setScheduleLoading(false);
        });
    } catch (err) {
      setEditError(err.message);
    }
  }
  async function handleDeleteTimetable() {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/classes/schedule/${deleteModal._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to delete timetable entry');
      setDeleteModal(null);
      // Refresh timetable
      setScheduleLoading(true);
      fetch(`${API_URL}/api/classes/schedule?weekly=true`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setWeeklySchedule(data.data?.weeklySchedule || []);
          setScheduleLoading(false);
        });
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('calendar')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}><CalendarIcon className="inline w-5 h-5 mr-2" />Calendar</button>
        <button onClick={() => setActiveTab('timetable')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'timetable' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}><TableIcon className="inline w-5 h-5 mr-2" />Timetable</button>
      </div>
      {activeTab === 'dashboard' && (
        <>
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Overview of school performance and statistics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents.toLocaleString()}
              icon={Users}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              change={null}
            />
            <StatCard
              title="Total Teachers"
              value={stats.totalTeachers}
              icon={GraduationCap}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              change={null}
            />
            <StatCard
              title="Total Classes"
              value={stats.totalClasses}
              icon={BookOpen}
              color="bg-gradient-to-r from-green-500 to-green-600"
              change={null}
            />
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
              change={null}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
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

            {/* Attendance Trend */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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

          {/* Grade Distribution and Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'student' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'grade' ? 'bg-green-100 text-green-600' :
                      activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'student' && <Users className="w-4 h-4" />}
                      {activity.type === 'grade' && <Award className="w-4 h-4" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'announcement' && <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Add Student</span>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Add Teacher</span>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-900">Create Class</span>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex flex-col items-center space-y-2">
                <Bell className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Send Notice</span>
              </button>
            </div>
          </div>
        </>
      )}
      {activeTab === 'calendar' && (
        <CalendarView />
      )}
      {activeTab === 'timetable' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><TableIcon className="w-6 h-6" /> Weekly Timetable</h2>
          <div className="mb-4 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              + Add Timetable Entry
            </button>
          </div>
          {scheduleLoading ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          ) : scheduleError ? (
            <div className="text-red-600">{scheduleError}</div>
          ) : weeklySchedule.length === 0 ? (
            <div className="text-gray-500">No timetable data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-1 text-left">Day</th>
                    <th className="px-2 py-1 text-left">Time</th>
                    <th className="px-2 py-1 text-left">Class</th>
                    <th className="px-2 py-1 text-left">Subject</th>
                    <th className="px-2 py-1 text-left">Teacher</th>
                    <th className="px-2 py-1 text-left">Room</th>
                    <th className="px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="px-2 py-1">{item.day}</td>
                      <td className="px-2 py-1">{item.time}</td>
                      <td className="px-2 py-1 font-semibold text-blue-700">{item.className}</td>
                      <td className="px-2 py-1"><span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 font-medium">{item.subject}</span></td>
                      <td className="px-2 py-1"><span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">{item.teacher}</span></td>
                      <td className="px-2 py-1">{item.room}</td>
                      <td className="px-2 py-1 flex gap-2">
                        <button onClick={() => handleEditClick(item)} className="p-1 rounded hover:bg-blue-100"><Pencil className="w-4 h-4 text-blue-600" /></button>
                        <button onClick={() => handleDeleteClick(item)} className="p-1 rounded hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-600" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Modal for timetable row */}
          {modalEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fade-in">
                <button onClick={() => setModalEvent(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TableIcon className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><TableIcon className="w-6 h-6 text-blue-600" /> Timetable Details</h3>
                <div className="mb-2 text-gray-700"><span className="font-medium">Day:</span> {modalEvent.day}</div>
                <div className="mb-2 text-gray-700"><span className="font-medium">Time:</span> {modalEvent.time}</div>
                <div className="mb-2 text-gray-700"><span className="font-medium">Class:</span> {modalEvent.className}</div>
                <div className="mb-2 text-gray-700"><span className="font-medium">Subject:</span> {modalEvent.subject}</div>
                <div className="mb-2 text-gray-700"><span className="font-medium">Teacher:</span> {modalEvent.teacher}</div>
                <div className="mb-2 text-gray-700"><span className="font-medium">Room:</span> {modalEvent.room}</div>
                {modalEvent.details && <div className="mb-2 text-gray-700"><span className="font-medium">Details:</span> {modalEvent.details}</div>}
              </div>
            </div>
          )}
          {/* Add Timetable Entry Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fade-in">
                <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TableIcon className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><TableIcon className="w-6 h-6 text-blue-600" /> Add Timetable Entry</h3>
                <form onSubmit={handleAddTimetable} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select name="day" required className="w-full border rounded px-2 py-1">
                      <option value="">Select Day</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input name="time" type="text" required className="w-full border rounded px-2 py-1" placeholder="e.g. 08:00 - 09:00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <input name="className" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input name="subject" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teacher</label>
                    <input name="teacher" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Room</label>
                    <input name="room" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Details</label>
                    <textarea name="details" className="w-full border rounded px-2 py-1" rows={2} />
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={addLoading}>{addLoading ? 'Saving...' : 'Add Entry'}</button>
                  {addError && <div className="text-red-600 text-sm mt-2">{addError}</div>}
                  {addSuccess && <div className="text-green-600 text-sm mt-2">Timetable entry added!</div>}
                </form>
              </div>
            </div>
          )}
          {/* Edit Timetable Entry Modal */}
          {editModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fade-in">
                <button onClick={() => setEditModal(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Pencil className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Pencil className="w-6 h-6 text-blue-600" /> Edit Timetable Entry</h3>
                <form onSubmit={handleEditTimetable} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select name="day" required className="w-full border rounded px-2 py-1">
                      <option value="">Select Day</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input name="time" type="text" required className="w-full border rounded px-2 py-1" placeholder="e.g. 08:00 - 09:00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <input name="className" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input name="subject" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teacher</label>
                    <input name="teacher" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Room</label>
                    <input name="room" type="text" required className="w-full border rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Details</label>
                    <textarea name="details" className="w-full border rounded px-2 py-1" rows={2} />
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={addLoading}>{addLoading ? 'Saving...' : 'Update Entry'}</button>
                  {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
                  {editSuccess && <div className="text-green-600 text-sm mt-2">Timetable entry updated!</div>}
                </form>
              </div>
            </div>
          )}
          {/* Delete Confirmation Modal */}
          {deleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full relative animate-fade-in">
                <button onClick={() => setDeleteModal(null)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Trash2 className="w-6 h-6 text-red-600" /> Delete Timetable Entry</h3>
                <p className="mb-4">Are you sure you want to delete this timetable entry?</p>
                <div className="flex gap-2">
                  <button onClick={handleDeleteTimetable} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</button>
                  <button onClick={() => setDeleteModal(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                </div>
                {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;