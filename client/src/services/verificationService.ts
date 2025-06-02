import axios from 'axios';

interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

class VerificationService {
  private static instance: VerificationService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  // Send OTP to email
  async sendEmailOTP(email: string): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/verification/email-otp`, { email });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send email OTP',
      };
    }
  }

  // Send OTP to phone
  async sendPhoneOTP(phone: string): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/verification/phone-otp`, { phone });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send phone OTP',
      };
    }
  }

  // Send WhatsApp message
  async sendWhatsAppMessage(phone: string, message: string): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/verification/whatsapp`, {
        phone,
        message,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send WhatsApp message',
      };
    }
  }

  // Verify email OTP
  async verifyEmailOTP(email: string, otp: string): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/verification/verify-email-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify email OTP',
      };
    }
  }

  // Verify phone OTP
  async verifyPhoneOTP(phone: string, otp: string): Promise<VerificationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/verification/verify-phone-otp`, {
        phone,
        otp,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify phone OTP',
      };
    }
  }
}

export default VerificationService; 