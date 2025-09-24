import axios from 'axios';
import API_ENDPOINTS from '../config/api.js';

class ParentService {
  // Get all parents with filtering and pagination
  async getParents(params = {}) {
    try {
      const response = await axios.get(API_ENDPOINTS.parents.base, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get parent by ID
  async getParentById(id) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.parents.base}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new parent
  async createParent(parentData) {
    try {
      const response = await axios.post(API_ENDPOINTS.parents.base, parentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update parent
  async updateParent(id, parentData) {
    try {
      const response = await axios.put(`${API_ENDPOINTS.parents.base}/${id}`, parentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete parent
  async deleteParent(id) {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.parents.base}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Link child to parent
  async linkChild(parentId, childData) {
    try {
      const response = await axios.post(`${API_ENDPOINTS.parents.base}/${parentId}/link-child`, childData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unlink child from parent
  async unlinkChild(parentId, studentId) {
    try {
      const response = await axios.delete(API_ENDPOINTS.parents.unlinkChild(parentId, studentId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get children progress for parent
  async getChildrenProgress(parentId) {
    try {
      const response = await axios.get(API_ENDPOINTS.parents.childrenProgress(parentId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update parent preferences
  async updatePreferences(parentId, preferences) {
    try {
      const response = await axios.put(API_ENDPOINTS.parents.preferences(parentId), preferences);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data.errors || []
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export default new ParentService();