import axios from 'axios';
import API_ENDPOINTS from '../config/api.js';

class SubjectService {
  // Get all subjects with filtering and pagination
  async getSubjects(params = {}) {
    try {
      const response = await axios.get(API_ENDPOINTS.subjects.base, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject by ID
  async getSubjectById(id) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new subject
  async createSubject(subjectData) {
    try {
      const response = await axios.post(API_ENDPOINTS.subjects.base, subjectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update subject
  async updateSubject(id, subjectData) {
    try {
      const response = await axios.put(`${API_ENDPOINTS.subjects.base}/${id}`, subjectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete subject
  async deleteSubject(id) {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.subjects.base}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Assign teacher to subject
  async assignTeacher(subjectId, teacherData) {
    try {
      const response = await axios.post(API_ENDPOINTS.subjects.assignTeacher(subjectId), teacherData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove teacher from subject
  async removeTeacher(subjectId, teacherId) {
    try {
      const response = await axios.delete(API_ENDPOINTS.subjects.removeTeacher(subjectId, teacherId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject curriculum
  async getSubjectCurriculum(subjectId) {
    try {
      const response = await axios.get(API_ENDPOINTS.subjects.curriculum(subjectId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update subject curriculum
  async updateSubjectCurriculum(subjectId, curriculumData) {
    try {
      const response = await axios.put(API_ENDPOINTS.subjects.curriculum(subjectId), curriculumData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subjects by department
  async getSubjectsByDepartment(department) {
    try {
      const response = await axios.get(API_ENDPOINTS.subjects.byDepartment(department));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subjects by grade level
  async getSubjectsByGrade(gradeLevel) {
    try {
      const response = await axios.get(API_ENDPOINTS.subjects.byGrade(gradeLevel));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject-teacher mapping
  async getSubjectTeacherMapping() {
    try {
      const response = await axios.get(API_ENDPOINTS.subjects.mapping);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search subjects
  async searchSubjects(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      const response = await axios.get(API_ENDPOINTS.subjects.base, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject statistics
  async getSubjectStatistics(subjectId) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${subjectId}/statistics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all departments
  async getDepartments() {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/departments`);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, return common departments
      return {
        success: true,
        data: [
          'Mathematics',
          'Science',
          'English',
          'Social Studies',
          'Arts',
          'Physical Education',
          'Computer Science',
          'Languages'
        ]
      };
    }
  }

  // Get grade levels
  async getGradeLevels() {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/grade-levels`);
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, return common grade levels
      return {
        success: true,
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      };
    }
  }

  // Validate subject code uniqueness
  async validateSubjectCode(code, excludeId = null) {
    try {
      const params = { code };
      if (excludeId) params.excludeId = excludeId;
      
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/validate-code`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject prerequisites
  async getSubjectPrerequisites(subjectId) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${subjectId}/prerequisites`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update subject prerequisites
  async updateSubjectPrerequisites(subjectId, prerequisites) {
    try {
      const response = await axios.put(`${API_ENDPOINTS.subjects.base}/${subjectId}/prerequisites`, {
        prerequisites
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject resources
  async getSubjectResources(subjectId) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${subjectId}/resources`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add subject resource
  async addSubjectResource(subjectId, resourceData) {
    try {
      const response = await axios.post(`${API_ENDPOINTS.subjects.base}/${subjectId}/resources`, resourceData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove subject resource
  async removeSubjectResource(subjectId, resourceId) {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.subjects.base}/${subjectId}/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate subject report
  async generateSubjectReport(subjectId, reportType = 'overview') {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${subjectId}/report`, {
        params: { type: reportType }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk import subjects
  async bulkImportSubjects(subjectsData) {
    try {
      const response = await axios.post(`${API_ENDPOINTS.subjects.base}/bulk-import`, {
        subjects: subjectsData
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export subjects
  async exportSubjects(format = 'csv', filters = {}) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subject workload analysis
  async getSubjectWorkloadAnalysis(subjectId) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.subjects.base}/${subjectId}/workload`);
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

export default new SubjectService();