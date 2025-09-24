import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  GraduationCap,
  Settings,
  FileText,
  UserPlus
} from 'lucide-react';
import subjectService from '../../services/subjectService';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch subjects data
  const fetchSubjects = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        search: searchTerm,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        gradeLevel: gradeFilter !== 'all' ? gradeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await subjectService.getSubjects(params);
      setSubjects(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments and grade levels
  const fetchFilters = async () => {
    try {
      const [deptResponse, gradeResponse] = await Promise.all([
        subjectService.getDepartments(),
        subjectService.getGradeLevels()
      ]);
      setDepartments(deptResponse.data);
      setGradeLevels(gradeResponse.data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [searchTerm, departmentFilter, gradeFilter, statusFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="mr-3 text-blue-600" />
                Subject Management
              </h1>
              <p className="text-gray-600 mt-1">Manage curriculum, subjects, and teacher assignments</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </button>
          </div>
        </div>

        {/* Rest of component will be added in next part */}
      </div>
    </div>
  );
};

export default SubjectManagement;