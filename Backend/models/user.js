import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  googleId: String,
  avatar: String,
  // Password reset OTP and expiry
  resetOtp: String,
  resetOtpExpires: Date,
  // HR confidence score (0-100). Default 0 for new users.
  hrConfidence: { type: Number, default: 0 },
  // Number of HR attempts recorded; default 0 for new users
  hrAttempts: { type: Number, default: 0 },
  // Persisted scores (0-100). Nullable until set.
  atsScore: { type: Number, default: 0 },
  aptitudeScore: { type: Number, default: 0 },
  // Group Discussion / GD score
  gdScore: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
