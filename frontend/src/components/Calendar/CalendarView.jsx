import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, DollarSign, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const eventTypeMeta = {
  Announcement: {
    color: 'bg-blue-100 text-blue-800',
    icon: Bell,
  },
  Class: {
    color: 'bg-green-100 text-green-800',
    icon: BookOpen,
  },
  'Fee Due': {
    color: 'bg-yellow-100 text-yellow-800',
    icon: DollarSign,
  },
};

const CalendarView = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEvent, setModalEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [currentMonth, currentYear]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch events from multiple endpoints (announcements, classes, exams, fees)
      const [annRes, classRes, feeRes] = await Promise.all([
        fetch(`${API_URL}/api/announcements?month=${currentMonth+1}&year=${currentYear}`),
        fetch(`${API_URL}/api/classes?month=${currentMonth+1}&year=${currentYear}`),
        fetch(`${API_URL}/api/fees?month=${currentMonth+1}&year=${currentYear}`)
      ]);
      const [annData, classData, feeData] = await Promise.all([
        annRes.ok ? annRes.json() : { data: { announcements: [] } },
        classRes.ok ? classRes.json() : { data: { classes: [] } },
        feeRes.ok ? feeRes.json() : { data: { fees: [] } }
      ]);
      // Map events to days
      const allEvents = [];
      (annData.data?.announcements || []).forEach(a => {
        if (a.date) allEvents.push({ type: 'Announcement', date: a.date, title: a.title, details: a.description || '', ...a });
      });
      (classData.data?.classes || []).forEach(c => {
        if (c.schedule && Array.isArray(c.schedule)) {
          c.schedule.forEach(s => {
            if (s.date) allEvents.push({ type: 'Class', date: s.date, title: `${c.name} - ${s.subject}`, details: s.details || '', ...s, className: c.name });
          });
        }
      });
      (feeData.data?.fees || []).forEach(f => {
        if (f.dueDate) allEvents.push({ type: 'Fee Due', date: f.dueDate, title: `Fee Due: ${f.amount}`, details: f.description || '', ...f });
      });
      setEvents(allEvents);
    } catch (e) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const weeks = [];
  let day = 1 - firstDayOfWeek;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (day > 0 && day <= daysInMonth) {
        week.push(day);
      } else {
        week.push(null);
      }
      day++;
    }
    weeks.push(week);
    if (day > daysInMonth) break;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const getEventsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date && e.date.startsWith(dateStr));
  };

  // Skeleton loader for calendar
  const CalendarSkeleton = () => (
    <div className="animate-pulse space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, j) => (
            <div key={j} className="min-h-[80px] bg-gray-100 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );

  // Modal for event details
  const EventModal = ({ event, onClose }) => {
    if (!event) return null;
    const meta = eventTypeMeta[event.type] || {};
    const Icon = meta.icon || null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fade-in">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><XCircle className="w-6 h-6" /></button>
          <div className="flex items-center gap-3 mb-4">
            {Icon && <span className={`p-2 rounded-lg ${meta.color}`}><Icon className="w-6 h-6" /></span>}
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          </div>
          <div className="mb-2 text-gray-700"><span className="font-medium">Type:</span> {event.type}</div>
          <div className="mb-2 text-gray-700"><span className="font-medium">Date:</span> {event.date}</div>
          {event.className && <div className="mb-2 text-gray-700"><span className="font-medium">Class:</span> {event.className}</div>}
          {event.subject && <div className="mb-2 text-gray-700"><span className="font-medium">Subject:</span> {event.subject}</div>}
          {event.amount && <div className="mb-2 text-gray-700"><span className="font-medium">Amount:</span> {event.amount}</div>}
          {event.details && <div className="mb-2 text-gray-700"><span className="font-medium">Details:</span> {event.details}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">&lt;</button>
        <h2 className="text-2xl font-bold text-gray-900">{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={handleNextMonth} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
        ))}
      </div>
      {loading ? (
        <CalendarSkeleton />
      ) : (
        <div className="grid grid-rows-6 gap-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2">
              {week.map((d, di) => {
                const isToday = d && currentYear === today.getFullYear() && currentMonth === today.getMonth() && d === today.getDate();
                return (
                  <div
                    key={di}
                    className={`min-h-[80px] rounded-lg p-1 border relative group transition-all duration-150 cursor-pointer ${d ? 'bg-white hover:shadow-lg active:scale-[0.98]' : 'bg-gray-50'} ${isToday ? 'ring-2 ring-blue-400 border-blue-200' : ''}`}
                  >
                    {d && <div className="font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>{d}</span>
                      {isToday && <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Today</span>}
                    </div>}
                    {d && getEventsForDay(d).map((ev, ei) => {
                      const meta = eventTypeMeta[ev.type] || {};
                      const Icon = meta.icon || null;
                      return (
                        <div
                          key={ei}
                          className={`flex items-center gap-1 text-xs rounded px-1 py-0.5 mb-1 ${meta.color} hover:bg-opacity-80 transition-colors cursor-pointer`}
                          onMouseEnter={() => setHoveredEvent({ ...ev, x: di, y: wi })}
                          onMouseLeave={() => setHoveredEvent(null)}
                          onClick={() => setModalEvent(ev)}
                        >
                          {Icon && <Icon className="w-4 h-4 mr-1" />}
                          <span className="truncate max-w-[90px]">{ev.title}</span>
                        </div>
                      );
                    })}
                    {/* Tooltip */}
                    {d && hoveredEvent && hoveredEvent.x === di && hoveredEvent.y === wi && (
                      <div className="absolute z-20 left-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs text-gray-800 min-w-[120px] animate-fade-in">
                        <div className="font-semibold mb-1">{hoveredEvent.title}</div>
                        <div className="mb-1">{hoveredEvent.type}</div>
                        {hoveredEvent.details && <div className="text-gray-500">{hoveredEvent.details.slice(0, 60)}{hoveredEvent.details.length > 60 ? '...' : ''}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {/* Modal */}
      {modalEvent && <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />}
    </div>
  );
};

export default CalendarView; 
