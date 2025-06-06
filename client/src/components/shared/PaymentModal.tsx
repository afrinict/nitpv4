import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import PaymentForm from './PaymentForm';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description?: string;
  currency?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  amount,
  title,
  description,
  currency = 'ngn',
  onSuccess,
  onError,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <PaymentForm
            amount={amount}
            currency={currency}
            onSuccess={(paymentIntent) => {
              onSuccess(paymentIntent);
              onClose();
            }}
            onError={onError}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal; 