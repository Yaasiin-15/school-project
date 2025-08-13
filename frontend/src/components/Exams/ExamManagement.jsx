import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, FileText, Download, Users, BookOpen, Clock, CheckCircle } from 'lucide-react';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exams');
  const [classes, setClasses] = useState([]);
  const [applyToAllClasses, setApplyToAllClasses] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchExams();
    fetchClasses();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setExams(data.data || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setClasses(data.data || []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const examData = {
      title: formData.get('title'),
      subject: formData.get('subject'),
      date: formData.get('date'),
      duration: formData.get('duration'),
      maxMarks: formData.get('maxMarks'),
      instructions: formData.get('instructions'),
      applyToAllClasses: applyToAllClasses,
      examType: formData.get('examType') || 'exam'
    };

    // Only include class if not applying to all classes
    if (!applyToAllClasses) {
      examData.class = formData.get('class');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });

      const result = await response.json();
      if (response.ok) {
        setShowCreateModal(false);
        fetchExams();
        e.target.reset();
        setApplyToAllClasses(true);
        alert(result.message || 'Exam created successfully!');
      } else {
        alert(result.message || 'Failed to create exam');
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksEntry = async (examId) => {
    setSelectedExam(examId);
    setShowMarksModal(true);
    
    // Fetch students for this exam
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams/${examId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStudents(data.data || []);
      
      // Initialize marks object
      const initialMarks = {};
      data.data?.forEach(student => {
        initialMarks[student._id] = student.marks || '';
      });
      setMarks(initialMarks);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleSaveMarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams/${selectedExam}/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ marks })
      });

      if (response.ok) {
        setShowMarksModal(false);
        fetchExams();
      }
    } catch (error) {
      console.error('Failed to save marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReportCard = async (examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/exams/${examId}/report-cards`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-cards-${examId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to generate report cards:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Exam Management
            </h1>
            <p className="text-gray-600 mt-2">Create exams, enter marks, and generate report cards</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Exam
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'exams' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Calendar className="inline w-5 h-5 mr-2" />
          Exams
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FileText className="inline w-5 h-5 mr-2" />
          Results
        </button>
      </div>

      {activeTab === 'exams' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="grid gap-4">
            {exams.map((exam) => (
              <div key={exam._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      {exam.totalStudents > 50 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          School-wide
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {exam.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {exam.class || 'All Classes'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.duration} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-500">Max Marks: {exam.maxMarks}</span>
                      <span className="text-blue-600 font-medium">
                        {exam.totalStudents} students
                      </span>
                      {exam.averageScore > 0 && (
                        <span className="text-green-600">
                          Avg: {exam.averageScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarksEntry(exam._id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Enter Marks
                    </button>
                    <button
                      onClick={() => generateReportCard(exam._id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Report Cards
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Exam</h3>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mid-term Mathematics Exam"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                  <select
                    name="examType"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="exam">Regular Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="midterm">Mid-term</option>
                    <option value="final">Final Exam</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>

              {/* Apply to All Classes Toggle */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Apply to All Classes</h4>
                    <p className="text-sm text-gray-600">Create this exam for all students in the school</p>
                    {applyToAllClasses && (
                      <p className="text-xs text-blue-600 mt-1">
                        Will create exam for {classes.reduce((sum, cls) => sum + cls.studentCount, 0)} students across {classes.length} classes
                      </p>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToAllClasses}
                      onChange={(e) => setApplyToAllClasses(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Class Selection (only shown when not applying to all classes) */}
              {!applyToAllClasses && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                  <select
                    name="class"
                    required={!applyToAllClasses}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.className} value={cls.className}>
                        {cls.className} ({cls.studentCount} students)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                  <input
                    name="duration"
                    type="number"
                    required
                    min="1"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="90"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input
                  name="maxMarks"
                  type="number"
                  required
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  name="instructions"
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Exam instructions..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setApplyToAllClasses(true);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : applyToAllClasses ? 'Create School-wide Exam' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marks Entry Modal */}
      {showMarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Enter Marks</h3>
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={selectedExam?.maxMarks || 100}
                      value={marks[student._id] || ''}
                      onChange={(e) => setMarks(prev => ({
                        ...prev,
                        [student._id]: e.target.value
                      }))}
                      className="w-20 border rounded-lg px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                    <span className="text-gray-500 text-sm">/ {selectedExam?.maxMarks || 100}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowMarksModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarks}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Marks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;