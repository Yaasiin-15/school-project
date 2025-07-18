import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  GraduationCap,
  MapPin,
  Calendar
} from 'lucide-react';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClass, setEditClass] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchData();
  }, []);

  // Add Class (Create)
  const handleAddClass = async (classData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(classData)
      });
      if (response.ok) {
        await fetchData();
        setShowAddModal(false);
      } else {
        alert('Failed to add class');
      }
    } catch (error) {
      alert('Error adding class');
    } finally {
      setLoading(false);
    }
  };

  // Edit Class (Update)
  const handleEditClass = async (id, classData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(classData)
      });
      if (response.ok) {
        await fetchData();
        setShowEditModal(false);
      } else {
        alert('Failed to update class');
      }
    } catch (error) {
      alert('Error updating class');
    } finally {
      setLoading(false);
    }
  };

  // Delete Class
  const handleDeleteClass = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchData();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        alert('Failed to delete class');
      }
    } catch (error) {
      alert('Error deleting class');
    } finally {
      setLoading(false);
    }
  };

  // Optionally, update fetchData to support backend search
  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/classes`;
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setClasses(data.data.classes || []);
      } else {
        setClasses([]);
      }
      // Fetch teachers for add/edit modal
      const teachersRes = await fetch(`${API_URL}/api/teachers`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      const teachersData = await teachersRes.json();
      setTeachers(teachersData.success ? teachersData.data.teachers : []);
    } catch (error) {
      setClasses([]);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to refetch classes on searchTerm change
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleViewClass = async (cls) => {
    setSelectedClass({ ...cls, loading: true });
    setShowViewModal(true);
    try {
      // Class details
      const res = await fetch(`${API_URL}/api/classes/${cls.id || cls._id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      // Students in class
      const students = data.data.class.students || [];
      // Analytics (use class analytics endpoint if available)
      // Placeholder: use students.length for now
      setSelectedClass(s => ({
        ...s,
        ...data.data.class,
        students,
        loading: false
      }));
    } catch (e) {
      setSelectedClass(s => ({ ...s, students: [], loading: false }));
    }
  };

  const grades = ['all', '1', '2', '3', '4','5','6', '7', '8', '9', '10','11','12'];''

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
              Class Management
            </h1>
            <p className="text-gray-600 mt-2">Manage classes and their assignments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Class</span>
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
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <ClassCard 
            key={cls._id || cls.id} 
            classData={cls} 
            onView={() => handleViewClass(cls)}
            onEdit={() => { setEditClass(cls); setShowEditModal(true); }}
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this class?')) {
                handleDeleteClass(cls._id || cls.id);
              }
            }}
          />
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <AddClassModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddClass}
          teachers={teachers}
        />
      )}

      {/* View Class Modal */}
      {showViewModal && selectedClass && (
        <ViewClassModal 
          classData={selectedClass}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit Class Modal */}
      {showEditModal && editClass && (
        <EditClassModal 
          classData={editClass}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditClass}
          teachers={teachers}
        />
      )}
    </div>
  );
};

const ClassCard = ({ classData, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{classData.name}</h3>
            <p className="text-sm text-gray-600">Grade {classData.grade}</p>
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

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <GraduationCap className="w-4 h-4 mr-2" />
          {classData.teacherName || 'No teacher assigned'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {classData.studentCount} students
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {classData.room || 'No room assigned'}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-1">
          {classData.subjects && classData.subjects.slice(0, 3).map(subject => (
            <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {subject}
            </span>
          ))}
          {classData.subjects && classData.subjects.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{classData.subjects.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Section {classData.section}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          classData.studentCount >= 35 ? 'bg-red-100 text-red-800' :
          classData.studentCount >= 25 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {classData.studentCount >= 35 ? 'Full' :
           classData.studentCount >= 25 ? 'Almost Full' : 'Available'}
        </div>
      </div>
    </div>
  );
};

const AddClassModal = ({ onClose, onAdd, teachers }) => {
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    grade: '',
    teacherId: '',
    teacherName: '',
    room: '',
    capacity: 40,
    subjects: []
  });

  const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.name.trim()) {
      alert('Class name is required');
      return;
    }
    if (!formData.section.trim()) {
      alert('Section is required');
      return;
    }
    if (!formData.grade.trim()) {
      alert('Grade is required');
      return;
    }
    if (!formData.room.trim()) {
      alert('Room is required');
      return;
    }
    if (!formData.subjects || !Array.isArray(formData.subjects) || formData.subjects.length === 0) {
      alert('At least one subject must be selected');
      return;
    }
    const selectedTeacher = teachers.find(t => t._id === formData.teacherId || t.id === formData.teacherId);
    const classData = {
      ...formData,
      teacherName: selectedTeacher?.name || 'No teacher assigned'
    };
    onAdd(classData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Class</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Class 10A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <input
                type="text"
                name="section"
                required
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <select
                name="grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Teacher
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id || teacher.id} value={teacher._id || teacher.id}>
                    {teacher.name} ({teacher.teacherId || teacher.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room *
              </label>
              <input
                type="text"
                name="room"
                required
                value={formData.room}
                onChange={handleChange}
                placeholder="e.g., Room 101"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="100"
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
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewClassModal = ({ classData, onClose }) => {
  const [tab, setTab] = useState('profile');
  const students = classData.students || [];
  // Capacity usage
  const capacity = classData.capacity || 0;
  const enrolled = students.length;
  const usagePercent = capacity ? Math.round((enrolled / capacity) * 100) : 0;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Class Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-4 flex gap-4 border-b pb-2">
          <button onClick={() => setTab('profile')} className={`px-3 py-1 rounded-t ${tab==='profile' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Profile</button>
          <button onClick={() => setTab('students')} className={`px-3 py-1 rounded-t ${tab==='students' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Students</button>
          <button onClick={() => setTab('subjects')} className={`px-3 py-1 rounded-t ${tab==='subjects' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Subjects</button>
          <button onClick={() => setTab('capacity')} className={`px-3 py-1 rounded-t ${tab==='capacity' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Capacity</button>
          <button onClick={() => setTab('year')} className={`px-3 py-1 rounded-t ${tab==='year' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Academic Year</button>
          <button onClick={() => setTab('analytics')} className={`px-3 py-1 rounded-t ${tab==='analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Analytics</button>
              </div>
        {classData.loading ? (
          <div className="text-blue-600">Loading...</div>
        ) : (
          <>
            {tab === 'profile' && (
              <div>
                <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{classData.name}</h3>
                  <p className="text-gray-600">Section: {classData.section}</p>
                  <p className="text-gray-600">Grade: {classData.grade}</p>
                  <p className="text-gray-600">Room: {classData.room}</p>
                  <p className="text-gray-600">Teacher: {classData.teacherName}</p>
                  <p className="text-gray-600">Status: {classData.status}</p>
                </div>
              </div>
            )}
            {tab === 'students' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Students</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Name</th>
                        <th className="px-2 py-1 text-left">Student ID</th>
                        <th className="px-2 py-1 text-left">Email</th>
                        <th className="px-2 py-1 text-left">Class</th>
                        <th className="px-2 py-1 text-left">Section</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? students.map((s, idx) => (
                        <tr key={s._id || idx}>
                          <td className="px-2 py-1">{s.name}</td>
                          <td className="px-2 py-1">{s.studentId}</td>
                          <td className="px-2 py-1">{s.email}</td>
                          <td className="px-2 py-1">{s.class}</td>
                          <td className="px-2 py-1">{s.section}</td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-gray-500 py-4">No students found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'subjects' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Subjects</h4>
                <div className="flex gap-2 flex-wrap">
                  {classData.subjects && classData.subjects.length > 0 ? classData.subjects.map((s, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-2 min-w-[80px] text-center text-blue-700">{s}</div>
                  )) : <div className="text-gray-500">No subjects assigned.</div>}
                </div>
              </div>
            )}
            {tab === 'capacity' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Capacity</h4>
                <div className="mb-4 flex gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-blue-600">{capacity}</div>
                    <div className="text-xs text-gray-600">Capacity</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-green-600">{enrolled}</div>
                    <div className="text-xs text-gray-600">Enrolled</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-yellow-600">{usagePercent}%</div>
                    <div className="text-xs text-gray-600">Usage</div>
                  </div>
                </div>
              </div>
            )}
            {tab === 'year' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Year</h4>
                <p className="text-gray-700">{classData.academicYear || '-'}</p>
              </div>
            )}
            {tab === 'analytics' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Analytics</h4>
                {/* Placeholder for analytics/charts */}
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Enrollment Trend</h5>
                  <div className="text-gray-400">No chart data available.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EditClassModal = ({ classData, onClose, onEdit, teachers }) => {
  const [formData, setFormData] = useState({ ...classData });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(classData._id || classData.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
              <input type="text" name="grade" required value={formData.grade} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

export default ClassManagement;
