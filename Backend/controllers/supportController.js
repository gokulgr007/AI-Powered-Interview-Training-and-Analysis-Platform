import nodemailer from 'nodemailer';

// POST /api/support/bug
export const sendBugReport = async (req, res) => {
  try {
    const { summary = '', description = '', userEmail = '', userName = '' } = req.body || {};

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = process.env.SMTP_PORT || 587;
    // if SMTP_SECURE not explicitly set, treat port 465 as secure
    const smtpSecure = typeof process.env.SMTP_SECURE !== 'undefined'
      ? process.env.SMTP_SECURE === 'true'
      : Number(smtpPort) === 465;

    let transporter;
    let usingTestAccount = false;
    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
      });
    } else {
      // fallback to Ethereal test account for local development
      usingTestAccount = true;
      const testAcc = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAcc.user, pass: testAcc.pass }
      });
      console.warn('SMTP not configured; using Ethereal test account for sending. Preview URL will be returned.');
    }

    const toAddress = process.env.SUPPORT_EMAIL || 'kailasgrtvm@gmail.com';
    const fromAddress = process.env.SMTP_FROM || smtpUser;

    const parts = [];
    parts.push(`Reporter: ${userName || 'anonymous'} ${userEmail ? `<${userEmail}>` : ''}`);
    parts.push(`IP: ${req.ip}`);
    parts.push(`User-Agent: ${req.headers['user-agent'] || ''}`);
    parts.push('---');
    parts.push(description || '(no description)');

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      subject: `[Bug report] ${summary || '(no summary)'}${userName ? ` — ${userName}` : ''}`,
      text: parts.join('\n'),
      html: `<pre style="white-space:pre-wrap">${parts.map(p => escapeHtml(p)).join('\n')}</pre>`,
      attachments: []
    };

    if (req.file && req.file.buffer) {
      mailOptions.attachments.push({
        filename: req.file.originalname || 'screenshot.png',
        content: req.file.buffer
      });
    }

    const info = await transporter.sendMail(mailOptions);
    const result = { message: 'Bug report submitted' };
    if (usingTestAccount) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) result.previewUrl = preview;
    }
    return res.json(result);
  } catch (err) {
    console.error('Failed to send bug report', err);
    return res.status(500).json({ message: 'Failed to submit bug report' });
  }
};

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default { sendBugReport };
