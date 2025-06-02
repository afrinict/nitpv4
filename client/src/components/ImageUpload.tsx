import React, { useState, useCallback } from 'react';
import { uploadImage } from '../utils/imageUpload';

interface ImageUploadProps {
  onImageUploaded: (urls: string[]) => void;
  className?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  description?: string;
}

interface UploadProgress {
  [key: string]: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  className = '',
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  multiple = false,
  maxFiles = 5,
  label = 'Upload Images',
  description = 'Click to upload or drag and drop'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a valid file type`);
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${maxSize}MB limit`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return [];
    }

    if (validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return [];
    }

    return validFiles;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        setPreviews(prev => ({ ...prev, [file.name]: preview }));

        // Upload to Cloudinary
        const imageUrl = await uploadImage(file);
        setUploadedFiles(prev => [...prev, imageUrl]);
        return imageUrl;
      });

      const urls = await Promise.all(uploadPromises);
      onImageUploaded(urls);
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const removeFile = (fileName: string) => {
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) {
        input.files = files;
        handleFileChange({ target: { files } } as any);
      }
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {Object.keys(previews).length > 0 ? (
              <div className="grid grid-cols-2 gap-4 p-4">
                {Object.entries(previews).map(([fileName, preview]) => (
                  <div key={fileName} className="relative group">
                    <img
                      src={preview}
                      alt={fileName}
                      className="max-h-32 rounded-lg object-contain"
                    />
                    <button
                      onClick={() => removeFile(fileName)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {uploadProgress[fileName] && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[fileName]}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">{label}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {allowedTypes.join(', ').toUpperCase()} (MAX. {maxSize}MB)
                  {multiple && ` • Up to ${maxFiles} files`}
                </p>
              </>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            disabled={isUploading}
            multiple={multiple}
          />
        </label>
      </div>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Uploading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 