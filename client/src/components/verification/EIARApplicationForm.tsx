import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import FileUpload from '../shared/FileUpload';
import { useAuth } from '../../contexts/AuthContext';

interface EIARApplicationFormProps {
  onSubmit: (data: any) => void;
}

const EIARApplicationForm: React.FC<EIARApplicationFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    certificate: null as File | null,
    identification: null as File | null,
    additionalDocuments: [] as File[],
    comments: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (field: string) => (file: File | File[]) => {
    if (Array.isArray(file)) {
      setFormData(prev => ({
        ...prev,
        [field]: file[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleAdditionalFiles = (files: File | File[]) => {
    if (Array.isArray(files)) {
      setFormData(prev => ({
        ...prev,
        additionalFiles: files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        additionalFiles: [files]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.certificate) {
      newErrors.certificate = 'Certificate is required';
    }
    if (!formData.identification) {
      newErrors.identification = 'Identification document is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('certificate', formData.certificate!);
    formDataToSubmit.append('identification', formData.identification!);
    formData.additionalDocuments.forEach((file, index) => {
      formDataToSubmit.append(`additionalDocuments`, file);
    });
    formDataToSubmit.append('comments', formData.comments);

    onSubmit(formDataToSubmit);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        EIAR Application Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Certificate
            </Typography>
            <FileUpload
              onFileSelect={handleFileSelect('certificate')}
              accept="application/pdf"
              maxSize={10}
              label="Upload Certificate"
              error={errors.certificate}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Identification Document
            </Typography>
            <FileUpload
              onFileSelect={handleFileSelect('identification')}
              accept="image/*,application/pdf"
              maxSize={5}
              label="Upload ID"
              error={errors.identification}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Additional Documents (Optional)
            </Typography>
            <FileUpload
              onFileSelect={handleAdditionalFiles}
              accept="image/*,application/pdf"
              maxSize={5}
              label="Upload Additional Documents"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Comments"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Submit Application
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EIARApplicationForm; 