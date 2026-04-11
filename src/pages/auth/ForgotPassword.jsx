import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../../services/auth.service";
import AuthShell from "@/components/auth/AuthShell";
import { KeyRound, Mail, RefreshCcw, ShieldEllipsis } from "lucide-react";

const ForgotPassword=()=> {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phoneOrEmail: "", otp: "", newPassword: "" });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!formData.phoneOrEmail) return toast.error("Enter your registered email or phone");

    try {
      setLoading(true);
      await authService.forgotPassword({ email: formData.phoneOrEmail });
      toast.success("OTP sent for password reset");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp || !formData.newPassword) return toast.error("Enter OTP and new password");

    try {
      setLoading(true);
      await authService.resetPassword({ email: formData.phoneOrEmail, otp: formData.otp, newPassword: formData.newPassword });
      toast.success("Password reset successful!");
      navigate("/auth/login");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Recover access without the clunky flow."
      description="Request an OTP, verify it, and set a fresh password in a cleaner two-step experience."
      footer={
        <p className="text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link to="/auth/login" className="font-semibold text-white transition hover:text-emerald-300">
            Return to login
          </Link>
        </p>
      }
    >
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
            Enter your registered email to receive a secure password reset OTP.
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-200">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="phoneOrEmail"
                placeholder="hello@example.com"
                value={formData.phoneOrEmail}
                onChange={handleChange}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white hover:brightness-110" disabled={loading}>
            {loading ? "Sending..." : "Send reset OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-200">OTP</Label>
              <div className="relative">
                <ShieldEllipsis className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  name="otp"
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-lg tracking-[0.35em] text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-200">New Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  name="newPassword"
                  type="password"
                  placeholder="Create a new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white hover:brightness-110" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Start over
          </button>
        </form>
      )}
    </AuthShell>
  );
}
export default ForgotPassword