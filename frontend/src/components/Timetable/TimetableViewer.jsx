import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, User, MapPin, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TimetableViewer = () => {
  const { user, token, API_URL } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today;
  });

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
    if (user?.role === 'student') {
      fetchStudentTimetable();
    }
  }, [user]);

  const fetchStudentTimetable = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First get student's class
      const studentResponse = await fetch(`${API_URL}/api/students/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        const student = studentData.data?.student;
        
        if (student?.classId) {
          // Get class timetable
          const timetableResponse = await fetch(`${API_URL}/api/classes/${student.classId}/timetable`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (timetableResponse.ok) {
            const timetableData = await timetableResponse.json();
            setTimetable(timetableData.data?.timetable || {});
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const exportTimetable = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_timetable.csv`;
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
            row.push(`${period.subject}${period.room ? ` (${period.room})` : ''}`);
          } else {
            row.push('Free');
          }
        });
        csv += row.join(',') + '\n';
      }
    });
    
    return csv;
  };

  const getTodaySchedule = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayTimetable = timetable[today] || {};
    
    return timeSlots.filter(slot => !slot.isBreak).map(slot => ({
      ...slot,
      subject: todayTimetable[slot.period]?.subject || 'Free Period',
      room: todayTimetable[slot.period]?.room || '',
      teacher: todayTimetable[slot.period]?.teacherName || ''
    }));
  };

  if (user?.role !== 'student') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          This view is only available for students.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Timetable</h2>
            <p className="text-gray-600">View your class schedule</p>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={exportTimetable}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading timetable...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's Schedule Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTodaySchedule().slice(0, 6).map((period, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Period {period.period}
                      </span>
                      <span className="text-xs text-gray-500">
                        {period.start} - {period.end}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {period.subject}
                    </div>
                    {period.room && (
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {period.room}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Weekly Timetable */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Timetable</h3>
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
                              <StudentPeriodCell
                                periodData={timetable[day]?.[slot.period]}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Day Detail */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {selectedDay} Schedule
              </h3>
              <div className="space-y-3">
                {timeSlots.filter(slot => !slot.isBreak).map(slot => {
                  const period = timetable[selectedDay]?.[slot.period];
                  return (
                    <div key={slot.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-600">
                          {slot.start} - {slot.end}
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {period?.subject || 'Free Period'}
                        </div>
                      </div>
                      {period?.room && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {period.room}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentPeriodCell = ({ periodData }) => {
  if (!periodData) {
    return (
      <div className="h-16 flex items-center justify-center text-gray-400">
        Free Period
      </div>
    );
  }

  return (
    <div className="h-16 p-2 bg-blue-50 border border-blue-200 rounded">
      <div className="text-xs font-semibold text-blue-800 truncate">
        {periodData.subject}
      </div>
      {periodData.room && (
        <div className="text-xs text-blue-600 truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {periodData.room}
        </div>
      )}
    </div>
  );
};

export default TimetableViewer;