import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, GraduationCap, DollarSign, Calendar, Download, Filter, RefreshCw } from 'lucide-react';

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    attendance: [],
    performance: [],
    financial: [],
    enrollment: []
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analytics?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        // Mock data for demo
        setAnalyticsData({
          overview: {
            totalStudents: 1250,
            totalTeachers: 85,
            averageAttendance: 92.5,
            totalRevenue: 485000,
            growthRate: 8.3
          },
          attendance: [
            { month: 'Jan', rate: 94.2 },
            { month: 'Feb', rate: 91.8 },
            { month: 'Mar', rate: 93.5 },
            { month: 'Apr', rate: 92.1 },
            { month: 'May', rate: 94.8 },
            { month: 'Jun', rate: 92.5 }
          ],
          performance: [
            { subject: 'Mathematics', average: 85.2, students: 320 },
            { subject: 'Science', average: 88.7, students: 315 },
            { subject: 'English', average: 82.4, students: 340 },
            { subject: 'History', average: 79.8, students: 280 },
            { subject: 'Geography', average: 86.1, students: 295 }
          ],
          financial: [
            { month: 'Jan', revenue: 78000, expenses: 45000 },
            { month: 'Feb', revenue: 82000, expenses: 48000 },
            { month: 'Mar', revenue: 85000, expenses: 52000 },
            { month: 'Apr', revenue: 79000, expenses: 46000 },
            { month: 'May', revenue: 88000, expenses: 54000 },
            { month: 'Jun', revenue: 92000, expenses: 58000 }
          ],
          enrollment: [
            { grade: 'Grade 1', students: 120, capacity: 150 },
            { grade: 'Grade 2', students: 115, capacity: 150 },
            { grade: 'Grade 3', students: 125, capacity: 150 },
            { grade: 'Grade 4', students: 118, capacity: 150 },
            { grade: 'Grade 5', students: 122, capacity: 150 },
            { grade: 'Grade 6', students: 108, capacity: 140 },
            { grade: 'Grade 7', students: 112, capacity: 140 },
            { grade: 'Grade 8', students: 105, capacity: 140 },
            { grade: 'Grade 9', students: 98, capacity: 130 },
            { grade: 'Grade 10', students: 95, capacity: 130 }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/analytics/export/${type}?range=${dateRange}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${dateRange}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, suffix = '' }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}{suffix}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics & Reports
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into school performance</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'performance', label: 'Performance' },
          { id: 'financial', label: 'Financial' },
          { id: 'enrollment', label: 'Enrollment' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={analyticsData.overview.totalStudents?.toLocaleString() || '0'}
              icon={Users}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              change={8.3}
            />
            <StatCard
              title="Total Teachers"
              value={analyticsData.overview.totalTeachers || '0'}
              icon={GraduationCap}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              change={5.2}
            />
            <StatCard
              title="Average Attendance"
              value={analyticsData.overview.averageAttendance || '0'}
              icon={Calendar}
              color="bg-gradient-to-r from-green-500 to-green-600"
              change={2.1}
              suffix="%"
            />
            <StatCard
              title="Total Revenue"
              value={`$${analyticsData.overview.totalRevenue?.toLocaleString() || '0'}`}
              icon={DollarSign}
              color="bg-gradient-to-r from-yellow-500 to-orange-500"
              change={12.5}
            />
          </div>

          {/* Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Attendance Analytics</h2>
            <button
              onClick={() => exportReport('attendance')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance by Grade</h3>
              <div className="space-y-4">
                {analyticsData.enrollment?.slice(0, 6).map((grade, index) => {
                  const attendanceRate = 85 + Math.random() * 15; // Mock attendance rate
                  return (
                    <div key={grade.grade} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{grade.grade}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12">
                          {attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Academic Performance</h2>
            <button
              onClick={() => exportReport('performance')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'A (90-100)', value: 25, color: '#10B981' },
                      { name: 'B (80-89)', value: 35, color: '#3B82F6' },
                      { name: 'C (70-79)', value: 25, color: '#F59E0B' },
                      { name: 'D (60-69)', value: 10, color: '#EF4444' },
                      { name: 'F (0-59)', value: 5, color: '#6B7280' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'A (90-100)', value: 25, color: '#10B981' },
                      { name: 'B (80-89)', value: 35, color: '#3B82F6' },
                      { name: 'C (70-79)', value: 25, color: '#F59E0B' },
                      { name: 'D (60-69)', value: 10, color: '#EF4444' },
                      { name: 'F (0-59)', value: 5, color: '#6B7280' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
            <button
              onClick={() => exportReport('financial')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.financial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'enrollment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Enrollment Analytics</h2>
            <button
              onClick={() => exportReport('enrollment')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enrollment by Grade</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.enrollment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3B82F6" name="Current Students" />
                  <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Capacity Utilization</h3>
              <div className="space-y-4">
                {analyticsData.enrollment?.map((grade) => {
                  const utilization = (grade.students / grade.capacity) * 100;
                  return (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{grade.grade}</span>
                        <span className="text-sm text-gray-600">
                          {grade.students}/{grade.capacity} ({utilization.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization > 90 ? 'bg-red-500' :
                            utilization > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;