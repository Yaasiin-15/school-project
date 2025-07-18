import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AttendanceManagement = () => {
  const { user, token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch teacher's classes on mount
  useEffect(() => {
    if (user?.role === 'teacher') {
      axios.get('/api/classes/teacher/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setClasses(res.data.data.classes || []);
        })
        .catch(() => setClasses([]));
    }
  }, [user, token]);

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      axios.get(`/api/classes/${selectedClass}`,
        { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setStudents(res.data.data.class.students || []);
          // Initialize attendance state
          const initial = {};
          (res.data.data.class.students || []).forEach(stu => {
            initial[stu._id] = 'present';
          });
          setAttendance(initial);
        })
        .catch(() => setStudents([]))
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClass, token]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Submit attendance for each student
      await Promise.all(students.map(stu =>
        axios.post('/api/attendance', {
          studentId: stu._id,
          classId: selectedClass,
          date,
          status: attendance[stu._id] || 'present',
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      setMessage('Attendance submitted successfully!');
    } catch (err) {
      setMessage('Error submitting attendance.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'teacher') {
    return <div>Only teachers can take attendance.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Take Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Class:</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name} {cls.section ? `(${cls.section})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Date:</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        {loading && <div>Loading students...</div>}
        {students.length > 0 && (
          <div>
            <table className="min-w-full border mt-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Student Name</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr key={stu._id}>
                    <td className="border px-2 py-1">{stu.name}</td>
                    <td className="border px-2 py-1">
                      <select
                        value={attendance[stu._id] || 'present'}
                        onChange={e => handleAttendanceChange(stu._id, e.target.value)}
                        className="border rounded px-2 py-1"
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
        )}
        {students.length > 0 && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Attendance'}
          </button>
        )}
        {message && <div className="mt-2 text-green-600">{message}</div>}
      </form>
    </div>
  );
};

export default AttendanceManagement; 