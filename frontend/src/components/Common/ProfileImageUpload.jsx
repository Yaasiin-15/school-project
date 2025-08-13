import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

const ProfileImageUpload = ({ 
  currentImage, 
  onImageUpload, 
  onImageDelete, 
  isLoading = false,
  size = 'large', // 'small', 'medium', 'large'
  placeholder = 'Upload your photo'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    if (onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDeleteImage = () => {
    setPreviewImage(null);
    if (onImageDelete) {
      onImageDelete();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image Display Area */}
      <div
        className={`${sizeClasses[size]} relative rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 cursor-pointer group ${
          dragOver ? 'border-blue-400 bg-blue-50' : ''
        } ${isLoading ? 'opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {previewImage ? (
          <>
            <img
              src={previewImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
            <User className={`${size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-12 h-12' : 'w-16 h-16'}`} />
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Delete button */}
        {previewImage && !isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {previewImage ? 'Click to change your photo' : placeholder}
        </p>
        <p className="text-xs text-gray-500">
          Drag & drop or click to browse your files
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Upload your actual photo - JPEG, PNG, GIF, WebP (Max 5MB)
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={openFileDialog}
        disabled={isLoading}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>{previewImage ? 'Change Photo' : 'Upload Your Photo'}</span>
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;