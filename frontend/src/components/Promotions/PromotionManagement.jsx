import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [term, setTerm] = useState('Third Term');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClasses();
    fetchPromotions();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        academicYear,
        term,
        ...(filter !== 'all' && { status: filter }),
        ...(selectedClass && { grade: selectedClass })
      });

      const response = await axios.get(`/api/promotions?${params}`);
      setPromotions(response.data.data.promotions || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const evaluateStudents = async () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/promotions/evaluate', {
        classId: selectedClass,
        academicYear,
        term
      });

      alert(`Evaluation completed! ${response.data.data.eligible} out of ${response.data.data.totalStudents} students are eligible for promotion.`);
      fetchPromotions();
    } catch (error) {
      console.error('Error evaluating students:', error);
      alert('Error evaluating students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const promoteStudent = async (promotionId) => {
    try {
      await axios.post(`/api/promotions/promote/${promotionId}`);
      alert('Student promoted successfully!');
      fetchPromotions();
    } catch (error) {
      console.error('Error promoting student:', error);
      alert('Error promoting student. Please try again.');
    }
  };

  const bulkPromote = async () => {
    const eligiblePromotions = promotions.filter(p => p.promotionStatus === 'eligible');
    
    if (eligiblePromotions.length === 0) {
      alert('No eligible students found for promotion');
      return;
    }

    if (!confirm(`Are you sure you want to promote ${eligiblePromotions.length} eligible students?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/promotions/bulk-promote', {
        classId: selectedClass,
        academicYear,
        studentIds: eligiblePromotions.map(p => p.studentId._id)
      });

      alert(`Bulk promotion completed! ${response.data.data.promoted} students promoted, ${response.data.data.failed} failed.`);
      fetchPromotions();
    } catch (error) {
      console.error('Error in bulk promotion:', error);
      alert('Error in bulk promotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      eligible: 'bg-green-100 text-green-800',
      promoted: 'bg-blue-100 text-blue-800',
      held_back: 'bg-red-100 text-red-800',
      under_review: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getRequirementIcon = (met) => {
    return met ? (
      <span className="text-green-500">✓</span>
    ) : (
      <span className="text-red-500">✗</span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Promotion Management</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>

          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="eligible">Eligible</option>
            <option value="promoted">Promoted</option>
            <option value="held_back">Held Back</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={evaluateStudents}
            disabled={loading || !selectedClass}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Evaluating...' : 'Evaluate Students'}
          </button>

          <button
            onClick={bulkPromote}
            disabled={loading || promotions.filter(p => p.promotionStatus === 'eligible').length === 0}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bulk Promote Eligible
          </button>

          <button
            onClick={fetchPromotions}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Promotions Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading promotions...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promotions.map((promotion) => (
                <tr key={promotion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {promotion.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {promotion.studentId?.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.currentClass}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.nextClass}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 text-sm">
                      <span title="Midterm">
                        {getRequirementIcon(promotion.examResults?.midterm?.completed)} Mid
                      </span>
                      <span title="Final">
                        {getRequirementIcon(promotion.examResults?.final?.completed)} Final
                      </span>
                      <span title="Attendance">
                        {getRequirementIcon(promotion.attendancePercentage >= 75)} Att
                      </span>
                      <span title="Fees">
                        {getRequirementIcon(promotion.feeStatus === 'paid')} Fee
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.overallAverage?.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(promotion.promotionStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {promotion.promotionStatus === 'eligible' && (
                      <button
                        onClick={() => promoteStudent(promotion._id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Promote
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // Show detailed view
                        alert(`Student: ${promotion.studentName}\nMidterm: ${promotion.examResults?.midterm?.averageScore || 0}%\nFinal: ${promotion.examResults?.final?.averageScore || 0}%\nAttendance: ${promotion.attendancePercentage}%\nFee Status: ${promotion.feeStatus}`);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {promotions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No promotion records found. Select a class and click "Evaluate Students" to begin.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;