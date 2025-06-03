import axios from 'axios';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { monitoringService } from '../utils/monitoring';
class GeolocationService {
    constructor() {
        this.CACHE_TTL = 3600; // 1 hour in seconds
    }
    static getInstance() {
        if (!GeolocationService.instance) {
            GeolocationService.instance = new GeolocationService();
        }
        return GeolocationService.instance;
    }
    async getLocationData(ip) {
        try {
            // Check cache first
            const cachedData = await redisClient.get(`geo:${ip}`);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            // Fetch from API
            const response = await axios.get(`https://ipapi.co/${ip}/json/`);
            const data = {
                country: response.data.country_name,
                region: response.data.region,
                city: response.data.city,
                isp: response.data.org,
                isProxy: response.data.proxy || false,
                isVpn: response.data.vpn || false,
            };
            // Cache the result
            await redisClient.set(`geo:${ip}`, JSON.stringify(data), 'EX', this.CACHE_TTL);
            return data;
        }
        catch (error) {
            logger.error('Error fetching geolocation data:', error);
            return null;
        }
    }
    async isBlockedIP(ip) {
        try {
            const locationData = await this.getLocationData(ip);
            if (!locationData)
                return false;
            // Check if IP is from a blocked country
            const blockedCountries = await this.getBlockedCountries();
            if (blockedCountries.includes(locationData.country)) {
                await monitoringService.trackSuspiciousActivity(ip, `Blocked country: ${locationData.country}`);
                return true;
            }
            // Check if IP is using a proxy/VPN
            if (locationData.isProxy || locationData.isVpn) {
                await monitoringService.trackSuspiciousActivity(ip, 'Proxy/VPN detected');
                return true;
            }
            return false;
        }
        catch (error) {
            logger.error('Error checking blocked IP:', error);
            return false;
        }
    }
    async getBlockedCountries() {
        const blockedCountries = await redisClient.get('blocked_countries');
        return blockedCountries ? JSON.parse(blockedCountries) : [];
    }
    async addBlockedCountry(country) {
        const blockedCountries = await this.getBlockedCountries();
        if (!blockedCountries.includes(country)) {
            blockedCountries.push(country);
            await redisClient.set('blocked_countries', JSON.stringify(blockedCountries));
        }
    }
    async removeBlockedCountry(country) {
        const blockedCountries = await this.getBlockedCountries();
        const updatedCountries = blockedCountries.filter(c => c !== country);
        await redisClient.set('blocked_countries', JSON.stringify(updatedCountries));
    }
}
export const geolocationService = GeolocationService.getInstance();
