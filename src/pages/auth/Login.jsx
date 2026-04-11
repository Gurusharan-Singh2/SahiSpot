import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../Store/authStore";
import { getDefaultRouteForRole, mergeUserWithRoleFallback } from "@/lib/auth";
import AuthShell from "@/components/auth/AuthShell";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";

const Login=()=> {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuthStore();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Enter email and password");
    }

    try {
      setLoading(true);
      const res = await authService.login(formData);
      const resolvedUser = mergeUserWithRoleFallback(res.user, {
        email: formData.email,
        role: res.user?.role,
      });
      login(resolvedUser);
      toast.success("Login successful!");
      navigate(getDefaultRouteForRole(resolvedUser.role));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back to a smoother parking workflow."
      description="Access your bookings, owner tools, and live parking activity from one polished dashboard."
      panel="signin"
      footer={
        <p className="text-center text-sm text-slate-400">
          New here?{" "}
          <Link to="/auth/signup" className="font-semibold text-white transition hover:text-emerald-300">
            Create your account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-200">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              name="email"
              placeholder="hello@sahispot.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-slate-200">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Secure sign-in flow
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-orange-300" />
            Redirects by role
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white hover:brightness-110"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Continue to dashboard"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default Login