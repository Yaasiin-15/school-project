import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassListExport = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/api/classes');
            setClasses(response.data.data.classes || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const exportClassList = async (classId, format = 'csv') => {
        try {
            setLoading(true);

            const response = await axios.get(`/api/classes/${classId}/export?format=${format}`, {
                responseType: format === 'csv' ? 'blob' : 'json'
            });

            if (format === 'csv') {
                // Handle CSV download
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const selectedClassData = classes.find(c => c._id === classId);
                const filename = `${selectedClassData?.name || 'class'}-students-${new Date().toISOString().split('T')[0]}.csv`;
                link.setAttribute('download', filename);

                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                alert('Class list exported successfully!');
            } else {
                // Handle JSON format - show preview
                console.log('Class data:', response.data);
                alert(`Class list exported! ${response.data.data.totalStudents} students found.`);
            }
        } catch (error) {
            console.error('Error exporting class list:', error);
            alert('Error exporting class list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const exportAllClasses = async (format = 'csv') => {
        try {
            setLoading(true);

            const response = await axios.get(`/api/classes/export/all?format=${format}`, {
                responseType: format === 'csv' ? 'blob' : 'json'
            });

            if (format === 'csv') {
                // Handle CSV download
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const filename = `all-classes-2024-25-${new Date().toISOString().split('T')[0]}.csv`;
                link.setAttribute('download', filename);

                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                alert('All classes exported successfully!');
            } else {
                // Handle JSON format - show preview
                console.log('All classes data:', response.data);
                alert(`All classes exported! ${response.data.data.totalClasses} classes with ${response.data.data.totalStudents} total students.`);
            }
        } catch (error) {
            console.error('Error exporting all classes:', error);
            alert('Error exporting all classes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const previewClassData = async (classId) => {
        try {
            const response = await axios.get(`/api/classes/${classId}/export?format=json`);
            const classData = response.data.data;

            const previewWindow = window.open('', '_blank', 'width=800,height=600');
            previewWindow.document.write(`
        <html>
          <head>
            <title>Class List Preview - ${classData.class.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { margin-bottom: 20px; }
              .stats { background-color: #f9f9f9; padding: 10px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Class List - ${classData.class.name}</h1>
              <div class="stats">
                <p><strong>Section:</strong> ${classData.class.section}</p>
                <p><strong>Grade:</strong> ${classData.class.grade}</p>
                <p><strong>Teacher:</strong> ${classData.class.teacherName || 'N/A'}</p>
                <p><strong>Room:</strong> ${classData.class.room || 'N/A'}</p>
                <p><strong>Total Students:</strong> ${classData.totalStudents}</p>
                <p><strong>Export Date:</strong> ${new Date(classData.exportDate).toLocaleString()}</p>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${classData.students.map(student => `
                  <tr>
                    <td>${student.studentId || ''}</td>
                    <td>${student.name || ''}</td>
                    <td>${student.rollNumber || ''}</td>
                    <td>${student.email || ''}</td>
                    <td>${student.phone || ''}</td>
                    <td>${student.status || 'active'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div style="margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer;">
                Print
              </button>
              <button onclick="window.close()" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; cursor: pointer; margin-left: 10px;">
                Close
              </button>
            </div>
          </body>
        </html>
      `);
            previewWindow.document.close();
        } catch (error) {
            console.error('Error previewing class data:', error);
            alert('Error previewing class data. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Class List Export</h2>
                <p className="text-gray-600 mb-4">
                    Export student lists for individual classes or all classes. Choose between CSV format for spreadsheets or JSON for data processing.
                </p>
            </div>

            {/* Export Individual Class */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Export Individual Class</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Class</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name} - {cls.section} (Grade {cls.grade})
                            </option>
                        ))}
                    </select>

                    <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="csv">CSV Format</option>
                        <option value="json">JSON Format</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={() => exportClassList(selectedClass, exportFormat)}
                            disabled={loading || !selectedClass}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                        >
                            {loading ? 'Exporting...' : 'Export'}
                        </button>

                        <button
                            onClick={() => previewClassData(selectedClass)}
                            disabled={loading || !selectedClass}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {selectedClass && (
                    <div className="text-sm text-gray-600">
                        <p>Selected class: <strong>{classes.find(c => c._id === selectedClass)?.name} - {classes.find(c => c._id === selectedClass)?.section}</strong></p>
                        <p>Students: <strong>{classes.find(c => c._id === selectedClass)?.studentCount || 0}</strong></p>
                    </div>
                )}
            </div>

            {/* Export All Classes */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Export All Classes</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="csv">CSV Format</option>
                        <option value="json">JSON Format</option>
                    </select>

                    <button
                        onClick={() => exportAllClasses(exportFormat)}
                        disabled={loading}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Exporting...' : 'Export All Classes'}
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Total classes: <strong>{classes.length}</strong></p>
                    <p>Total students: <strong>{classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0)}</strong></p>
                </div>
            </div>

            {/* Classes Overview */}
            <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Classes Overview</h3>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Section
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teacher
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Students
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((cls) => (
                            <tr key={cls._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {cls.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cls.section}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cls.grade}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cls.teacherName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cls.studentCount || 0} / {cls.capacity || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => exportClassList(cls._id, 'csv')}
                                            disabled={loading}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            CSV
                                        </button>
                                        <button
                                            onClick={() => previewClassData(cls._id)}
                                            disabled={loading}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {classes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No classes found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassListExport;