import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  User,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

const GradeManagement = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studentId: 'all',
    subjectId: 'all',
    examType: 'all',
    term: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGrades: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editGrade, setEditGrade] = useState(null);

  useEffect(() => {
    if (!pagination?.currentPage) return; // Safety check

    if (user?.role === 'student') {
      fetchStudentGrades();
    } else {
      fetchGrades();
      fetchStudents();
    }
  }, [searchTerm, filters, pagination?.currentPage, user?.role]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm,
        ...filters
      });
      const response = await fetch(`${API_URL}/api/grades?${queryParams}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGrades(data.data?.grades || []);
        setPagination(data.data?.pagination || { currentPage: 1, totalPages: 1, totalGrades: 0 });
      }
    } catch (error) {
      setGrades([]);
      setPagination({ currentPage: 1, totalPages: 1, totalGrades: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentGrades = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/students/${user.id || user._id}/grades`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGrades(data.data?.grades || []);
      }
    } catch (error) {
      setGrades([]);
      setPagination({ currentPage: 1, totalPages: 1, totalGrades: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        const students = data.data?.students || [];
        console.log('Fetched students:', students.slice(0, 2)); // Log first 2 students for debugging
        setStudents(students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddGrade = async (gradeData) => {
    try {
      console.log('Current user role:', user?.role);
      console.log('Sending grade data:', gradeData);
      
      const response = await fetch(`${API_URL}/api/grades`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(gradeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Grade created successfully:', result);
        await fetchGrades();
        setShowAddModal(false);
        alert('Grade added successfully!');
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Server error';
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Server error:', errorMessage);
        alert(`Failed to add grade: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('Cannot connect to server. Please check if the backend is running.');
      } else {
        alert(`Error adding grade: ${error.message}`);
      }
    }
  };

  const handleViewGrade = (grade) => {
    setSelectedGrade(grade);
    setShowViewModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    if (page && typeof page === 'number') {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  // Edit Grade (Update)
  const handleEditGrade = async (id, gradeData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/grades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(gradeData)
      });
      if (response.ok) {
        await fetchGrades();
        setShowEditModal(false);
      } else {
        alert('Failed to update grade');
      }
    } catch (error) {
      alert('Error updating grade');
    } finally {
      setLoading(false);
    }
  };

  // Delete Grade
  const handleDeleteGrade = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/grades/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchGrades();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        alert('Failed to delete grade');
      }
    } catch (error) {
      alert('Error deleting grade');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Grades</h1>
          <p className="text-gray-600 mt-2">View your grades and academic performance</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, idx) => (
                  <tr key={g._id || idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{g.subjectName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{g.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{g.maxScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{g.examType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{g.term}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{g.date ? new Date(g.date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {grades.length === 0 && <tr><td colSpan={6} className="text-center text-gray-500 py-4">No grades found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
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
              Grade Management
            </h1>
            <p className="text-gray-600 mt-2">Manage student grades and academic performance</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            style={{ display: user?.role === 'student' ? 'none' : undefined }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Grade</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filters.studentId}
            onChange={(e) => handleFilterChange('studentId', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.studentId})
              </option>
            ))}
          </select>

          <select
            value={filters.examType}
            onChange={(e) => handleFilterChange('examType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Exam Types</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="project">Project</option>
          </select>

          <select
            value={filters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Terms</option>
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <GradeRow
                  key={grade._id || grade.id}
                  grade={grade}
                  onView={() => handleViewGrade(grade)}
                  onEdit={() => { setEditGrade(grade); setShowEditModal(true); }}
                  onDelete={() => {
                    if (window.confirm('Are you sure you want to delete this grade record?')) {
                      handleDeleteGrade(grade._id || grade.id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {grades.length} of {pagination?.totalGrades || 0} grades
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${page === (pagination?.currentPage || 1)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Grade Modal */}
      {showAddModal && user?.role !== 'student' && (
        <AddGradeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddGrade}
          students={students}
        />
      )}

      {/* View Grade Modal */}
      {showViewModal && selectedGrade && (
        <ViewGradeModal
          grade={selectedGrade}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit Grade Modal */}
      {showEditModal && editGrade && user?.role !== 'student' && (
        <EditGradeModal
          grade={editGrade}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditGrade}
          students={students}
        />
      )}
    </div>
  );
};

const GradeRow = ({ grade, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User className="w-8 h-8 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
            <div className="text-sm text-gray-500">{grade.className}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{grade.subjectName}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
          {grade.examType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {grade.score}/{grade.maxScore}
        </div>
        <div className="text-xs text-gray-500">{percentage}%</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(percentage)}`}>
          {grade.gradeLevel}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{grade.date}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              {user?.role !== 'student' && <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>}
              {user?.role !== 'student' && <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const AddGradeModal = ({ onClose, onAdd, students }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    className: '',
    subjectName: '',
    examType: '',
    score: '',
    maxScore: 100,
    teacherId: '',
    teacherName: '',
    date: new Date().toISOString().split('T')[0],
    remarks: '',
    term: 'First Term',
    academicYear: '2024-25',
    weightage: 10
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const examTypes = ['quiz', 'assignment', 'midterm', 'final', 'project'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.studentId) {
      alert('Student is required');
      return;
    }
    if (!formData.subjectName) {
      alert('Subject is required');
      return;
    }
    if (!formData.examType) {
      alert('Exam type is required');
      return;
    }
    if (formData.score === '' || isNaN(formData.score) || Number(formData.score) < 0) {
      alert('Score must be a non-negative number');
      return;
    }
    if (formData.maxScore === '' || isNaN(formData.maxScore) || Number(formData.maxScore) <= 0) {
      alert('Max score must be a positive number');
      return;
    }
    const selectedStudent = students.find(s => s._id === formData.studentId);
    if (selectedStudent) {
      formData.studentName = selectedStudent.name;
      formData.className = selectedStudent.class;
      // Remove classId to avoid validation issues
      delete formData.classId;
    }
    onAdd(formData);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Grade</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.studentId}) - {student.class}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                name="subjectName"
                required
                value={formData.subjectName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <select
                name="examType"
                required
                value={formData.examType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score *
              </label>
              <input
                type="number"
                name="score"
                required
                min="0"
                max={formData.maxScore}
                value={formData.score}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Score *
              </label>
              <input
                type="number"
                name="maxScore"
                required
                min="1"
                value={formData.maxScore}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weightage (%)
              </label>
              <input
                type="number"
                name="weightage"
                min="1"
                max="100"
                value={formData.weightage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              rows="3"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional remarks about the grade..."
            />
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
              Add Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewGradeModal = ({ grade, onClose }) => {
  const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Grade Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Grade Summary */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(percentage)}`}>
              {grade.gradeLevel}
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {grade.score}/{grade.maxScore}
            </div>
            <div className="text-lg text-gray-600">{percentage}%</div>
          </div>

          {/* Grade Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Student Name</label>
                  <p className="text-gray-900">{grade.studentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Class</label>
                  <p className="text-gray-900">{grade.className}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Exam Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900">{grade.subjectName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Exam Type</label>
                  <p className="text-gray-900 capitalize">{grade.examType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">{grade.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Term</label>
                  <p className="text-gray-900">{grade.term}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher and Additional Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Teacher</label>
                <p className="text-gray-900">{grade.teacherName || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Weightage</label>
                <p className="text-gray-900">{grade.weightage}%</p>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {grade.remarks && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Remarks</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{grade.remarks}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EditGradeModal = ({ grade, onClose, onEdit, students }) => {
  const [formData, setFormData] = useState({ ...grade });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(grade._id || grade.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Grade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
              <select name="studentId" required value={formData.studentId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <input type="text" name="examType" value={formData.examType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input type="number" name="score" value={formData.score} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
              <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <input type="text" name="term" value={formData.term} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

export default GradeManagement;
