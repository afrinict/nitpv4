import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useToast } from '@/hooks/useToast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paymentIntentId = searchParams.get('payment_intent');
      const clientSecret = searchParams.get('payment_intent_client_secret');

      if (!paymentIntentId || !clientSecret) {
        setError('Invalid payment confirmation');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            clientSecret,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to confirm payment');
        }

        showToast('success', 'Payment confirmed successfully');
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message);
        showToast('error', err.message);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [location.search, navigate, showToast]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Confirming your payment...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return null;
};

export default PaymentSuccess; 