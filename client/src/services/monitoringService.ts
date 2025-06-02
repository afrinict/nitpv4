import axios from 'axios';

interface VerificationStats {
  failedAttempts: {
    email: number;
    phone: number;
  };
  suspiciousIPs: number;
  rateLimitExceeded: number;
}

interface Alert {
  type: string;
  timestamp: string;
  data: any;
}

interface TimeSeriesData {
  timestamp: string;
  email: number;
  phone: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  async getVerificationStats(): Promise<VerificationStats> {
    try {
      const response = await axios.get(`${this.API_URL}/api/monitoring/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw error;
    }
  }

  async getAlerts(timeRange: '1h' | '24h' | '7d'): Promise<Alert[]> {
    try {
      const response = await axios.get(`${this.API_URL}/api/monitoring/alerts`, {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  async getTimeSeriesData(timeRange: '1h' | '24h' | '7d'): Promise<TimeSeriesData[]> {
    try {
      const response = await axios.get(`${this.API_URL}/api/monitoring/timeseries`, {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching time series data:', error);
      throw error;
    }
  }

  async getBlockedCountries(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.API_URL}/api/monitoring/blocked-countries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blocked countries:', error);
      throw error;
    }
  }

  async addBlockedCountry(country: string): Promise<void> {
    try {
      await axios.post(`${this.API_URL}/api/monitoring/blocked-countries`, { country });
    } catch (error) {
      console.error('Error adding blocked country:', error);
      throw error;
    }
  }

  async removeBlockedCountry(country: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/api/monitoring/blocked-countries/${country}`);
    } catch (error) {
      console.error('Error removing blocked country:', error);
      throw error;
    }
  }
}

export const monitoringService = MonitoringService.getInstance(); 