# Backend — SMTP / OTP setup

Quick steps to enable password-reset OTP emails:

- Copy `.env.example` to `.env` in the `Backend` folder and fill the values.
- Restart the backend after updating `.env` so environment changes take effect.

SMTP examples:

- Gmail (recommended: use App Password):

  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_USER=youremail@gmail.com
  SMTP_PASS=<your_app_password>
  SMTP_FROM="Your App <youremail@gmail.com>"

  Notes: enable 2FA on the account and create an App Password for SMTP. Do not use your regular password.

- Generic SMTP provider (replace with your provider details):

  SMTP_HOST=smtp.mailprovider.com
  SMTP_PORT=465
  SMTP_USER=your_smtp_user
  SMTP_PASS=your_smtp_pass
  SMTP_FROM="Your App <no-reply@yourdomain.com>"

Ethereal (development fallback):

- If `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are not provided, the backend will automatically
  create a temporary Ethereal test account and send the email there. The server will log a
  `Preview URL` to the console — open that URL in your browser to view the email and OTP.

How to run the backend (example):

```powershell
cd Backend
npm install
node server.js
```

When you trigger a password-reset request in the app, watch the backend console for either:

- "OTP email sent: <messageId>" (for real SMTP), or
- "Preview URL: <url>" (Ethereal test account) — open the URL to view the email and OTP.
