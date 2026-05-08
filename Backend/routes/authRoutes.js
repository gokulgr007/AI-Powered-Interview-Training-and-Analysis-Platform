import express from "express";
import { signup, login, googleLogin, requestResetPassword, completeResetPassword, verifyResetPassword } from "../controllers/authController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

router.post("/reset-password/request", requestResetPassword);
router.post("/reset-password/complete", completeResetPassword);
router.post("/reset-password/verify", verifyResetPassword);

// GET /api/auth/me - return current user (requires Authorization: Bearer <token>)
router.get("/me", protect, (req, res) => {
	if (!req.user) return res.status(404).json({ message: "User not found" });
	return res.json(req.user);
});

export default router;
