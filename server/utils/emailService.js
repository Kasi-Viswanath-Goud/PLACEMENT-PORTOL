const nodemailer = require('nodemailer');

/**
 * Creates and returns a configured Nodemailer transporter.
 * If SMTP credentials are provided in .env, it uses those.
 * Otherwise, it creates a temporary Ethereal test account on the fly.
 */
async function getTransporter() {
  // If user provided real SMTP credentials
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal testing account
  console.log('No SMTP credentials found in .env. Creating an Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Sends an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML format
 */
async function sendEmail(to, subject, html) {
  try {
    const transporter = await getTransporter();
    
    // Fallback sender if not specified in env
    const senderEmail = process.env.SMTP_USER || '"ALTS Placement Portal" <no-reply@altsplacement.com>';

    const info = await transporter.sendMail({
      from: senderEmail,
      to,
      subject,
      html,
    });

    console.log('\n\n========== 📧 EMAIL SENT SUCCESSFULLY ==========');
    console.log('Message ID: %s', info.messageId);
    
    // If using Ethereal, we can log the URL to preview the email
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    console.log('=================================================\n\n');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

module.exports = { sendEmail };
