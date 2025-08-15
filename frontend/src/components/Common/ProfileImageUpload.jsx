import React, { useState } from 'react';
import { Upload, X, User, Camera } from 'lucide-react';

const ProfileImageUpload = ({ 
  currentImage, 
  onImageUpload, 
  onImageDelete, 
  isLoading = false, 
  size = 'medium',
  placeholder = 'Upload image'
}) => {
  const [dragActive, setDragActive] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image Display */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200`}>
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {!isLoading && onImageDelete && (
              <button
                onClick={onImageDelete}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Delete image"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User className={`${size === 'large' ? 'w-12 h-12' : size === 'medium' ? 'w-8 h-8' : 'w-6 h-6'}`} />
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <Camera className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-600">{placeholder}</p>
          <p className="text-xs text-gray-500">Drag and drop or click to select</p>
          
          <label className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4 inline mr-2" />
            Choose File
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Supported formats: JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  );
};

export default ProfileImageUpload;