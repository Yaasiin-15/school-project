import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Bell,
  User,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    audience: 'all',
    priority: 'all',
    category: 'all',
    isActive: 'true'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchAnnouncements();
  }, [searchTerm, filters]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...filters
      });
      const response = await fetch(`${API_URL}/api/announcements?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data?.announcements || []);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (announcementData) => {
    try {
      const response = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(announcementData)
      });
      if (response.ok) {
        await fetchAnnouncements();
        setShowAddModal(false);
      } else {
        alert('Failed to add announcement');
      }
    } catch (error) {
      alert('Error adding announcement');
    }
  };

  // Edit Announcement (Update)
  const handleEditAnnouncement = async (id, announcementData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(announcementData)
      });
      if (response.ok) {
        await fetchAnnouncements();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        alert('Failed to update announcement');
      }
    } catch (error) {
      alert('Error updating announcement');
    } finally {
      setLoading(false);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchAnnouncements();
        setShowEditModal(false);
        setShowViewModal(false);
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      alert('Error deleting announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = async (announcement) => {
    setSelectedAnnouncement({ ...announcement, loading: true });
    setShowViewModal(true);
    try {
      // Mark as read (optional)
      await fetch(`${API_URL}/api/announcements/${announcement.id || announcement._id}/read`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      // Fetch full details
      const res = await fetch(`${API_URL}/api/announcements/${announcement.id || announcement._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setSelectedAnnouncement(s => ({ ...s, ...data.data?.announcement, loading: false }));
    } catch (e) {
      setSelectedAnnouncement(s => ({ ...s, loading: false }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAudience = filters.audience === 'all' || 
                           announcement.targetAudience.includes(filters.audience) ||
                           announcement.targetAudience.includes('all');
    
    const matchesPriority = filters.priority === 'all' || announcement.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || announcement.category === filters.category;
    const matchesActive = filters.isActive === 'all' || 
                         announcement.isActive === (filters.isActive === 'true');

    return matchesSearch && matchesAudience && matchesPriority && matchesCategory && matchesActive;
  });

  // Calculate summary data from real announcements
  const unreadCount = announcements.filter(a => !a.read).length;
  const categoryCounts = announcements.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});
  const priorityCounts = announcements.reduce((acc, a) => {
    acc[a.priority] = (acc[a.priority] || 0) + 1;
    return acc;
  }, {});

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
              Announcement Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage school announcements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Announcement</span>
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
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filters.audience}
            onChange={(e) => handleFilterChange('audience', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Audiences</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
            <option value="accountant">Accountants</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Add analytics/summary section above the announcements grid */}
      {/* Example: count by priority, unread count, by category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Announcement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-blue-800">{announcements.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
          <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread Announcements</p>
              <p className="text-2xl font-bold text-green-800">{unreadCount}</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
          <div className="bg-purple-100 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">By Category</p>
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <p key={cat} className="text-2xl font-bold text-purple-800 capitalize">{cat}: {count}</p>
              ))}
            </div>
            <Info className="w-8 h-8 text-purple-600" />
          </div>
          <div className="bg-red-100 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">By Priority</p>
              {Object.entries(priorityCounts).map(([prio, count]) => (
                <p key={prio} className="text-2xl font-bold text-red-800 capitalize">{prio}: {count}</p>
              ))}
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAnnouncements.map((announcement) => (
          <AnnouncementCard 
            key={announcement._id || announcement.id} 
            announcement={announcement} 
            onView={() => handleViewAnnouncement(announcement)}
            onEdit={() => { setEditAnnouncement(announcement); setShowEditModal(true); }}
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this announcement?')) {
                handleDeleteAnnouncement(announcement._id || announcement.id);
              }
            }}
          />
        ))}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <AddAnnouncementModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAnnouncement}
        />
      )}

      {/* View Announcement Modal */}
      {showViewModal && selectedAnnouncement && (
        <ViewAnnouncementModal 
          announcement={selectedAnnouncement}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && editAnnouncement && (
        <EditAnnouncementModal 
          announcement={editAnnouncement}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditAnnouncement}
        />
      )}
    </div>
  );
};

const AnnouncementCard = ({ announcement, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-800 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                {getPriorityIcon(announcement.priority)}
                <span className="ml-1 capitalize">{announcement.priority}</span>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-2 mb-3">{announcement.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {announcement.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {announcement.date}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {announcement.views || 0} views
              </div>
            </div>
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

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {announcement.targetAudience && announcement.targetAudience.map(audience => (
            <span key={audience} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
              {audience}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {announcement.isActive ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Active</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-xs">Inactive</span>
            </div>
          )}
        </div>
      </div>

      {announcement.expiryDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Expires: {announcement.expiryDate}
          </div>
        </div>
      )}
    </div>
  );
};

const AddAnnouncementModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: [],
    expiryDate: '',
    category: 'general'
  });

  const audienceOptions = ['admin', 'teacher', 'student', 'parent', 'accountant', 'all'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];
  const categoryOptions = ['general', 'academic', 'event', 'meeting', 'emergency', 'facility'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }
    if (!formData.priority.trim()) {
      alert('Priority is required');
      return;
    }
    if (!formData.targetAudience || !Array.isArray(formData.targetAudience) || formData.targetAudience.length === 0) {
      alert('At least one target audience must be selected');
      return;
    }
    onAdd(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudienceChange = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Announcement</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Announcement title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              required
              rows="4"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Announcement content..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority} className="capitalize">
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {audienceOptions.map(audience => (
                <label key={audience} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.targetAudience.includes(audience)}
                    onChange={() => handleAudienceChange(audience)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{audience}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Add Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewAnnouncementModal = ({ announcement, onClose }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-800 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Announcement Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-2xl font-semibold text-gray-900">{announcement.title}</h3>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
                <span className="capitalize">{announcement.priority} Priority</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {announcement.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {announcement.date}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {announcement.views || 0} views
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Content</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Details</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900 capitalize">{announcement.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">{announcement.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                {announcement.expiryDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Expires</label>
                    <p className="text-gray-900">{announcement.expiryDate}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h4>
              <div className="flex flex-wrap gap-2">
                {announcement.targetAudience && announcement.targetAudience.map(audience => (
                  <span key={audience} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditAnnouncementModal = ({ announcement, onClose, onEdit }) => {
  const [formData, setFormData] = useState({ ...announcement });
  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(announcement._id || announcement.id, formData);
  };
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAudienceChange = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience]
    }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea name="content" required rows="4" value={formData.content} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
              <select name="priority" required value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['admin', 'teacher', 'student', 'parent', 'accountant', 'all'].map(audience => (
                <label key={audience} className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.targetAudience.includes(audience)} onChange={() => handleAudienceChange(audience)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 capitalize">{audience}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

export default AnnouncementManagement;
