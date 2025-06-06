import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useToast } from '@/hooks/useToast';
import PaymentModal from '@/components/shared/PaymentModal';

const EIARApplication = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // First, create the application
      const response = await fetch('/api/eiar/applications', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      // Show payment modal
      setShowPaymentModal(true);
    } catch (err: any) {
      setError(err.message);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Update application with payment information
      const response = await fetch('/api/eiar/applications/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          status: 'paid',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      showToast('success', 'Application submitted successfully');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handlePaymentError = (error: any) => {
    showToast('error', error.message || 'Payment failed');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        EIAR Application
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Your existing EIAR application form components */}
      
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={75000} // EIAR application fee
        title="EIAR Application Payment"
        description="Please complete the payment to submit your EIAR application"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </Box>
  );
};

export default EIARApplication; 