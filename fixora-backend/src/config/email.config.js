const nodemailer = require('nodemailer');

// Create reusable transporter with improved configuration
const createTransporter = () => {
  // Skip email configuration if credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

const transporter = createTransporter();

// Verify email configuration only if transporter exists
if (transporter) {
  // Make verification non-blocking and with timeout
  const verifyEmail = async () => {
    try {
      await transporter.verify();
      console.log('✅ Email Service is ready');
    } catch (error) {
      console.error('❌ Email service configuration error:', error.message);
      console.warn('⚠️  Email functionality may not work properly. Please check your EMAIL_USER and EMAIL_PASSWORD environment variables.');
    }
  };
  
  // Run verification in background, don't block app startup
  verifyEmail();
}

module.exports = transporter;