import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeeReminderManagement = () => {
  const [reminders, setReminders] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [reminderType, setReminderType] = useState('before_due');
  const [daysBefore, setDaysBefore] = useState(7);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchReminders();
    fetchStudents();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);

      const response = await axios.get(`/api/fee-reminders?${params}`);
      setReminders(response.data.data.reminders || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const createReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/fee-reminders/create', {
        reminderType,
        daysBefore: reminderType === 'after_due' ? Math.abs(daysBefore) : daysBefore,
        studentIds: selectedStudents
      });

      alert(`${response.data.data.count} reminders created successfully!`);
      fetchReminders();
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error creating reminders:', error);
      alert('Error creating reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendReminders = async (reminderIds = []) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/fee-reminders/send', {
        reminderIds
      });

      alert(`Reminders sent! ${response.data.data.sent} successful, ${response.data.data.failed} failed.`);
      fetchReminders();
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Error sending reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeReminder = async (reminderId) => {
    try {
      await axios.post(`/api/fee-reminders/${reminderId}/acknowledge`);
      alert('Reminder acknowledged successfully!');
      fetchReminders();
    } catch (error) {
      console.error('Error acknowledging reminder:', error);
      alert('Error acknowledging reminder. Please try again.');
    }
  };

  const deleteReminder = async (reminderId) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await axios.delete(`/api/fee-reminders/${reminderId}`);
      alert('Reminder deleted successfully!');
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Error deleting reminder. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      acknowledged: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getReminderTypeBadge = (type) => {
    const typeColors = {
      before_due: 'bg-blue-100 text-blue-800',
      on_due: 'bg-orange-100 text-orange-800',
      after_due: 'bg-red-100 text-red-800',
      final_notice: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Reminder Management</h2>
        
        {/* Create Reminders Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Create New Reminders</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="before_due">Before Due Date</option>
              <option value="on_due">On Due Date</option>
              <option value="after_due">After Due Date</option>
              <option value="final_notice">Final Notice</option>
            </select>

            <input
              type="number"
              value={daysBefore}
              onChange={(e) => setDaysBefore(parseInt(e.target.value))}
              placeholder="Days before/after"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(Array.from(e.target.selectedOptions, option => option.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            >
              <option value="">All Students</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.class}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={createReminders}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Reminders'}
            </button>

            <button
              onClick={() => sendReminders()}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send All Pending
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="acknowledged">Acknowledged</option>
          </select>

          <button
            onClick={fetchReminders}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Reminders Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading reminders...</p>
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
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminder Type
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
              {reminders.map((reminder) => (
                <tr key={reminder._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reminder.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reminder.studentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reminder.feeType.charAt(0).toUpperCase() + reminder.feeType.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(reminder.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(reminder.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getReminderTypeBadge(reminder.reminderType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reminder.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {reminder.status === 'pending' && (
                        <button
                          onClick={() => sendReminders([reminder._id])}
                          className="text-green-600 hover:text-green-900"
                        >
                          Send
                        </button>
                      )}
                      
                      {reminder.status === 'sent' && (
                        <button
                          onClick={() => acknowledgeReminder(reminder._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Acknowledge
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          alert(`Message:\n\n${reminder.message}`);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        View
                      </button>
                      
                      <button
                        onClick={() => deleteReminder(reminder._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reminders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fee reminders found. Create some reminders to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeReminderManagement;