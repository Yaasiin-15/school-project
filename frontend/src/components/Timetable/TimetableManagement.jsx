import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  User,
  MapPin,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TimetableManagement = () => {
  const { user, token, API_URL } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('weekly'); // weekly, daily, class

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    { start: '08:00', end: '08:45', period: 1 },
    { start: '08:45', end: '09:30', period: 2 },
    { start: '09:30', end: '10:15', period: 3 },
    { start: '10:15', end: '10:30', period: 'Break', isBreak: true },
    { start: '10:30', end: '11:15', period: 4 },
    { start: '11:15', end: '12:00', period: 5 },
    { start: '12:00', end: '12:45', period: 6 },
    { start: '12:45', end: '13:30', period: 'Lunch', isBreak: true },
    { start: '13:30', end: '14:15', period: 7 },
    { start: '14:15', end: '15:00', period: 8 },
  ];

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/timetable/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data.classes || []);
      } else {
        setError('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/timetable/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data.data.teachers || []);
      } else {
        setError('Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to fetch teachers');
    }
  };

  const fetchTimetable = async (classId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/timetable/${classId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTimetable(data.data.timetable || {});
        setMessage('Timetable loaded successfully');
      } else {
        setError('Failed to fetch timetable');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    if (classId) {
      fetchTimetable(classId);
    } else {
      setTimetable({});
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassTimetable();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data?.classes || []);
      }
    } catch (err) {
      setError('Failed to fetch classes');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data.data?.teachers || []);
      }
    } catch (err) {
      console.log('Failed to fetch teachers');
    }
  };

  const fetchClassTimetable = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/classes/${selectedClass}/timetable`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTimetable(data.data?.timetable || {});
      } else {
        // Initialize empty timetable if none exists
        const emptyTimetable = {};
        days.forEach(day => {
          emptyTimetable[day] = {};
        });
        setTimetable(emptyTimetable);
      }
    } catch (err) {
      setError('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const savePeriod = async (day, period, periodData) => {
    try {
      const response = await fetch(`${API_URL}/api/classes/${selectedClass}/timetable`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          day,
          period,
          ...periodData
        })
      });

      if (response.ok) {
        setTimetable(prev => ({
          ...prev,
          [day]: {
            ...prev[day],
            [period]: periodData
          }
        }));
        setMessage('Timetable updated successfully!');
        setEditingPeriod(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save period');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const deletePeriod = async (day, period) => {
    if (!window.confirm('Are you sure you want to delete this period?')) return;

    try {
      const response = await fetch(`${API_URL}/api/classes/${selectedClass}/timetable/${day}/${period}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTimetable(prev => {
          const updated = { ...prev };
          if (updated[day]) {
            delete updated[day][period];
          }
          return updated;
        });
        setMessage('Period deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete period');
    }
  };

  const exportTimetable = () => {
    const selectedClassData = classes.find(c => c._id === selectedClass);
    if (!selectedClassData) return;

    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedClassData.name}_${selectedClassData.section}_timetable.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    let csv = 'Time,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday\n';

    timeSlots.forEach(slot => {
      if (slot.isBreak) {
        csv += `${slot.start}-${slot.end},${slot.period},${slot.period},${slot.period},${slot.period},${slot.period},${slot.period}\n`;
      } else {
        const row = [`${slot.start}-${slot.end}`];
        days.forEach(day => {
          const period = timetable[day]?.[slot.period];
          if (period) {
            const teacher = teachers.find(t => t._id === period.teacherId);
            row.push(`${period.subject} (${teacher?.name || 'TBA'})`);
          } else {
            row.push('Free');
          }
        });
        csv += row.join(',') + '\n';
      }
    });

    return csv;
  };

  if (user?.role !== 'admin' && user?.role !== 'teacher') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Only administrators and teachers can manage timetables.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Timetable Management</h2>
            <p className="text-gray-600">Manage class schedules and periods</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-md ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md ${viewMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Daily View
            </button>
            {selectedClass && (
              <button
                onClick={exportTimetable}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
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

        {/* Class Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class:</label>
          <select
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - Section {cls.section} (Grade {cls.grade})
              </option>
            ))}
          </select>
        </div>

        {/* Timetable Display */}
        {selectedClass && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading timetable...</span>
              </div>
            ) : (
              <TimetableGrid
                timetable={timetable}
                timeSlots={timeSlots}
                days={days}
                teachers={teachers}
                onEditPeriod={setEditingPeriod}
                onDeletePeriod={deletePeriod}
                viewMode={viewMode}
              />
            )}
          </div>
        )}

        {/* Edit Period Modal */}
        {editingPeriod && (
          <EditPeriodModal
            period={editingPeriod}
            teachers={teachers}
            classes={classes}
            selectedClass={selectedClass}
            onSave={savePeriod}
            onClose={() => setEditingPeriod(null)}
          />
        )}
      </div>
    </div>
  );
};

const TimetableGrid = ({ timetable, timeSlots, days, teachers, onEditPeriod, onDeletePeriod, viewMode }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">Time</th>
            {days.map(day => (
              <th key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {timeSlots.map((slot, index) => (
            <tr key={index} className={slot.isBreak ? 'bg-gray-50' : 'hover:bg-gray-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{slot.start} - {slot.end}</span>
                </div>
                {!slot.isBreak && (
                  <div className="text-xs text-gray-500">Period {slot.period}</div>
                )}
              </td>
              {days.map(day => (
                <td key={day} className="px-2 py-3 text-sm border-r">
                  {slot.isBreak ? (
                    <div className="text-center text-gray-500 font-medium">
                      {slot.period}
                    </div>
                  ) : (
                    <PeriodCell
                      day={day}
                      period={slot.period}
                      periodData={timetable[day]?.[slot.period]}
                      teachers={teachers}
                      onEdit={() => onEditPeriod({
                        day,
                        period: slot.period,
                        timeSlot: slot,
                        data: timetable[day]?.[slot.period] || {}
                      })}
                      onDelete={() => onDeletePeriod(day, slot.period)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PeriodCell = ({ day, period, periodData, teachers, onEdit, onDelete }) => {
  if (!periodData) {
    return (
      <div className="h-16 flex items-center justify-center">
        <button
          onClick={onEdit}
          className="w-full h-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const teacher = teachers.find(t => t._id === periodData.teacherId);

  return (
    <div className="h-16 p-2 bg-blue-50 border border-blue-200 rounded relative group">
      <div className="text-xs font-semibold text-blue-800 truncate">
        {periodData.subject}
      </div>
      <div className="text-xs text-blue-600 truncate flex items-center gap-1">
        <User className="w-3 h-3" />
        {teacher?.name || 'TBA'}
      </div>
      {periodData.room && (
        <div className="text-xs text-blue-600 truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {periodData.room}
        </div>
      )}

      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={onEdit}
          className="p-1 bg-white rounded shadow hover:bg-gray-50"
        >
          <Edit className="w-3 h-3 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 bg-white rounded shadow hover:bg-gray-50"
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </button>
      </div>
    </div>
  );
};

const EditPeriodModal = ({ period, teachers, classes, selectedClass, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    subject: period.data?.subject || '',
    teacherId: period.data?.teacherId || '',
    room: period.data?.room || '',
    notes: period.data?.notes || ''
  });

  const selectedClassData = classes.find(c => c._id === selectedClass);
  const availableSubjects = selectedClassData?.subjects || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject) {
      alert('Subject is required');
      return;
    }
    onSave(period.day, period.period, formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Period - {period.day} Period {period.period}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Time: {period.timeSlot?.start} - {period.timeSlot?.end}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <select
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher
            </label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} - {teacher.subjects?.join(', ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room
            </label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g., Room 101, Lab A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Period
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableManagement; const re
nderTimetableGrid = () => {
  if (!selectedClass || Object.keys(timetable).length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No timetable selected</h3>
        <p className="mt-1 text-sm text-gray-500">Select a class to view its timetable</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            {days.map(day => (
              <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {timeSlots.map((slot, index) => (
            <tr key={index} className={slot.isBreak ? 'bg-yellow-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {slot.start} - {slot.end}
                  {slot.isBreak && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                      {slot.period}
                    </span>
                  )}
                </div>
              </td>
              {days.map(day => (
                <td key={`${day}-${slot.period}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {slot.isBreak ? (
                    <span className="text-yellow-600 font-medium">{slot.period}</span>
                  ) : (
                    timetable[day] && timetable[day][slot.period] ? (
                      <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-blue-900">
                          {timetable[day][slot.period].subject}
                        </div>
                        <div className="text-xs text-blue-600">
                          {timetable[day][slot.period].teacher}
                        </div>
                        <div className="text-xs text-gray-500">
                          {timetable[day][slot.period].room}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">-</div>
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

return (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage class schedules and timetables
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Daily View
          </button>
        </div>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.grade} {cls.section}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>
    </div>

    {/* Messages */}
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setError('')}
              className="inline-flex text-red-400 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )}

    {message && (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Calendar className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-800">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setMessage('')}
              className="inline-flex text-green-400 hover:text-green-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Timetable Grid */}
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {selectedClass ? `Timetable for ${classes.find(c => c._id === selectedClass)?.name || 'Selected Class'}` : 'Class Timetable'}
        </h2>
        {selectedClass && (
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Edit className="h-4 w-4 mr-2" />
              Edit Timetable
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading timetable...</p>
        </div>
      ) : (
        renderTimetableGrid()
      )}
    </div>
  </div>
);
};

export default TimetableManagement;