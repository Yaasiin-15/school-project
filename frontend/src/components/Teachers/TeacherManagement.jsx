import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  BookOpen,
  Users,
  Award,
  Calendar
} from 'lucide-react';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Add Teacher (Create)
  const handleAddTeacher = async (teacherData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(teacherData)
      });
      if (response.ok) {
        await fetchTeachers();
        setShowAddModal(false);
      } else {
        alert('Failed to add teacher');
      }
    } catch (error) {
      alert('Error adding teacher');
    } finally {
      setLoading(false);
    }
  };

  // Edit Teacher (Update)
  const handleEditTeacher = async (id, teacherData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(teacherData)
      });
      if (response.ok) {
        await fetchTeachers();
        setShowEditModal(false);
      } else {
        alert('Failed to update teacher');
      }
    } catch (error) {
      alert('Error updating teacher');
    } finally {
      setLoading(false);
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/teachers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchTeachers();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        alert('Failed to delete teacher');
      }
    } catch (error) {
      alert('Error deleting teacher');
    } finally {
      setLoading(false);
    }
  };

  // Optionally, update fetchTeachers to support backend search
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/teachers`;
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data.teachers || []);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to refetch teachers on searchTerm change
  useEffect(() => {
    fetchTeachers();
  }, [searchTerm]);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.teacherId && teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || 
                          (teacher.subjects && teacher.subjects.includes && teacher.subjects.includes(selectedSubject));
    return matchesSearch && matchesSubject;
  });

  const handleViewTeacher = async (teacher) => {
    setSelectedTeacher({ ...teacher, loading: true });
    setShowViewModal(true);
    try {
      const token = localStorage.getItem('token');
      // Profile, classes, recent grades
      const res = await fetch(`${API_URL}/api/teachers/${teacher.id || teacher._id}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Grades
      const gradesRes = await fetch(`${API_URL}/api/grades?teacherId=${teacher.id || teacher._id}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const gradesData = await gradesRes.json();
      // Dashboard
      const dashRes = await fetch(`${API_URL}/api/dashboard/teacher/${teacher.id || teacher._id}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const dashData = await dashRes.json();
      setSelectedTeacher(s => ({
        ...s,
        ...data.data,
        grades: gradesData.success ? gradesData.data.grades : [],
        dashboard: dashData.success ? dashData.data : null,
        loading: false
      }));
    } catch (e) {
      setSelectedTeacher(s => ({ ...s, grades: [], dashboard: null, loading: false }));
    }
  };

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Teacher Management
            </h1>
            <p className="text-gray-600 mt-2">Manage teaching staff and their information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard 
            key={teacher._id || teacher.id} 
            teacher={teacher} 
            onView={() => handleViewTeacher(teacher)}
            onEdit={() => { setEditTeacher(teacher); setShowEditModal(true); }}
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this teacher?')) {
                handleDeleteTeacher(teacher._id || teacher.id);
              }
            }}
          />
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <AddTeacherModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTeacher}
        />
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <ViewTeacherModal 
          teacher={selectedTeacher}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && editTeacher && (
        <EditTeacherModal 
          teacher={editTeacher}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditTeacher}
        />
      )}
    </div>
  );
};

const TeacherCard = ({ teacher, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={teacher.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'}
            alt={teacher.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
            <p className="text-sm text-gray-600">{teacher.teacherId || 'No ID'}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button 
                onClick={() => {
                  onView();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </button>
              <button 
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button 
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="w-4 h-4 mr-2" />
          {teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.slice(0, 2).join(', ') : 'No subjects'}
          {teacher.subjects && teacher.subjects.length > 2 && '...'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {teacher.classes && teacher.classes.length > 0 ? teacher.classes.slice(0, 2).join(', ') : 'No classes'}
          {teacher.classes && teacher.classes.length > 2 && '...'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {teacher.email || 'No email'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {teacher.phone || 'No phone'}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{teacher.experience || 0} yrs</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{teacher.qualification || 'N/A'}</p>
              <p className="text-xs text-gray-500">Qualification</p>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {teacher.subjects ? teacher.subjects.length : 0} Subject{teacher.subjects && teacher.subjects.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddTeacherModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjects: [],
    classes: [],
    qualification: '',
    experience: '',
    phone: '',
    department: '', // Ensure department is present and required
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  });

  const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const availableClasses = ['10A', '10B', '11A', '11B', '12A', '12B'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.name.trim()) {
      alert('Full Name is required');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    if (!formData.department.trim()) {
      alert('Department is required');
      return;
    }
    if (!formData.qualification.trim()) {
      alert('Qualification is required');
      return;
    }
    if (!formData.subjects || !Array.isArray(formData.subjects) || formData.subjects.length === 0) {
      alert('At least one subject must be selected');
      return;
    }
    if (!formData.classes || !Array.isArray(formData.classes) || formData.classes.length === 0) {
      alert('At least one class must be selected');
      return;
    }
    const { teacherId, userId, ...data } = formData;
    onAdd(data); // teacherId and userId should not be sent
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleClassChange = (className) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Teacher</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Teacher ID input waa la saaray */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification *
              </label>
              <input
                type="text"
                name="qualification"
                required
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSubjects.map(subject => (
                <label key={subject} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classes *
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {availableClasses.map(className => (
                <label key={className} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.classes.includes(className)}
                    onChange={() => handleClassChange(className)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{className}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewTeacherModal = ({ teacher, onClose }) => {
  const [tab, setTab] = useState('profile');
  const grades = teacher.grades || [];
  const dashboard = teacher.dashboard;
  const classes = teacher.classes || [];
  // Grades chart data
  const gradeLabels = grades.map(g => g.subjectName + ' ' + (g.term || ''));
  const gradeScores = grades.map(g => g.score);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Teacher Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-4 flex gap-4 border-b pb-2">
          <button onClick={() => setTab('profile')} className={`px-3 py-1 rounded-t ${tab==='profile' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Profile</button>
          <button onClick={() => setTab('classes')} className={`px-3 py-1 rounded-t ${tab==='classes' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Classes</button>
          <button onClick={() => setTab('schedule')} className={`px-3 py-1 rounded-t ${tab==='schedule' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Schedule</button>
          <button onClick={() => setTab('grades')} className={`px-3 py-1 rounded-t ${tab==='grades' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Grades</button>
          <button onClick={() => setTab('analytics')} className={`px-3 py-1 rounded-t ${tab==='analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Analytics</button>
        </div>
        {teacher.loading ? (
          <div className="text-blue-600">Loading...</div>
        ) : (
          <>
            {tab === 'profile' && (
              <div>
                <div className="flex flex-col items-center mb-4">
              <img
                src={teacher.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'}
                alt={teacher.name}
                    className="w-24 h-24 rounded-full mb-2"
              />
              <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
              <p className="text-gray-600">{teacher.teacherId || 'No ID'}</p>
                  <p className="text-gray-600">{teacher.email || 'No email'}</p>
                  <p className="text-gray-600">{teacher.phone || 'No phone'}</p>
                  <p className="text-gray-600">{teacher.qualification || 'No qualification'}</p>
                  <p className="text-gray-600">Experience: {teacher.experience || 0} yrs</p>
                  <p className="text-gray-600">Department: {teacher.department || '-'}</p>
                </div>
              </div>
            )}
            {tab === 'classes' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Classes & Subjects</h4>
                <div className="mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {classes && classes.length > 0 ? classes.map((cls, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-3 min-w-[100px] text-center">
                        <div className="text-lg font-bold text-blue-700">{cls.name || cls}</div>
                        <div className="text-md text-gray-800">{cls.section ? `Section ${cls.section}` : ''}</div>
                  </div>
                    )) : <div className="text-gray-500">No classes assigned.</div>}
                  </div>
                  </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Subjects</h5>
                  <div className="flex gap-2 flex-wrap">
                    {teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.map((s, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-2 min-w-[80px] text-center text-blue-700">{s}</div>
                    )) : <div className="text-gray-500">No subjects assigned.</div>}
                  </div>
                </div>
              </div>
            )}
            {tab === 'schedule' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Schedule</h4>
                <ul className="list-disc pl-6">
                  {dashboard && dashboard.todaySchedule && dashboard.todaySchedule.length > 0 ? dashboard.todaySchedule.map((s, idx) => (
                    <li key={idx}>{s.subject} - {s.class} ({s.time}) - {s.room}</li>
                  )) : <li className="text-gray-500">No schedule data.</li>}
                </ul>
              </div>
            )}
            {tab === 'grades' && (
                  <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Grades Entered</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Student</th>
                        <th className="px-2 py-1 text-left">Subject</th>
                        <th className="px-2 py-1 text-left">Score</th>
                        <th className="px-2 py-1 text-left">Max</th>
                        <th className="px-2 py-1 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.length > 0 ? grades.map((g, idx) => (
                        <tr key={g._id || idx}>
                          <td className="px-2 py-1">{g.studentName || '-'}</td>
                          <td className="px-2 py-1">{g.subjectName}</td>
                          <td className="px-2 py-1">{g.score}</td>
                          <td className="px-2 py-1">{g.maxScore}</td>
                          <td className="px-2 py-1">{g.date ? new Date(g.date).toLocaleDateString() : '-'}</td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-gray-500 py-4">No grades found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                {/* Simple chart placeholder */}
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Grade Distribution</h5>
                  {gradeScores.length > 0 ? (
                    <div className="flex gap-2 items-end h-32">
                      {gradeScores.map((score, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-end" style={{height: '100%'}}>
                          <div style={{height: `${(score/100)*100}%`}} className="w-6 bg-blue-500 rounded-t"></div>
                          <span className="text-xs mt-1">{gradeLabels[idx]}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No data for chart.</div>
                  )}
                </div>
              </div>
            )}
            {tab === 'analytics' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Analytics</h4>
                {dashboard ? (
                  <>
                    <div className="mb-4 flex gap-4 flex-wrap">
                      <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-blue-600">{dashboard.stats?.totalStudents || 0}</div>
                        <div className="text-xs text-gray-600">Total Students</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-green-600">{dashboard.stats?.totalClasses || 0}</div>
                        <div className="text-xs text-gray-600">Total Classes</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-yellow-600">{dashboard.stats?.pendingGrades || 0}</div>
                        <div className="text-xs text-gray-600">Pending Grades</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-purple-600">{dashboard.stats?.todayClasses || 0}</div>
                        <div className="text-xs text-gray-600">Today Classes</div>
                      </div>
                  </div>
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2">Class Performance</h5>
                      <div className="flex gap-2 flex-wrap">
                        {dashboard.classPerformance && dashboard.classPerformance.length > 0 ? dashboard.classPerformance.map((c, idx) => (
                          <div key={idx} className="bg-gray-100 rounded-lg p-3 min-w-[120px] text-center">
                            <div className="text-lg font-bold text-blue-700">{c.className}</div>
                            <div className="text-md text-gray-800">Avg: {c.averageScore ? c.averageScore.toFixed(1) : '-'}%</div>
                            <div className="text-xs text-gray-600">Students: {c.studentCount}</div>
                  </div>
                        )) : <div className="text-gray-500">No class data.</div>}
                  </div>
                </div>
                  </>
                ) : <div className="text-gray-500">No analytics data found.</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EditTeacherModal = ({ teacher, onClose, onEdit }) => {
  const [formData, setFormData] = useState({ ...teacher });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(teacher._id || teacher.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID *</label>
              <input type="text" name="teacherId" required value={formData.teacherId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
              <input type="text" name="subjects" value={Array.isArray(formData.subjects) ? formData.subjects.join(', ') : formData.subjects || ''} onChange={e => setFormData(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">Save Changes</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherManagement;