import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye, Mail, User as UserIcon, Shield, Calendar } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/users`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data?.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Add User (Create)
  const handleAddUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        await fetchUsers();
        setShowAddModal(false);
      }
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  // Edit User (Update)
  const handleEditUser = async (id, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
      }
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setShowViewModal(false);
      }
    } catch (error) {} finally {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage system users and their roles</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

             {/* Users Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredUsers.map((user) => (
           <div key={user._id || user.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 border border-gray-200 hover:shadow-lg transition-shadow">
             {/* User Avatar and Info */}
             <div className="flex items-center gap-3">
               <div className="relative">
                 <img 
                   src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'} 
                   alt={user.name}
                   className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                   onError={(e) => {
                     e.target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150';
                   }}
                 />
                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                   user.isActive ? 'bg-green-500' : 'bg-red-500'
                 }`}></div>
               </div>
               <div className="flex-1">
                 <h3 className="font-semibold text-gray-900">{user.name}</h3>
                 <p className="text-sm text-gray-600">{user.email}</p>
                 <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                   user.role === 'admin' ? 'bg-red-100 text-red-800' :
                   user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                   user.role === 'student' ? 'bg-green-100 text-green-800' :
                   user.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                   'bg-yellow-100 text-yellow-800'
                 }`}>
                   {user.role}
                 </span>
               </div>
             </div>
             
             {/* Action Buttons */}
             <div className="flex gap-2 pt-2 border-t border-gray-100">
               <button 
                 onClick={() => { setSelectedUser(user); setShowViewModal(true); }} 
                 className="flex-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded text-sm flex items-center justify-center gap-1 transition-colors"
               >
                 <Eye className="w-4 h-4" />
                 View
               </button>
               <button 
                 onClick={() => { setEditUser(user); setShowEditModal(true); }} 
                 className="flex-1 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 px-2 py-1 rounded text-sm flex items-center justify-center gap-1 transition-colors"
               >
                 <Edit className="w-4 h-4" />
                 Edit
               </button>
               <button 
                 onClick={() => { if(window.confirm('Are you sure you want to delete this user?')) handleDeleteUser(user._id || user.id); }} 
                 className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 px-2 py-1 rounded text-sm flex items-center justify-center gap-1 transition-colors"
               >
                 <Trash2 className="w-4 h-4" />
                 Delete
               </button>
             </div>
           </div>
         ))}
       </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <ViewUserModal 
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <EditUserModal 
          user={editUser}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
};

const AddUserModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    avatar: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Add User</h2>
        
        {/* Avatar Preview */}
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={formData.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'} 
            alt="Avatar preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150';
            }}
          />
          <input 
            type="url" 
            name="avatar" 
            placeholder="Avatar URL (optional)"
            value={formData.avatar} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Add</button>
        </div>
      </form>
    </div>
  );
};

const ViewUserModal = ({ user, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'} 
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150';
          }}
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
            user.role === 'admin' ? 'bg-red-100 text-red-800' :
            user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
            user.role === 'student' ? 'bg-green-100 text-green-800' :
            user.role === 'parent' ? 'bg-purple-100 text-purple-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {user.role}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span><strong>Email:</strong> {user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span><strong>Status:</strong> 
            <span className={`ml-1 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>
        {user.lastLogin && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Close</button>
      </div>
    </div>
  </div>
);

const EditUserModal = ({ user, onClose, onEdit }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(user._id || user.id, formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Edit User</h2>
        
        {/* Avatar Preview */}
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={formData.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'} 
            alt="Avatar preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150';
            }}
          />
          <input 
            type="url" 
            name="avatar" 
            placeholder="Avatar URL (optional)"
            value={formData.avatar || ''} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save</button>
        </div>
      </form>
    </div>
  );
};

export default UserManagement; 