import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  GraduationCap, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Chrome,
  KeyRound,
  RefreshCcw } from "lucide-react";
import { insertUserSchema, loginSchema } from "../lib/validations";
import { useLogin, useRegister, useUser } from "../hooks/use-auth";
import { AuthLayout } from "../components/auth/AuthLayout";
import { StepIndicator } from "../components/auth/StepIndicator";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { toast as hotToast } from "react-hot-toast";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";
import { GoogleLogin } from "@react-oauth/google";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { z } from "zod";

// Separate types for cleaner code



export default function AuthPage({ closeModal, onGoogleSuccess }) {
  const [mode, setMode] = useState("login");
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useUser();

  // Redirect if already logged in (do navigation in effect to avoid setState during render)
  useEffect(() => {
    if (!isUserLoading && user) {
      setLocation("/");
    }
  }, [isUserLoading, user, setLocation]);

  return mode === "login" ? (
    <LoginPage
      onSwitch={() => {
        try { console.debug("AuthPage: switching to signup"); } catch {};
        setMode("signup");
      }}
      closeModal={closeModal}
      setWouterLocation={setLocation}
    />
  ) : (
    <SignupPage
      onSwitch={() => {
        try { console.debug("AuthPage: switching to login"); } catch {};
        setMode("login");
      }}
      closeModal={closeModal}
      setWouterLocation={setLocation}
    />
  );
}

function LoginPage({ onSwitch, closeModal, setWouterLocation }) {
  const login = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [resetStep, setResetStep] = useState("none");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // seconds remaining until resend allowed
  const resendTimerRef = useRef(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    login.mutate(data);
  };

  // When login succeeds, close modal (if provided) and navigate to /home.
  useEffect(() => {
    if (login.isSuccess) {
      if (typeof closeModal === 'function') {
        try { closeModal(); } catch (e) {}
      }
      try {
        // prefer react-router navigation when available
        navigate('/home');
      } catch (e) {
        // fallback to wouter navigation
        try { setWouterLocation && setWouterLocation('/home'); } catch (er) {}
      }
    }
  }, [login.isSuccess, closeModal, navigate, setWouterLocation]);

  useEffect(() => {
    if (login.isError) {
      try {
        hotToast.error(login.error?.message || "Wrong password or email");
      } catch (e) {}
    }
  }, [login.isError, login.error]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsResetLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password/request", { email: resetEmail });
      toast({ title: "OTP Sent", description: "Check console for debug OTP" });
      setResetStep("otp");
      startResendCooldown();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsResetLoading(false);
    }
  };

  const startResendCooldown = (seconds = 60) => {
    // clear existing
    try { if (resendTimerRef.current) { clearInterval(resendTimerRef.current); resendTimerRef.current = null; } } catch (e) {}
    setResendCooldown(seconds);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          try { clearInterval(resendTimerRef.current); resendTimerRef.current = null; } catch (e) {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    if (!resetEmail) {
      toast({ title: "Error", description: "No email provided", variant: "destructive" });
      return;
    }
    setIsResetLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password/request", { email: resetEmail });
      toast({ title: "OTP Sent", description: "A new code was sent to your email." });
      startResendCooldown();
    } catch (err) {
      toast({ title: "Error", description: err.message || String(err), variant: "destructive" });
    } finally {
      setIsResetLoading(false);
    }
  };

  // cleanup timer on unmount
  useEffect(() => {
    return () => {
      try { if (resendTimerRef.current) clearInterval(resendTimerRef.current); } catch (e) {}
    };
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (resetOtp.length !== 6) {
      toast({ title: "Invalid OTP", description: "OTP must be 6 digits", variant: "destructive" });
      return;
    }

    setIsResetLoading(true);
    try {
      // Verify OTP with server before allowing password reset
      const res = await apiRequest("POST", "/api/auth/reset-password/verify", { email: resetEmail, otp: resetOtp });
      // If apiRequest returned a Response-like object, parse JSON for message
      const payload = res && typeof res.json === 'function' ? await res.json() : {};
      if (res && res.ok === false) {
        throw new Error(payload?.message || 'Invalid OTP');
      }

      toast({ title: "OTP Verified", description: "You may now set a new password." });
      setResetStep("reset");
    } catch (err) {
      // normalize error message to avoid status codes, JSON brackets, and labels like "message:".
      const normalizeErrorText = (e) => {
        try {
          if (!e) return "Invalid OTP";

          let text = "";
          if (typeof e === "string") text = e;
          else if (e instanceof Error && e.message) text = String(e.message);
          else if (e?.message) text = String(e.message);
          else if (e?.response?.data?.message) text = String(e.response.data.message);
          else if (e?.data?.message) text = String(e.data.message);
          else if (Array.isArray(e)) text = e.join(', ');
          else text = String(e);

          // Remove surrounding braces/quotes and trim
          text = text.replace(/^\s*\{?['\"]?/, '').replace(/['\"]?\}?\s*$/, '');

          // If formatted like "message:Invalid OTP" or "message: Invalid OTP", extract after the label
          const m = text.match(/message\s*[:=]\s*(.*)/i);
          if (m && m[1]) text = m[1];

          // Remove any remaining brackets or quotes
          text = text.replace(/[\[\]{}"']/g, '').trim();

          // If still colon-separated, take the last segment
          if (text.includes(':')) {
            const parts = text.split(':').map(s => s.trim()).filter(Boolean);
            text = parts[parts.length - 1];
          }

          return text || "Invalid OTP";
        } catch {
          return "Invalid OTP";
        }
      };

      const messageText = normalizeErrorText(err);
      toast({ title: "Wrong OTP", description: messageText, variant: "destructive" });
      try { hotToast.error(messageText); } catch (e) {}
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput;
    const confirmPassword = confirmPasswordInput;

    // Client-side validations
    if (!newPassword || newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      try { hotToast.error("Password must be at least 8 characters"); } catch (e) {}
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      try { hotToast.error("Passwords don't match"); } catch (e) {}
      return;
    }
    setIsResetLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password/complete", {
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      toast({ title: "Success", description: "Password reset successful" });
      setResetStep("none");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
      setPasswordMismatch(false);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsResetLoading(false);
    }
  };

  if (resetStep !== "none") {
    return (
      <AuthLayout 
        title="Reset Password" 
        subtitle={
          resetStep === "email" ? "Enter your email to receive an OTP." :
          resetStep === "otp" ? "Enter the 6-digit code sent to your email." :
          "Choose a new strong password."
        }
        asModal={true}
        onClose={() => { if (typeof closeModal === 'function') { try { closeModal(); } catch {} } else { setWouterLocation && setWouterLocation('/'); } }}
      >
        <div className="space-y-6">
          <button 
            onClick={() => setResetStep("none")}
            className="text-xs font-medium text-gray-500 hover:text-indigo-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </button>

          {resetStep === "email" && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label>Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="pl-10"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600" disabled={isResetLoading}>
                {isResetLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          )}

          {resetStep === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="pl-10 text-center tracking-[0.5em] font-bold"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                {resendCooldown > 0 ? (
                  <div>Resend code in <span className="font-mono">{String(Math.floor(resendCooldown/60)).padStart(2,'0')}:{String(resendCooldown%60).padStart(2,'0')}</span></div>
                ) : (
                  <button type="button" onClick={handleResendOtp} disabled={isResetLoading} className="inline-flex items-center gap-2 text-indigo-600 hover:underline">
                    <RefreshCcw className="w-4 h-4" /> Resend code
                  </button>
                )}

                <div>{isResetLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}</div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600">
                Verify OTP
              </Button>
            </form>
          )}

          {resetStep === "reset" && (
            <form onSubmit={handleCompleteReset} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="newPassword"
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    className="pl-10"
                    value={newPasswordInput}
                    onChange={(e) => { setNewPasswordInput(e.target.value); if (passwordMismatch) setPasswordMismatch(false); }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat password"
                    className="pl-10"
                    value={confirmPasswordInput}
                    onChange={(e) => { setConfirmPasswordInput(e.target.value); if (passwordMismatch) setPasswordMismatch(false); }}
                  />
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-destructive">Passwords don't match</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-indigo-600" disabled={isResetLoading}>
                {isResetLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your details to access your dashboard."
      asModal={true}
      onClose={() => { if (typeof closeModal === 'function') { try { closeModal(); } catch {} } else { setWouterLocation && setWouterLocation('/'); } }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="username"
                type="email"
                placeholder="name@company.com"
                className="pl-10"
                {...form.register("username")}
              />
            </div>
            {form.formState.errors.username && (
              <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setResetStep("email")}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
            </div>

            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
          disabled={login.isPending}
        >
          {login.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="w-full">
          <div className="relative w-full">
            {/* Invisible GoogleLogin overlay receives clicks and runs existing handlers */}
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "auto", opacity: 0 }}>
              <GoogleLogin
                onSuccess={async (res) => {
                  if (typeof onGoogleSuccess === "function") {
                    try {
                      await onGoogleSuccess(res);
                      return;
                    } catch (err) {
                      toast({ variant: "destructive", title: "Google Login Failed", description: err?.message || "Google login failed" });
                      return;
                    }
                  }

                  try {
                    const r = await apiRequest("POST", "/api/auth/google", { credential: res.credential });
                    const data = await r.json();
                    console.log("Google login returned user:", data.user);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // update react-query user cache so parent redirects
                    queryClient.setQueryData(["/api/auth/me"], data.user);
                    toast({ title: "Welcome back!", description: `Signed in as ${data.user.email}` });
                    // Close modal if provided and navigate to /home (match Login1.jsx behavior)
                    if (typeof closeModal === 'function') {
                      try { closeModal(); } catch (e) {}
                    }
                    try {
                      navigate('/home');
                    } catch (e) {
                      try { setWouterLocation && setWouterLocation('/home'); } catch (er) {}
                    }
                  } catch (err) {
                    toast({ variant: "destructive", title: "Google Login Failed", description: err.message || "Google login failed" });
                  }
                }}
                onError={() => toast({ variant: "destructive", title: "Google Login Failed" })}
              />
            </div>

            {/* Visible custom Google button (matches earlier design) */}
            <button type="button" className="w-full bg-white border border-gray-200 rounded-xl py-2 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50">
              <Chrome className="mr-2 h-4 w-4" />
              <span className="font-medium">Google</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitch} 
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Create free account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

function SignupPage({ onSwitch, closeModal, setWouterLocation }) {
  const [step, setStep] = useState(1);
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUserSchema.extend({
      confirmPassword: z.string().min(1, "Please confirm your password"),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })),
    mode: "onChange",
    defaultValues: {
      email: "",
      fullName: "",
      role: undefined,
      experienceLevel: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const { trigger, watch, control } = form;
  const fullName = watch("fullName");

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger(["fullName", "email"]);
    if (step === 2) isValid = await trigger(["role", "experienceLevel"]);
    
    if (isValid) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const onSubmit = (data) => {
    register.mutate(data);
  };

  useEffect(() => {
    if (register.isSuccess) {
      toast({ title: "Account created!", description: "Please sign in with your new credentials." });
      try { onSwitch(); } catch (e) {}
    }
  }, [register.isSuccess, onSwitch, toast]);

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Let's start with basics";
      case 2: return `Hi ${fullName?.split(' ')[0] || 'there'}, what's your role?`;
      case 3: return "Secure your account";
      default: return "Create Account";
    }
  };

  // Password strength meter logic (simple)
  const password = watch("password") || "";
  const strength = password.length > 10 ? 3 : password.length > 6 ? 2 : password.length > 0 ? 1 : 0;

  return (
    <AuthLayout
      title={getStepTitle()}
      subtitle="Join thousands of developers acing their interviews."
      asModal={typeof closeModal === 'function'}
      compact={true}
      onClose={() => { if (typeof closeModal === 'function') { try { closeModal(); } catch {} } else { setWouterLocation && setWouterLocation('/'); } }}
    >
      <StepIndicator currentStep={step} totalSteps={3} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    {...form.register("fullName")}
                  />
                </div>
                {form.formState.errors.fullName && (
                  <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="role">Current Role</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => { field.onChange(val); }}
                        value={field.value}
                        onOpenChange={(open) => { try { console.debug('Select role open:', open); } catch {} }}
                      >
                        <SelectTrigger className="pl-10" onClick={() => { try { console.debug('Select role trigger clicked'); } catch {} }}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="Analyst">Data Analyst</SelectItem>
                          <SelectItem value="Designer">Product Designer</SelectItem>
                          <SelectItem value="Manager">Product Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {form.formState.errors.role && (
                  <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                  <Controller
                    control={control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => { field.onChange(val); }}
                        value={field.value}
                        onOpenChange={(open) => { try { console.debug('Select experience open:', open); } catch {} }}
                      >
                        <SelectTrigger className="pl-10" onClick={() => { try { console.debug('Select experience trigger clicked'); } catch {} }}>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Fresher">Fresher (0-2 years)</SelectItem>
                          <SelectItem value="Professional">Professional (2+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {form.formState.errors.experienceLevel && (
                  <p className="text-xs text-destructive">{form.formState.errors.experienceLevel.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    className="pl-10 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                )}
                
                {/* Strength Meter */}
                <div className="flex gap-1 h-1 mt-2">
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-red-500' : 'bg-gray-100'}`} />
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-yellow-500' : 'bg-gray-100'}`} />
                  <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-green-500' : 'bg-gray-100'}`} />
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {strength === 0 && "Enter password"}
                  {strength === 1 && "Weak"}
                  {strength === 2 && "Medium"}
                  {strength === 3 && "Strong"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    className="pl-10"
                    {...form.register("confirmPassword")}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  We protect your data with enterprise-grade encryption. Your career journey is safe with us.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={register.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              type="button" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleNext}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          )}
        </div>

        {step === 1 && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="relative w-full">
              <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "auto", opacity: 0 }}>
                <GoogleLogin
                  onSuccess={async (res) => {
                    try {
                      const r = await apiRequest("POST", "/api/auth/google", { credential: res.credential });
                      const data = await r.json();
                      console.log("Google signup returned user:", data.user);
                      localStorage.setItem("token", data.token);
                      localStorage.setItem("user", JSON.stringify(data.user));
                      queryClient.setQueryData(["/api/auth/me"], data.user);
                      toast({ title: "Welcome!", description: `Signed in as ${data.user.email}` });
                      window.location.replace("/home");
                    } catch (err) {
                      toast({ variant: "destructive", title: "Google Login Failed", description: err.message || "Google signup failed" });
                    }
                  }}
                  onError={() => toast({ variant: "destructive", title: "Google Login Failed" })}
                />
              </div>

              <button type="button" className="w-full bg-white border border-gray-200 rounded-xl py-2 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50">
                <Chrome className="mr-2 h-4 w-4" />
                <span className="font-medium">Google</span>
              </button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitch} 
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}



