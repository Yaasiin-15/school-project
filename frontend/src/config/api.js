const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com/api';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  
  // Students
  students: `${API_BASE_URL}/students`,
  
  // Teachers
  teachers: `${API_BASE_URL}/teachers`,
  
  // Classes
  classes: `${API_BASE_URL}/classes`,
  
  // Parents - New comprehensive endpoints
  parents: {
    base: `${API_BASE_URL}/parents`,
    linkChild: `${API_BASE_URL}/parents`,
    unlinkChild: (parentId, studentId) => `${API_BASE_URL}/parents/${parentId}/unlink-child/${studentId}`,
    childrenProgress: (parentId) => `${API_BASE_URL}/parents/${parentId}/children-progress`,
    preferences: (parentId) => `${API_BASE_URL}/parents/${parentId}/preferences`,
  },
  
  // Subjects - New comprehensive endpoints
  subjects: {
    base: `${API_BASE_URL}/subjects`,
    assignTeacher: (subjectId) => `${API_BASE_URL}/subjects/${subjectId}/assign-teacher`,
    removeTeacher: (subjectId, teacherId) => `${API_BASE_URL}/subjects/${subjectId}/remove-teacher/${teacherId}`,
    curriculum: (subjectId) => `${API_BASE_URL}/subjects/${subjectId}/curriculum`,
    byDepartment: (department) => `${API_BASE_URL}/subjects/department/${department}`,
    byGrade: (grade) => `${API_BASE_URL}/subjects/grade/${grade}`,
    mapping: `${API_BASE_URL}/subjects/mapping/teacher-subjects`,
  },
  
  // Library - New comprehensive endpoints
  library: {
    books: `${API_BASE_URL}/library/books`,
    issues: `${API_BASE_URL}/library/issues`,
    issue: `${API_BASE_URL}/library/issue`,
    return: (issueId) => `${API_BASE_URL}/library/return/${issueId}`,
    renew: (issueId) => `${API_BASE_URL}/library/renew/${issueId}`,
    overdue: `${API_BASE_URL}/library/overdue`,
    settings: `${API_BASE_URL}/library/settings`,
    statistics: `${API_BASE_URL}/library/statistics`,
  },
  
  // Transport - New comprehensive endpoints
  transport: {
    routes: `${API_BASE_URL}/transport/routes`,
    vehicles: `${API_BASE_URL}/transport/vehicles`,
    drivers: `${API_BASE_URL}/transport/drivers`,
    studentAssignments: `${API_BASE_URL}/transport/student-assignments`,
    assignStudent: `${API_BASE_URL}/transport/assign-student`,
    statistics: `${API_BASE_URL}/transport/statistics`,
  },
  
  // Enhanced Attendance
  attendance: {
    base: `${API_BASE_URL}/attendance`,
    mark: `${API_BASE_URL}/attendance/mark`,
    bulkMark: `${API_BASE_URL}/attendance/bulk-mark`,
    classSummary: (classId) => `${API_BASE_URL}/attendance/class-summary/${classId}`,
    studentAnalytics: (studentId) => `${API_BASE_URL}/attendance/student/${studentId}/analytics`,
    reports: `${API_BASE_URL}/attendance/reports`,
    defaulters: `${API_BASE_URL}/attendance/defaulters`,
    notifyParents: `${API_BASE_URL}/attendance/notify-parents`,
  },
  
  // Enhanced Timetable
  timetable: {
    base: `${API_BASE_URL}/timetable`,
    generate: `${API_BASE_URL}/timetable/generate`,
    class: (classId) => `${API_BASE_URL}/timetable/class/${classId}`,
    teacher: (teacherId) => `${API_BASE_URL}/timetable/teacher/${teacherId}`,
    checkConflicts: (timetableId) => `${API_BASE_URL}/timetable/${timetableId}/check-conflicts`,
    approve: (timetableId) => `${API_BASE_URL}/timetable/${timetableId}/approve`,
  },
  
  // Grades
  grades: `${API_BASE_URL}/grades`,
  
  // Fees
  fees: `${API_BASE_URL}/fees`,
  
  // Exams
  exams: `${API_BASE_URL}/exams`,
  
  // Announcements
  announcements: `${API_BASE_URL}/announcements`,
  
  // Dashboard
  dashboard: `${API_BASE_URL}/dashboard`,
};

export default API_ENDPOINTS;