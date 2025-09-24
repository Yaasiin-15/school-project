import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Send,
  BarChart3,
  UserCheck,
  MapPin,
  Smartphone
} from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';

const EnhancedAttendanceManagement = () => {
  const { user, token, API_URL } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceType, setAttendanceType] = useState('daily');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('classroom');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classSummary, setClassSummary] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch classes and subjects on component mount
  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchTeacherClasses();
    } else if (user?.role === 'admin') {
      fetchAllClasses();
    }
    fetchSubjects();
  }, [user, token]);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchClassSummary();
      fetchStudentsForClass();
    }
  }, [selectedClass, selectedDate]);

  const fetchTeacherClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/classes/teacher/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data?.classes || []);
      } else {
        setError('Failed to fetch classes');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };

  const fetchAllClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data?.classes || []);
      } else {
        setError('Failed to fetch classes');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };

  const fetchSubjects = async () => {
    try {
      // Mock subjects for now - replace with actual API call
      setSubjects([
        { _id: '1', name: 'Mathematics', code: 'MATH' },
        { _id: '2', name: 'English', code: 'ENG' },
        { _id: '3', name: 'Science', code: 'SCI' },
        { _id: '4', name: 'History', code: 'HIST' },
        { _id: '5', name: 'Geography', code: 'GEO' },
      ]);
    } catch (err) {
      setError('Failed to fetch subjects');
    }
  };

  const fetchClassSummary = async () => {
    try {
      // Mock class summary - replace with actual API call
      setClassSummary({
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0,
        percentage: 0
      });
    } catch (err) {
      console.error('Failed to fetch class summary:', err);
    }
  };

  const fetchStudentsForClass = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/classes/${selectedClass}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const students = data.data?.class?.students || [];
        setStudents(students);
        
        // Initialize attendance state
        const initialAttendance = {};
        students.forEach(student => {
          initialAttendance[student._id] = {
            status: 'present',
            reason: '',
            timeIn: null,
            timeOut: null
          };
        });
        setAttendance(initialAttendance);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch students');
        setStudents([]);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status, reason = '') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        reason,
        timeIn: status === 'present' ? new Date().toISOString() : null
      }
    }));
  };

  const handleBulkAttendanceChange = (status) => {
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const updatedAttendance = { ...attendance };
    filteredStudents.forEach(student => {
      updatedAttendance[student._id] = {
        ...updatedAttendance[student._id],
        status,
        timeIn: status === 'present' ? new Date().toISOString() : null
      };
    });
    setAttendance(updatedAttendance);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    
    try {
      // Submit attendance for each student using the existing API
      const attendancePromises = students.map(async (student) => {
        const response = await fetch(`${API_URL}/api/attendance`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: student._id,
            classId: selectedClass,
            date: selectedDate,
            status: attendance[student._id].status,
            reason: attendance[student._id].reason,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to submit attendance for ${student.name}`);
        }

        return response.json();
      });

      await Promise.all(attendancePromises);
      
      // Refresh class summary
      await fetchClassSummary();
      
      setMessage('Attendance saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error saving attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async () => {
    try {
      const absentStudents = students
        .filter(student => attendance[student._id].status === 'absent')
        .map(student => student._id);

      if (absentStudents.length === 0) {
        alert('No absent students to notify');
        return;
      }

      // Mock notification sending - replace with actual API call
      console.log('Sending notifications to parents of absent students:', absentStudents);
      alert(`Notifications would be sent to ${absentStudents.length} parents`);
    } catch (err) {
      setError(err.message || 'Error sending notifications');
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(att => att.status === 'present').length;
    const absent = Object.values(attendance).filter(att => att.status === 'absent').length;
    const late = Object.values(attendance).filter(att => att.status === 'late').length;
    const excused = Object.values(attendance).filter(att => att.status === 'excused').length;
    
    return { total, present, absent, late, excused };
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = getAttendanceStats();

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Only teachers and administrators can take attendance.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <UserCheck className="mr-3 text-blue-600" />
                Enhanced Attendance Management
              </h1>
              <p className="text-gray-600 mt-1">Mark attendance with real-time tracking and notifications</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Actions
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} {cls.section ? `- Section ${cls.section}` : ''} (Grade {cls.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Type
              </label>
              <select
                value={attendanceType}
                onChange={(e) => setAttendanceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="period">Period-wise</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="classroom">Classroom</option>
                  <option value="library">Library</option>
                  <option value="playground">Playground</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {attendanceType === 'period' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Period</option>
                  {[1,2,3,4,5,6,7,8].map(p => (
                    <option key={p} value={p}>Period {p}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={!selectedClass || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
              <button
                onClick={handleSendNotifications}
                disabled={!selectedClass}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Notify Parents
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && selectedClass && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Bulk Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAttendanceChange('present')}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleBulkAttendanceChange('absent')}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
              >
                Mark All Absent
              </button>
              <button
                onClick={() => handleBulkAttendanceChange('late')}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors"
              >
                Mark All Late
              </button>
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        {selectedClass && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Excused</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.excused}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && students.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        )}

        {/* Student List */}
        {selectedClass && filteredStudents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Student Attendance</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Real-time tracking enabled</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In/Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason/Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {student.studentId || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {['present', 'absent', 'late', 'excused', 'sick'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleAttendanceChange(student._id, status)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                attendance[student._id]?.status === status
                                  ? getStatusStyle(status, true)
                                  : getStatusStyle(status, false)
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance[student._id]?.timeIn && (
                          <div>
                            <div>In: {new Date(attendance[student._id].timeIn).toLocaleTimeString()}</div>
                            {attendance[student._id]?.timeOut && (
                              <div>Out: {new Date(attendance[student._id].timeOut).toLocaleTimeString()}</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Add reason/notes..."
                          value={attendance[student._id]?.reason || ''}
                          onChange={(e) => handleAttendanceChange(student._id, attendance[student._id]?.status, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Students Message */}
        {selectedClass && students.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No students found in this class.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get status styling
const getStatusStyle = (status, isActive) => {
  const styles = {
    present: isActive 
      ? 'bg-green-100 text-green-800 border-2 border-green-300' 
      : 'bg-gray-100 text-gray-600 hover:bg-green-50',
    absent: isActive 
      ? 'bg-red-100 text-red-800 border-2 border-red-300' 
      : 'bg-gray-100 text-gray-600 hover:bg-red-50',
    late: isActive 
      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' 
      : 'bg-gray-100 text-gray-600 hover:bg-yellow-50',
    excused: isActive 
      ? 'bg-purple-100 text-purple-800 border-2 border-purple-300' 
      : 'bg-gray-100 text-gray-600 hover:bg-purple-50',
    sick: isActive 
      ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' 
      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
  };
  return styles[status] || styles.present;
};

export default EnhancedAttendanceManagement;