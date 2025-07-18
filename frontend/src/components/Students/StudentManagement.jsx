import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  BarChart2,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    // If student, show their profile modal by default
    if (user?.role === 'student') {
      setSelectedStudent({ ...user, loadingAttendance: true, loadingGrades: true, loadingFees: true, loadingDashboard: true });
      setShowViewModal(true);
      // Fetch their records
      (async () => {
        try {
          const attRes = await fetch(`${API_URL}/api/attendance/student/${user.id || user._id}`);
          const attData = await attRes.json();
          const gradesRes = await fetch(`${API_URL}/api/students/${user.id || user._id}/grades`);
          const gradesData = await gradesRes.json();
          const feesRes = await fetch(`${API_URL}/api/students/${user.id || user._id}/fees`);
          const feesData = await feesRes.json();
          const dashRes = await fetch(`${API_URL}/api/dashboard/student/${user.id || user._id}`);
          const dashData = await dashRes.json();
          setSelectedStudent(s => ({
            ...s,
            attendanceRecords: attData.success ? attData.data.records : [],
            loadingAttendance: false,
            grades: gradesData.success ? gradesData.data.grades : [],
            loadingGrades: false,
            fees: feesData.success ? feesData.data.fees : [],
            loadingFees: false,
            dashboard: dashData.success ? dashData.data : null,
            loadingDashboard: false
          }));
        } catch (e) {
          setSelectedStudent(s => ({ ...s, attendanceRecords: [], loadingAttendance: false, grades: [], loadingGrades: false, fees: [], loadingFees: false, dashboard: null, loadingDashboard: false }));
        }
      })();
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/students`;
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data?.students || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Add Student (Create)
  const handleAddStudent = async (studentData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        await fetchStudents();
        setShowAddModal(false);
      } else {
        alert('Failed to add student');
      }
    } catch (error) {
      alert('Error adding student');
    } finally {
      setLoading(false);
    }
  };

  // Edit Student (Update)
  const handleEditStudent = async (id, studentData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        await fetchStudents();
        setShowViewModal(false);
      } else {
        alert('Failed to update student');
      }
    } catch (error) {
      alert('Error updating student');
    } finally {
      setLoading(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchStudents();
        setShowViewModal(false);
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      alert('Error deleting student');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = async (student) => {
    setSelectedStudent({ ...student, loadingAttendance: true, loadingGrades: true, loadingFees: true, loadingDashboard: true });
    setShowViewModal(true);
    try {
      // Attendance fetch
      const attRes = await fetch(`${API_URL}/api/attendance/student/${student.id || student._id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const attData = await attRes.json();
      // Grades fetch
      const gradesRes = await fetch(`${API_URL}/api/students/${student.id || student._id}/grades`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const gradesData = await gradesRes.json();
      // Fees fetch
      const feesRes = await fetch(`${API_URL}/api/students/${student.id || student._id}/fees`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const feesData = await feesRes.json();
      // Dashboard fetch
      const dashRes = await fetch(`${API_URL}/api/dashboard/student/${student.id || student._id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const dashData = await dashRes.json();
      setSelectedStudent(s => ({
        ...s,
        attendanceRecords: attData.success ? attData.data.records : [],
        loadingAttendance: false,
        grades: gradesData.success ? gradesData.data.grades : [],
        loadingGrades: false,
        fees: feesData.success ? feesData.data.fees : [],
        loadingFees: false,
        dashboard: dashData.success ? dashData.data : null,
        loadingDashboard: false
      }));
    } catch (e) {
      setSelectedStudent(s => ({ ...s, attendanceRecords: [], loadingAttendance: false, grades: [], loadingGrades: false, fees: [], loadingFees: false, dashboard: null, loadingDashboard: false }));
    }
  };

  const classes = ['all', '1', '2', '3', '4','5','6', '7', '8', '9', '10','11','12'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === 'student') {
    return (
      <>
        {showViewModal && selectedStudent && (
          <ViewStudentModal 
            student={selectedStudent}
            onClose={() => {}}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">Manage student records and information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            style={{ display: user?.role === 'student' ? 'none' : undefined }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Student</span>
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard 
            key={student._id || student.id} 
            student={student} 
            onView={() => handleViewStudent(student)}
            onEdit={() => { setEditStudent(student); setShowEditModal(true); }}
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this student?')) {
                handleDeleteStudent(student._id || student.id);
              }
            }}
            canEdit={user?.role !== 'student'}
            canDelete={user?.role !== 'student'}
          />
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddModal && user?.role !== 'student' && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddStudent}
        />
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <ViewStudentModal 
          student={selectedStudent}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit Student Modal */}
      {showEditModal && editStudent && user?.role !== 'student' && (
        <EditStudentModal 
          student={editStudent}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditStudent}
        />
      )}
    </div>
  );
};

const StudentCard = ({ student, onView, onEdit, onDelete, canEdit, canDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'}
            alt={student.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.studentId || 'No ID'}</p>
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
              {canEdit && (
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
              )}
              {canDelete && (
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
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <GraduationCap className="w-4 h-4 mr-2" />
          {student.class ? `Class ${student.class}` : 'No class assigned'} 
          {student.section && ` - Section ${student.section}`}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {student.email || 'No email'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {student.phone || student.emergencyContact || 'No phone'}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-600">Active</p>
            <p className="text-xs text-gray-500">Status</p>
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enrolled
          </div>
        </div>
      </div>
    </div>
  );
};

const AddStudentModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    phone: '',
    emergencyContact: '',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  });

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
    if (!formData.class.trim()) {
      alert('Class is required');
      return;
    }
    if (!formData.section.trim()) {
      alert('Section is required');
      return;
    }
    if (!formData.rollNumber.trim()) {
      alert('Roll Number is required');
      return;
    }
    const { studentId, ...data } = formData;
    onAdd(data); // studentId ha dirin
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Student</h2>
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
            {/* Student ID input waa la saaray */}
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
                Class *
              </label>
              <select
                name="class"
                required
                value={formData.class}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Class</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
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
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewStudentModal = ({ student, onClose }) => {
  const [tab, setTab] = useState('profile');
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const attendance = student.attendanceRecords || [];
  const grades = student.grades || [];
  const fees = student.fees || [];
  const dashboard = student.dashboard;
  // Attendance summary
  const attendanceSummary = attendance.reduce((acc, rec) => {
    acc[rec.status] = (acc[rec.status] || 0) + 1;
    return acc;
  }, {});
  const total = attendance.length;
  const present = attendanceSummary['present'] || 0;
  const attendancePercent = total ? Math.round((present / total) * 100) : 0;

  // Grades chart data (simple trend)
  const gradeLabels = grades.map(g => g.subjectName + ' ' + (g.term || ''));
  const gradeScores = grades.map(g => g.score);

  // Fees summary
  const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalPending = totalFees - totalPaid;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-4 flex gap-4 border-b pb-2">
          <button onClick={() => setTab('profile')} className={`px-3 py-1 rounded-t ${tab==='profile' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Profile</button>
          <button onClick={() => setTab('attendance')} className={`px-3 py-1 rounded-t ${tab==='attendance' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Attendance</button>
          <button onClick={() => setTab('grades')} className={`px-3 py-1 rounded-t ${tab==='grades' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Grades</button>
          <button onClick={() => setTab('fees')} className={`px-3 py-1 rounded-t ${tab==='fees' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Fees</button>
          <button onClick={() => setTab('dashboard')} className={`px-3 py-1 rounded-t ${tab==='dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Dashboard</button>
        </div>
        {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <img
                src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'}
                alt={student.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
              <p className="text-gray-600">{student.studentId || 'No ID'}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{student.class ? `Class ${student.class}` : 'No class'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Roll No: {student.rollNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{student.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{student.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{student.dateOfBirth || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                    <p className="text-gray-900">{student.emergencyContact || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">Active</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{student.class || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Class</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{student.rollNumber || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Roll Number</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {tab === 'attendance' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Calendar className="w-5 h-5" /> Attendance History</h4>
            {student.loadingAttendance ? (
              <div className="text-blue-600">Loading attendance...</div>
            ) : (
              <>
                <div className="mb-4 flex gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-green-600">{present}</div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-red-600">{attendanceSummary['absent'] || 0}</div>
                    <div className="text-xs text-gray-600">Absent</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-yellow-600">{attendanceSummary['late'] || 0}</div>
                    <div className="text-xs text-gray-600">Late</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-600">{attendanceSummary['excused'] || 0}</div>
                    <div className="text-xs text-gray-600">Excused</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-gray-800">{attendancePercent}%</div>
                    <div className="text-xs text-gray-600">Attendance %</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Status</th>
                        <th className="px-2 py-1 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((rec, idx) => (
                        <tr key={rec._id || idx}>
                          <td className="px-2 py-1">{new Date(rec.date).toLocaleDateString()}</td>
                          <td className="px-2 py-1 capitalize">{rec.status}</td>
                          <td className="px-2 py-1">{rec.reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {attendance.length === 0 && <div className="text-gray-500 py-4">No attendance records found.</div>}
                </div>
              </>
            )}
          </div>
        )}
        {tab === 'grades' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Grades</h4>
            {student.loadingGrades ? (
              <div className="text-blue-600">Loading grades...</div>
            ) : (
              <>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Subject</th>
                        <th className="px-2 py-1 text-left">Term</th>
                        <th className="px-2 py-1 text-left">Score</th>
                        <th className="px-2 py-1 text-left">Max Score</th>
                        <th className="px-2 py-1 text-left">Exam Type</th>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g, idx) => (
                        <tr key={g._id || idx}>
                          <td className="px-2 py-1">{g.subjectName}</td>
                          <td className="px-2 py-1">{g.term || '-'}</td>
                          <td className="px-2 py-1">{g.score}</td>
                          <td className="px-2 py-1">{g.maxScore}</td>
                          <td className="px-2 py-1">{g.examType || '-'}</td>
                          <td className="px-2 py-1">{g.date ? new Date(g.date).toLocaleDateString() : '-'}</td>
                          <td className="px-2 py-1">
                            <button className="text-blue-600 underline" onClick={() => setSelectedGrade(g)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {grades.length === 0 && <div className="text-gray-500 py-4">No grades found.</div>}
                </div>
                {selectedGrade && (
                  <GradeDetailModal grade={selectedGrade} onClose={() => setSelectedGrade(null)} />
                )}
              </>
            )}
          </div>
        )}
        {tab === 'fees' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Fees</h4>
            {student.loadingFees ? (
              <div className="text-blue-600">Loading fees...</div>
            ) : (
              <>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Type</th>
                        <th className="px-2 py-1 text-left">Amount</th>
                        <th className="px-2 py-1 text-left">Status</th>
                        <th className="px-2 py-1 text-left">Due Date</th>
                        <th className="px-2 py-1 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((f, idx) => (
                        <tr key={f._id || idx}>
                          <td className="px-2 py-1">{f.type}</td>
                          <td className="px-2 py-1">{f.amount}</td>
                          <td className="px-2 py-1">{f.status}</td>
                          <td className="px-2 py-1">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '-'}</td>
                          <td className="px-2 py-1">
                            <button className="text-blue-600 underline" onClick={() => setSelectedFee(f)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {fees.length === 0 && <div className="text-gray-500 py-4">No fees found.</div>}
                </div>
                {selectedFee && (
                  <FeeDetailModal fee={selectedFee} onClose={() => setSelectedFee(null)} />
                )}
              </>
            )}
          </div>
        )}
        {tab === 'dashboard' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><PieChart className="w-5 h-5" /> Dashboard & Analytics</h4>
            {student.loadingDashboard ? (
              <div className="text-blue-600">Loading dashboard...</div>
            ) : dashboard ? (
              <>
                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-blue-600">{dashboard.stats?.overallGrade || '-'}</div>
                    <div className="text-xs text-gray-600">Overall Grade</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-green-600">{dashboard.stats?.attendance || '-'}%</div>
                    <div className="text-xs text-gray-600">Attendance %</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-yellow-600">{dashboard.stats?.pendingAssignments || 0}</div>
                    <div className="text-xs text-gray-600">Pending Assignments</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-purple-600">{dashboard.stats?.upcomingExams || 0}</div>
                    <div className="text-xs text-gray-600">Upcoming Exams</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-red-600">{dashboard.pendingFees || 0}</div>
                    <div className="text-xs text-gray-600">Pending Fees</div>
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Subject Averages</h5>
                  <div className="flex gap-2 flex-wrap">
                    {dashboard.subjects && dashboard.subjects.length > 0 ? dashboard.subjects.map((s, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-3 min-w-[120px] text-center">
                        <div className="text-lg font-bold text-blue-700">{s.subject}</div>
                        <div className="text-md text-gray-800">{s.average ? s.average.toFixed(1) : '-'}%</div>
                      </div>
                    )) : <div className="text-gray-500">No subject data.</div>}
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Recent Grades</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left">Subject</th>
                          <th className="px-2 py-1 text-left">Score</th>
                          <th className="px-2 py-1 text-left">Max</th>
                          <th className="px-2 py-1 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.recentGrades && dashboard.recentGrades.length > 0 ? dashboard.recentGrades.map((g, idx) => (
                          <tr key={g._id || idx}>
                            <td className="px-2 py-1">{g.subjectName}</td>
                            <td className="px-2 py-1">{g.score}</td>
                            <td className="px-2 py-1">{g.maxScore}</td>
                            <td className="px-2 py-1">{g.date ? new Date(g.date).toLocaleDateString() : '-'}</td>
                          </tr>
                        )) : <tr><td colSpan={4} className="text-gray-500 py-4">No recent grades.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Today's Schedule</h5>
                  <ul className="list-disc pl-6">
                    {dashboard.todaySchedule && dashboard.todaySchedule.length > 0 ? dashboard.todaySchedule.map((s, idx) => (
                      <li key={idx}>{s.subject} - {s.time} ({s.room}) - {s.teacher}</li>
                    )) : <li className="text-gray-500">No schedule data.</li>}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Assignments</h5>
                  <ul className="list-disc pl-6">
                    {dashboard.assignments && dashboard.assignments.length > 0 ? dashboard.assignments.map((a, idx) => (
                      <li key={idx}>{a.subject}: {a.title} (Due: {a.dueDate}) - {a.status}</li>
                    )) : <li className="text-gray-500">No assignments.</li>}
                  </ul>
                </div>
              </>
            ) : <div className="text-gray-500">No dashboard data found.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const EditStudentModal = ({ student, onClose, onEdit }) => {
  const [formData, setFormData] = useState({ ...student });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(student._id || student.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
              <input type="text" name="studentId" required value={formData.studentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <input type="text" name="class" value={formData.class} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

// Simple FeeDetailModal
const FeeDetailModal = ({ fee, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Fee Details</h2>
        <button onClick={onClose} className="text-2xl">×</button>
      </div>
      <div className="space-y-2">
        {Object.entries(fee).map(([key, value]) => (
          <div key={key} className="flex justify-between"><span className="font-medium">{key}:</span> <span>{String(value)}</span></div>
        ))}
      </div>
    </div>
  </div>
);

// Simple GradeDetailModal
const GradeDetailModal = ({ grade, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Grade Details</h2>
        <button onClick={onClose} className="text-2xl">×</button>
      </div>
      <div className="space-y-2">
        {Object.entries(grade).map(([key, value]) => (
          <div key={key} className="flex justify-between"><span className="font-medium">{key}:</span> <span>{String(value)}</span></div>
        ))}
      </div>
    </div>
  </div>
);

export default StudentManagement;
