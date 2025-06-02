import dotenv from 'dotenv';
dotenv.config();

interface EmailConfig {
  username: string;
  password: string;
  host: string;
  imapPort: number;
  smtpPort: number;
  useTLS: boolean;
  useSSL: boolean;
}

interface EmailConfigs {
  registration: EmailConfig;
  admin: EmailConfig;
  info: EmailConfig;
}

const emailConfigs: EmailConfigs = {
  registration: {
    username: process.env.REGISTRATION_EMAIL_USERNAME || '',
    password: process.env.REGISTRATION_EMAIL_PASSWORD || '',
    host: process.env.REGISTRATION_EMAIL_HOST || '',
    imapPort: parseInt(process.env.REGISTRATION_EMAIL_IMAP_PORT || '993'),
    smtpPort: parseInt(process.env.REGISTRATION_EMAIL_SMTP_PORT || '465'),
    useTLS: true,
    useSSL: true
  },
  admin: {
    username: process.env.ADMIN_EMAIL_USERNAME || '',
    password: process.env.ADMIN_EMAIL_PASSWORD || '',
    host: process.env.ADMIN_EMAIL_HOST || '',
    imapPort: parseInt(process.env.ADMIN_EMAIL_IMAP_PORT || '993'),
    smtpPort: parseInt(process.env.ADMIN_EMAIL_SMTP_PORT || '465'),
    useTLS: true,
    useSSL: true
  },
  info: {
    username: process.env.INFO_EMAIL_USERNAME || '',
    password: process.env.INFO_EMAIL_PASSWORD || '',
    host: process.env.INFO_EMAIL_HOST || '',
    imapPort: parseInt(process.env.INFO_EMAIL_IMAP_PORT || '993'),
    smtpPort: parseInt(process.env.INFO_EMAIL_SMTP_PORT || '465'),
    useTLS: true,
    useSSL: true
  }
};

export default emailConfigs; 