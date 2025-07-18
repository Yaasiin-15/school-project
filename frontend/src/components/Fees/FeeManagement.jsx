import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  CreditCard,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

const FeeManagement = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studentId: 'all',
    status: 'all',
    type: 'all',
    term: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalFees: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFee, setEditFee] = useState(null);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentFees();
    } else {
      fetchFees();
      fetchStudents();
    }
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm,
        ...filters
      });
      const response = await fetch(`${API_URL}/api/fees?${queryParams}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFees(data.data?.fees || []);
        setPagination(data.data?.pagination || { currentPage: 1, totalPages: 1, totalFees: 0 });
      }
    } catch (error) {
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data?.students || []);
      }
    } catch (error) {
      setStudents([]);
    }
  };

  const fetchStudentFees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/students/${user.id || user._id}/fees`);
      if (response.ok) {
        const data = await response.json();
        setFees(data.data?.fees || []);
      }
    } catch (error) {
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFee = async (feeData) => {
    try {
      const response = await fetch(`${API_URL}/api/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(feeData),
      });
      
      if (response.ok) {
        await fetchFees();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding fee:', error);
    }
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/api/fees/${selectedFee._id || selectedFee.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (response.ok) {
        await fetchFees();
        setShowPaymentModal(false);
        setSelectedFee(null);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleViewFee = async (fee) => {
    setSelectedFee({ ...fee, loading: true });
    setShowViewModal(true);
    try {
      // Fetch full fee details
      const res = await fetch(`${API_URL}/api/fees/${fee._id || fee.id}`);
      const data = await res.json();
      // Fetch payment history (if available)
      // Fetch analytics
      const analyticsRes = await fetch(`${API_URL}/api/fees/analytics/overview`);
      const analyticsData = await analyticsRes.json();
      setSelectedFee(s => ({
        ...s,
        ...data.data?.fee,
        analytics: analyticsData.success ? analyticsData.data : null,
        loading: false
      }));
    } catch (e) {
      setSelectedFee(s => ({ ...s, analytics: null, loading: false }));
    }
  };

  // Edit Fee (Update)
  const handleEditFee = async (id, feeData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/fees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(feeData)
      });
      if (response.ok) {
        await fetchFees();
        setShowEditModal(false);
      } else {
        // handle error
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Delete Fee
  const handleDeleteFee = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/fees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchFees();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        // handle error
      }
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Fees</h1>
          <p className="text-gray-600 mt-2">View your fee status and payment history</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, idx) => (
                  <tr key={f._id || idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{f.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{f.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{f.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {fees.length === 0 && <tr><td colSpan={4} className="text-center text-gray-500 py-4">No fees found.</td></tr>}
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
              Fee Management
            </h1>
            <p className="text-gray-600 mt-2">Manage student fees and payments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            style={{ display: user?.role === 'student' ? 'none' : undefined }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Fee</span>
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
                placeholder="Search fees..."
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
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="tuition">Tuition</option>
            <option value="transport">Transport</option>
            <option value="library">Library</option>
            <option value="lab">Lab</option>
            <option value="sports">Sports</option>
            <option value="exam">Exam</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Fees List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.map((fee) => (
                <FeeRow 
                  key={fee._id || fee.id} 
                  fee={fee} 
                  onView={() => handleViewFee(fee)}
                  onPayment={() => { setSelectedFee(fee); setShowPaymentModal(true); }}
                  onEdit={() => { setEditFee(fee); setShowEditModal(true); }}
                  onDelete={() => {
                    if (window.confirm('Are you sure you want to delete this fee record?')) {
                      handleDeleteFee(fee._id || fee.id);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {fees.length} of {pagination.totalFees} fees
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      page === pagination.currentPage
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

      {/* Add Fee Modal */}
      {showAddModal && user?.role !== 'student' && (
        <AddFeeModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFee}
          students={students}
        />
      )}

      {/* View Fee Modal */}
      {showViewModal && selectedFee && (
        <ViewFeeModal 
          fee={selectedFee}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedFee && (
        <PaymentModal 
          fee={selectedFee}
          onClose={() => setShowPaymentModal(false)}
          onPayment={handleProcessPayment}
        />
      )}

      {/* Edit Fee Modal */}
      {showEditModal && editFee && user?.role !== 'student' && (
        <EditFeeModal 
          fee={editFee}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditFee}
          students={students}
        />
      )}
    </div>
  );
};

const FeeRow = ({ fee, onView, onPayment, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const totalAmount = fee.amount + (fee.lateFee || 0) - (fee.discount || 0);
  const remainingAmount = totalAmount - (fee.paidAmount || 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-800 bg-green-100';
      case 'partial':
        return 'text-blue-800 bg-blue-100';
      case 'overdue':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-yellow-800 bg-yellow-100';
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <User className="w-8 h-8 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900">{fee.studentName}</div>
            <div className="text-sm text-gray-500">{fee.studentClass}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
          {fee.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          ${totalAmount.toLocaleString()}
        </div>
        {fee.paidAmount > 0 && (
          <div className="text-xs text-green-600">
            Paid: ${fee.paidAmount.toLocaleString()}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(fee.status)}
          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fee.status)} capitalize`}>
            {fee.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <div className="text-sm text-gray-900">{fee.dueDate}</div>
            {fee.status === 'overdue' && (
              <div className="text-xs text-red-500">Overdue</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          {fee.status !== 'paid' && (
            <button
              onClick={onPayment}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center"
            >
              <CreditCard className="w-3 h-3 mr-1" />
              Pay
            </button>
          )}
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
        </div>
      </td>
    </tr>
  );
};

const AddFeeModal = ({ onClose, onAdd, students }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentClass: '',
    amount: '',
    type: '',
    dueDate: '',
    term: 'Spring 2024',
    description: '',
    discount: 0
  });

  const feeTypes = ['tuition', 'transport', 'library', 'lab', 'sports', 'exam', 'other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.studentId) {
      alert('Student is required');
      return;
    }
    if (!formData.type) {
      alert('Fee type is required');
      return;
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      alert('Amount must be a positive number');
      return;
    }
    if (!formData.dueDate) {
      alert('Due date is required');
      return;
    }
    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (selectedStudent) {
      formData.studentName = selectedStudent.name;
      formData.studentClass = selectedStudent.class;
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Fee</h2>
        
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
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId}) - {student.class}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Type *
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {feeTypes.map(type => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                required
                value={formData.dueDate}
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
                <option value="Spring 2024">Spring 2024</option>
                <option value="Summer 2024">Summer 2024</option>
                <option value="Fall 2024">Fall 2024</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <input
                type="number"
                name="discount"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Fee description..."
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
              Add Fee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewFeeModal = ({ fee, onClose }) => {
  const [tab, setTab] = useState('overview');
  const analytics = fee.analytics;
  // Payment history (if available)
  const payments = fee.payments || [];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Fee Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-4 flex gap-4 border-b pb-2">
          <button onClick={() => setTab('overview')} className={`px-3 py-1 rounded-t ${tab==='overview' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Overview</button>
          <button onClick={() => setTab('payments')} className={`px-3 py-1 rounded-t ${tab==='payments' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Payments</button>
          <button onClick={() => setTab('invoice')} className={`px-3 py-1 rounded-t ${tab==='invoice' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Invoice</button>
          <button onClick={() => setTab('analytics')} className={`px-3 py-1 rounded-t ${tab==='analytics' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>Analytics</button>
              </div>
        {fee.loading ? (
          <div className="text-blue-600">Loading...</div>
        ) : (
          <>
            {tab === 'overview' && (
          <div>
                <div className="mb-4 flex gap-4 flex-wrap">
                  <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-blue-600">{fee.amount}</div>
                    <div className="text-xs text-gray-600">Amount</div>
              </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-green-600">{fee.paidAmount || 0}</div>
                    <div className="text-xs text-gray-600">Paid</div>
              </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-red-600">{fee.amount - (fee.paidAmount || 0)}</div>
                    <div className="text-xs text-gray-600">Pending</div>
            </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[120px]">
                    <div className="text-xl font-bold text-yellow-600">{fee.status}</div>
                    <div className="text-xs text-gray-600">Status</div>
          </div>
              </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Fee Type</h5>
                  <div className="text-gray-700">{fee.type}</div>
              </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Due Date</h5>
                  <div className="text-gray-700">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</div>
              </div>
              </div>
            )}
            {tab === 'payments' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment History</h4>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Amount</th>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Method</th>
                        <th className="px-2 py-1 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length > 0 ? payments.map((p, idx) => (
                        <tr key={p._id || idx}>
                          <td className="px-2 py-1">{p.amount}</td>
                          <td className="px-2 py-1">{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                          <td className="px-2 py-1">{p.method || '-'}</td>
                          <td className="px-2 py-1 capitalize">{p.status || '-'}</td>
                        </tr>
                      )) : <tr><td colSpan={4} className="text-gray-500 py-4">No payments found.</td></tr>}
                    </tbody>
                  </table>
              </div>
              </div>
            )}
            {tab === 'invoice' && (
          <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Invoice Details</h4>
                <div className="mb-4">
                  <div className="text-gray-700">Invoice #: {fee.invoiceNumber || '-'}</div>
                  <div className="text-gray-700">Student: {fee.studentName || '-'}</div>
                  <div className="text-gray-700">Class: {fee.studentClass || '-'}</div>
                  <div className="text-gray-700">Type: {fee.type || '-'}</div>
                  <div className="text-gray-700">Amount: {fee.amount || '-'}</div>
                  <div className="text-gray-700">Status: {fee.status || '-'}</div>
                  <div className="text-gray-700">Due: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</div>
                  <div className="text-gray-700">Paid: {fee.paidAmount || 0}</div>
                  <div className="text-gray-700">Paid Date: {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}</div>
              </div>
                </div>
              )}
            {tab === 'analytics' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Analytics</h4>
                {analytics ? (
                  <>
                    <div className="mb-4 flex gap-4 flex-wrap">
                      <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-blue-600">{analytics.totalFees}</div>
                        <div className="text-xs text-gray-600">Total Fees</div>
                </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-green-600">{analytics.totalPaid}</div>
                        <div className="text-xs text-gray-600">Total Paid</div>
              </div>
                      <div className="bg-red-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-red-600">{analytics.totalPending}</div>
                        <div className="text-xs text-gray-600">Total Pending</div>
              </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[120px]">
                        <div className="text-xl font-bold text-yellow-600">{analytics.collectionRate ? analytics.collectionRate.toFixed(1) : 0}%</div>
                        <div className="text-xs text-gray-600">Collection Rate</div>
                </div>
            </div>
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2">Status Distribution</h5>
                      <div className="flex gap-2 flex-wrap">
                        {analytics.statusDistribution && Object.keys(analytics.statusDistribution).length > 0 ? (
                          Object.entries(analytics.statusDistribution).map(([status, count]) => (
                            <div key={status} className="bg-gray-100 rounded-lg p-3 min-w-[100px] text-center">
                              <div className="text-lg font-bold text-blue-700">{status}</div>
                              <div className="text-md text-gray-800">{count}</div>
          </div>
                          ))
                        ) : <div className="text-gray-500">No status data.</div>}
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

const PaymentModal = ({ fee, onClose, onPayment }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    transactionId: ''
  });

  const totalAmount = fee.amount + (fee.lateFee || 0) - (fee.discount || 0);
  const remainingAmount = totalAmount - (fee.paidAmount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPayment(formData);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Payment</h2>
        
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Remaining Amount:</div>
          <div className="text-2xl font-bold text-gray-900">
            ${remainingAmount.toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount *
            </label>
            <input
              type="number"
              name="amount"
              required
              min="0.01"
              max={remainingAmount}
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Check">Check</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional transaction reference"
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
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditFeeModal = ({ fee, onClose, onEdit, students }) => {
  const [formData, setFormData] = useState({ ...fee });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(fee._id || fee.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Fee</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input type="number" name="amount" required value={formData.amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input type="text" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <input type="text" name="term" value={formData.term} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

export default FeeManagement;
