import { monitoringService } from '../utils/monitoring';
import { logger } from '../utils/logger';
export const suspiciousActivityCheck = async (req, res, next) => {
    try {
        const ip = req.ip;
        const path = req.path;
        const method = req.method;
        // Check for suspicious patterns
        const suspiciousPatterns = [
            /\.\.\//, // Directory traversal
            /<script>/, // XSS attempts
            /exec\(/, // Command injection
            /eval\(/, // Code injection
            /union\s+select/i, // SQL injection
        ];
        const userAgent = req.headers['user-agent'] || '';
        const body = JSON.stringify(req.body);
        // Check for suspicious patterns in request
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(path) ||
                pattern.test(userAgent) ||
                pattern.test(body)) {
                await monitoringService.trackSuspiciousActivity('suspicious_pattern', {
                    ip,
                    path,
                    method,
                    pattern: pattern.toString(),
                    userAgent,
                });
                return res.status(403).json({ error: 'Suspicious activity detected' });
            }
        }
        // Check for unusual request frequency
        const key = `request_frequency:${ip}`;
        const count = await monitoringService.getCount(key);
        if (count > 100) { // More than 100 requests per minute
            await monitoringService.trackSuspiciousActivity('high_frequency', {
                ip,
                count,
                path,
                method,
            });
            return res.status(429).json({ error: 'Too many requests' });
        }
        next();
    }
    catch (error) {
        logger.error('Error in suspicious activity check:', error);
        next();
    }
};
