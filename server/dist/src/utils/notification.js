import nodemailer from 'nodemailer';
// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// Send email
export async function sendEmail({ to, subject, text, html }) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html
        });
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
// Send SMS (placeholder - integrate with SMS service provider)
export async function sendSMS({ to, message }) {
    // In production, integrate with an SMS service provider
    console.log(`SMS to ${to}: ${message}`);
}
