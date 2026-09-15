const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

// Initialize Nodemailer generic SMTP transporter lazily
const getTransporter = () => {
  if (!transporter && env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Reusable email sending function.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email body
 * @param {string} [text] - Optional plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn(`⚠️ [EmailService] SMTP_USER or SMTP_PASS not configured in .env. Email to ${to} was not dispatched.`);
    return { success: false, reason: 'SMTP credentials missing in .env' };
  }

  try {
    const info = await mailer.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''), // fallback strip tags
      html,
    });

    console.log(`📧 [EmailService] Email delivered to ${to} via SMTP [${env.SMTP_HOST}:${env.SMTP_PORT}] (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [EmailService Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
};
