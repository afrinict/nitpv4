import nodemailer from 'nodemailer';
import emailConfigs from '../config/email';
class EmailService {
    constructor() {
        this.transporters = new Map();
        this.initializeTransporters();
    }
    initializeTransporters() {
        // Initialize transporter for registration emails
        this.transporters.set('registration', nodemailer.createTransport({
            host: emailConfigs.registration.host,
            port: emailConfigs.registration.smtpPort,
            secure: true,
            auth: {
                user: emailConfigs.registration.username,
                pass: emailConfigs.registration.password
            }
        }));
        // Initialize transporter for admin emails
        this.transporters.set('admin', nodemailer.createTransport({
            host: emailConfigs.admin.host,
            port: emailConfigs.admin.smtpPort,
            secure: true,
            auth: {
                user: emailConfigs.admin.username,
                pass: emailConfigs.admin.password
            }
        }));
        // Initialize transporter for info emails
        this.transporters.set('info', nodemailer.createTransport({
            host: emailConfigs.info.host,
            port: emailConfigs.info.smtpPort,
            secure: true,
            auth: {
                user: emailConfigs.info.username,
                pass: emailConfigs.info.password
            }
        }));
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    async sendEmail(type, to, subject, html, attachments) {
        try {
            const transporter = this.transporters.get(type);
            if (!transporter) {
                throw new Error(`No transporter found for type: ${type}`);
            }
            const mailOptions = {
                from: emailConfigs[type].username,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                html,
                attachments
            };
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully: ${info.messageId}`);
            return info;
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
    // Helper methods for common email types
    async sendWelcomeEmail(to, name) {
        const subject = 'Welcome to NITP Abuja Chapter';
        const html = `
      <h1>Welcome to NITP Abuja Chapter, ${name}!</h1>
      <p>Thank you for joining our community. We're excited to have you on board.</p>
      <p>You can now access all member benefits and resources through your account.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>NITP Abuja Chapter Team</p>
    `;
        return this.sendEmail('registration', to, subject, html);
    }
    async sendApplicationStatusUpdate(to, applicationType, status) {
        const subject = `Your ${applicationType} Application Status Update`;
        const html = `
      <h1>Application Status Update</h1>
      <p>Dear Applicant,</p>
      <p>Your ${applicationType} application status has been updated to: <strong>${status}</strong></p>
      <p>You can log in to your account to view more details.</p>
      <p>Best regards,<br>NITP Abuja Chapter Team</p>
    `;
        return this.sendEmail('admin', to, subject, html);
    }
    async sendNewsletter(to, subject, content) {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${subject}</h1>
        ${content}
        <p>Best regards,<br>NITP Abuja Chapter Team</p>
      </div>
    `;
        return this.sendEmail('info', to, subject, html);
    }
}
export default EmailService;
