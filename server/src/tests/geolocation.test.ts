import { geolocationService } from '../services/geolocationService';
import { redisClient } from '../config/redis';
import axios from 'axios';

jest.mock('axios');
jest.mock('../config/redis');

describe('GeolocationService', () => {
  const mockIP = '192.168.1.1';
  const mockLocationData = {
    country: 'United States',
    region: 'California',
    city: 'San Francisco',
    isp: 'Test ISP',
    isProxy: false,
    isVpn: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocationData', () => {
    it('should return cached data if available', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockLocationData));

      const result = await geolocationService.getLocationData(mockIP);

      expect(result).toEqual(mockLocationData);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should fetch and cache new data if not cached', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockLocationData });

      const result = await geolocationService.getLocationData(mockIP);

      expect(result).toEqual(mockLocationData);
      expect(redisClient.set).toHaveBeenCalledWith(
        `geo:${mockIP}`,
        JSON.stringify(mockLocationData),
        'EX',
        3600
      );
    });

    it('should handle API errors gracefully', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await geolocationService.getLocationData(mockIP);

      expect(result).toBeNull();
    });
  });

  describe('isBlockedIP', () => {
    it('should block IPs from blocked countries', async () => {
      (redisClient.get as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockLocationData))
        .mockResolvedValueOnce(JSON.stringify(['United States']));

      const result = await geolocationService.isBlockedIP(mockIP);

      expect(result).toBe(true);
    });

    it('should block IPs using proxy/VPN', async () => {
      const proxyData = { ...mockLocationData, isProxy: true };
      (redisClient.get as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(proxyData))
        .mockResolvedValueOnce(JSON.stringify([]));

      const result = await geolocationService.isBlockedIP(mockIP);

      expect(result).toBe(true);
    });

    it('should allow non-blocked IPs', async () => {
      (redisClient.get as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockLocationData))
        .mockResolvedValueOnce(JSON.stringify([]));

      const result = await geolocationService.isBlockedIP(mockIP);

      expect(result).toBe(false);
    });
  });

  describe('blocked countries management', () => {
    it('should add a country to blocked list', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify([]));

      await geolocationService.addBlockedCountry('Test Country');

      expect(redisClient.set).toHaveBeenCalledWith(
        'blocked_countries',
        JSON.stringify(['Test Country'])
      );
    });

    it('should remove a country from blocked list', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(['Test Country']));

      await geolocationService.removeBlockedCountry('Test Country');

      expect(redisClient.set).toHaveBeenCalledWith(
        'blocked_countries',
        JSON.stringify([])
      );
    });
  });
}); 