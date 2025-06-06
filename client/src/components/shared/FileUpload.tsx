import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export interface FileUploadProps {
  onFileSelect: (file: File | File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  required?: boolean;
  maxSize?: number; // in MB
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '*/*',
  multiple = false,
  label = 'Upload File',
  required = false,
  maxSize = 5,
  error
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFile(files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (multiple) {
      const fileArray = Array.from(files);
      onFileSelect(fileArray);
    } else {
      const file = files[0];
      if (file) {
        onFileSelect(file);
      }
    }
  };

  const handleFile = (files: FileList) => {
    const file = files[0];
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    onFileSelect(multiple ? Array.from(files) : file);
    setIsUploading(false);
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: error ? 'error.main' : isDragging ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        backgroundColor: isDragging ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          component="span"
          variant="contained"
          startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : label}
        </Button>
      </label>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Drag and drop a file here, or click to select
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Supported formats: {accept.split(',').join(', ')}
      </Typography>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload; 