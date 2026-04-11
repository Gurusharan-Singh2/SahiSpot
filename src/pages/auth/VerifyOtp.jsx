import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../Store/authStore";
import { getDefaultRouteForRole, mergeUserWithRoleFallback } from "@/lib/auth";
import AuthShell from "@/components/auth/AuthShell";
import { BadgeCheck, Camera, ShieldCheck } from "lucide-react";
const VerifyOtp=()=> {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const { login } = useAuthStore();
  
  const formData = location.state?.formData;

  if (!formData) {
    return <Navigate to="/auth/signup" replace />;
  }

  const { name, email, phone_number, password, role = "user", photo } = formData;

  useEffect(() => {
    if (!(photo instanceof File)) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    try {
      setLoading(true);
      const res = await authService.verifyOtp({ name, email, password, phone_number, otp, role, photo });
      const resolvedUser = mergeUserWithRoleFallback(res.user, {
        name,
        email,
        phone_number,
        role,
      });
      login(resolvedUser);
      toast.success("Account verified correctly!");
      navigate(getDefaultRouteForRole(resolvedUser.role));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Verification"
      title="Confirm your OTP and unlock the right workspace."
      description={`We sent a six-digit code to ${email || phone_number}. Enter it below to activate your account.`}
      footer={
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          Verification keeps driver and owner accounts secure.
        </div>
      }
    >
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-white">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            Almost done
          </div>
          <p className="mt-2 leading-6">
            Use the latest OTP you received. After verification, we’ll send you directly to your role-based dashboard.
          </p>
        </div>

        {photo ? (
          <div className="flex items-center gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
              {photo instanceof File ? (
                <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">Profile photo ready</p>
              <p className="text-sm text-slate-400">Your image will be uploaded when the OTP is verified.</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-200">One-time password</Label>
          <Input 
            className="h-14 rounded-2xl border-white/10 bg-white/[0.04] text-center text-2xl tracking-[0.5em] text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]" 
            placeholder="123456" 
            maxLength={6}
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
          />
        </div>

        <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white hover:brightness-110" disabled={loading}>
          {loading ? "Verifying..." : "Verify and continue"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default VerifyOtp