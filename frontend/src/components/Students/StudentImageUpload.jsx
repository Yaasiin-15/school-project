import React, { useState } from 'react';
import { Camera, Upload, User } from 'lucide-react';

const StudentImageUpload = ({ studentId, currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch(`${API_URL}/api/upload/student/${studentId}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewImage(data.data.imageUrl);
        if (onImageUpdate) {
          onImageUpdate(data.data.imageUrl);
        }
        alert('Profile image updated successfully!');
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      handleImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 group cursor-pointer">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Student Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User className="w-12 h-12" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>

      <button
        onClick={() => document.querySelector(`input[type="file"]`).click()}
        disabled={uploading}
        className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
      </button>
    </div>
  );
};

export default StudentImageUpload;