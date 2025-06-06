import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useToast } from '@/hooks/useToast';
import PaymentModal from '@/components/shared/PaymentModal';

const MembershipRenewal = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleRenewal = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create renewal record
      const response = await fetch('/api/membership/renewal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate renewal');
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
      // Update renewal with payment information
      const response = await fetch('/api/membership/renewal/payment', {
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

      showToast('success', 'Membership renewed successfully');
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
        Membership Renewal
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Renewal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Annual Fee:</strong> ₦25,000.00
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Duration:</strong> 1 Year
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        onClick={handleRenewal}
        disabled={loading}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Renew Membership'
        )}
      </Button>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={25000} // Annual membership fee
        title="Membership Renewal Payment"
        description="Please complete the payment to renew your membership"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </Box>
  );
};

export default MembershipRenewal; 