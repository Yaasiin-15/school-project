import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AttendanceManagement = () => {
  const { user, token, API_URL } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch teacher's classes on mount
  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchTeacherClasses();
    }
  }, [user, token]);

  const fetchTeacherClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/classes/teacher/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.data?.classes || []);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch classes');
        setClasses([]);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setClasses([]);
    }
  };

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClass, token]);

  const fetchClassStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/classes/${selectedClass}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const students = data.data?.class?.students || [];
        setStudents(students);
        
        // Initialize attendance state
        const initial = {};
        students.forEach(stu => {
          initial[stu._id] = 'present';
        });
        setAttendance(initial);
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

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // Submit attendance for each student
      const attendancePromises = students.map(async (stu) => {
        const response = await fetch(`${API_URL}/api/attendance`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: stu._id,
            classId: selectedClass,
            date,
            status: attendance[stu._id] || 'present',
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to submit attendance for ${stu.name}`);
        }
        
        return response.json();
      });
      
      await Promise.all(attendancePromises);
      setMessage('Attendance submitted successfully!');
      
      // Clear form after successful submission
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Error submitting attendance.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Take Attendance</h2>
        
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} {cls.section ? `- Section ${cls.section}` : ''} (Grade {cls.grade})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading students...</span>
            </div>
          )}
          
          {students.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Students in {classes.find(c => c._id === selectedClass)?.name} 
                {classes.find(c => c._id === selectedClass)?.section && ` - Section ${classes.find(c => c._id === selectedClass)?.section}`}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map(stu => (
                      <tr key={stu._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{stu.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{stu.studentId || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={attendance[stu._id] || 'present'}
                            onChange={e => handleAttendanceChange(stu._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {students.length > 0 && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          )}
          
          {selectedClass && students.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No students found in this class.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AttendanceManagement; 