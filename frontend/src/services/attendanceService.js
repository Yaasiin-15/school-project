import axiosInstance from "../config/axios.js";
import API_ENDPOINTS from "../config/api.js";

class AttendanceService {
  // Get attendance records with filtering
  async getAttendance(params = {}) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.attendance.base, {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark attendance for single student
  async markAttendance(attendanceData) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.attendance.mark,
        attendanceData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk attendance marking
  async bulkMarkAttendance(bulkData) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.attendance.bulkMark,
        bulkData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get class attendance summary
  async getClassSummary(classId, date) {
    try {
      const params = date ? { date } : {};
      const response = await axiosInstance.get(
        API_ENDPOINTS.attendance.classSummary(classId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student attendance analytics
  async getStudentAnalytics(studentId, params = {}) {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.attendance.studentAnalytics(studentId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate attendance reports
  async generateReports(params = {}) {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.attendance.reports,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get attendance defaulters
  async getDefaulters(params = {}) {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.attendance.defaulters,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Send notifications to parents
  async notifyParents(notificationData) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.attendance.notifyParents,
        notificationData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update attendance record
  async updateAttendance(id, attendanceData) {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.attendance.base}/${id}`,
        attendanceData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete attendance record
  async deleteAttendance(id) {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.attendance.base}/${id}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get attendance statistics for dashboard
  async getAttendanceStats(params = {}) {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.attendance.base}/stats`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || "An error occurred",
        status: error.response.status,
        errors: error.response.data.errors || [],
      };
    } else if (error.request) {
      return {
        message: "Network error - please check your connection",
        status: 0,
      };
    } else {
      return {
        message: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }
}

export default new AttendanceService();
