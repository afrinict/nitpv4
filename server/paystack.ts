import axios from 'axios';

// Paystack API URL
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// Initialize Paystack API client
const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

export interface PaymentInitiationResponse {
  success: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  error?: any;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    metadata: any;
    customer: {
      email: string;
      name?: string;
    };
  };
  error?: any;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data?: {
    transactions: any[];
    meta: {
      total: number;
      perPage: number;
      currentPage: number;
      totalPages: number;
    };
  };
  error?: any;
}

// Initialize payment
export async function initiatePayment(
  email: string,
  amount: number,
  reference: string,
  metadata: any
): Promise<PaymentInitiationResponse> {
  try {
    // Amount needs to be in kobo (multiply by 100)
    const amountInKobo = Math.round(amount * 100);
    
    const response = await paystackClient.post('/transaction/initialize', {
      email,
      amount: amountInKobo,
      reference,
      metadata,
      callback_url: `${process.env.APP_URL || 'http://localhost:5000'}/api/payments/verify`
    });
    
    return {
      success: true,
      message: 'Payment initiated successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('Paystack Payment Initiation Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message
    };
  }
}

// Verify payment
export async function verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    const data = response.data.data;
    
    return {
      success: true,
      message: 'Payment verified successfully',
      data: {
        status: data.status,
        reference: data.reference,
        amount: data.amount / 100, // Convert back to naira
        metadata: data.metadata,
        customer: {
          email: data.customer.email,
          name: data.customer.name
        }
      }
    };
  } catch (error: any) {
    console.error('Paystack Payment Verification Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message
    };
  }
}

// Get list of transactions
export async function getTransactions(perPage: number = 50, page: number = 1): Promise<TransactionListResponse> {
  try {
    const response = await paystackClient.get(`/transaction?perPage=${perPage}&page=${page}`);
    
    return {
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: response.data.data,
        meta: response.data.meta
      }
    };
  } catch (error: any) {
    console.error('Paystack Get Transactions Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.response?.data || error.message
    };
  }
}

// Generate a unique transaction reference
export function generateTransactionReference(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `NITP-${timestamp}-${random}`;
}
