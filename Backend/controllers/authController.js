import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 SIGNUP
export const signup = async (req, res) => {
  try {
    console.log("[signup] incoming body:", req.body);
    console.log("[signup] headers:", { origin: req.headers.origin, host: req.headers.host, 'user-agent': req.headers['user-agent'] });
    const { name, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const exists = await User.findOne({ email });

    // If user exists and already has a password, reject
    if (exists && exists.password) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If user exists but has no password (e.g. created via Google), set password and update name
    if (exists && !exists.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      exists.password = hashedPassword;
      if (name) exists.name = name;
      await exists.save();

      const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({ token, user: exists });
    }

    // New user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user });

  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

// 🔓 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

// 🔵 GOOGLE LOGIN (already working)
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, picture, sub } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: sub,
      avatar: picture,
      hrConfidence: 0,
      hrAttempts: 0
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};

// --------------------
// RESET PASSWORD (OTP)
// --------------------
function generateOtp() {
  // 6-digit zero-padded numeric OTP
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(to, otp) {
  // Use SMTP config from env; if not present, fallback to console.log
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `no-reply@${process.env.DOMAIN || 'localhost'}`;
  // If SMTP not configured, create a test account (Ethereal) so developer can preview email
  let transporter;
  let isTestAccount = false;

  if (!host || !port || !user || !pass) {
    console.warn("SMTP not configured — creating Ethereal test account for preview emails");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    isTestAccount = true;
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: "Password reset instructions and your one-time code",
    text: `Hello,\n\nWe received a request to reset the password for the account associated with this email address.\n\nYour one-time password (OTP): ${otp}\n\nThis code expires in 15 minutes. If you didn't request this, ignore this email or contact support.\n\nThanks,\nThe Team`,
    html: `
      <div style="background:#f6f8fb;padding:30px;font-family:Helvetica,Arial,sans-serif;color:#222;">
        <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(17,24,39,0.08);">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #f0f2f5;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:48px;height:48px;background:#0b5ed7;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;">A</div>
                <div>
                  <div style="font-size:16px;color:#0b5ed7;font-weight:700;">PrepZone</div>
                  <div style="font-size:12px;color:#7b859a;margin-top:2px;">Security notification</div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 12px 0;color:#111;font-size:20px;">Password reset request</h2>
              <p style="margin:0 0 18px 0;color:#374151;">We received a request to reset the password for the account associated with this email address. Use the code below to continue—it's valid for only 1 minute.</p>

              <div style="text-align:center;margin:22px 0;">
                <div style="display:inline-block;background:linear-gradient(180deg,#fff,#fbfdff);padding:18px 26px;border-radius:10px;border:1px solid #eef2ff;box-shadow:0 4px 12px rgba(11,94,215,0.06);">
                  <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">Your one-time code</div>
                  <div style="font-family: 'Courier New', Courier, monospace; font-size:36px; letter-spacing:6px; font-weight:700; color:#0b5ed7;">${otp}</div>
                </div>
              </div>
              <p style="margin:22px 0 0 0;color:#6b7280;font-size:13px;">If you didn't request a password reset, you can safely ignore this email — your account is still protected. If you think someone else is attempting to access your account, contact our support team.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#fbfdff;border-top:1px solid #f0f2f5;font-size:12px;color:#94a3b8;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>© ${new Date().getFullYear()} PrepZone Need help? </div>
                <div><a href="mailto:prepzoneassistance@gmail.com" style="color:#0b5ed7;text-decoration:none;">prepzoneassistance@gmail.com</a></div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  console.log("OTP email sent:", info.messageId);
  if (isTestAccount) {
    // Preview URL for Ethereal
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}

export const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const ttlMs = Number(process.env.RESET_OTP_TTL_MS) || 60 * 1000; // default 1 minute for tests; override with env var
    const expires = new Date(Date.now() + ttlMs);

    user.resetOtp = otp;
    user.resetOtpExpires = expires;
    await user.save();

    const previewUrl = await sendOtpEmail(email, otp);

    // If previewUrl exists, include it in the response for developer convenience
    return res.json({ message: "OTP sent", previewUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const completeResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const expiresDate = new Date(user.resetOtpExpires);
    if (isNaN(expiresDate.getTime()) || Date.now() > expiresDate.getTime()) {
      console.warn(`[reset] OTP expired for ${email}. storedExpires=${user.resetOtpExpires}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

export const verifyResetPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const expiresDate2 = new Date(user.resetOtpExpires);
    if (isNaN(expiresDate2.getTime()) || Date.now() > expiresDate2.getTime()) {
      console.warn(`[verify] OTP expired for ${email}. storedExpires=${user.resetOtpExpires}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    return res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};
