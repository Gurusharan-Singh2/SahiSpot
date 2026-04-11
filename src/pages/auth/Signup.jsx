import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "../../services/auth.service";
import AuthShell from "@/components/auth/AuthShell";
import { BadgeCheck, BriefcaseBusiness, Camera, Eye, EyeOff, KeyRound, Mail, Phone, User2, X } from "lucide-react";

const Signup=()=> {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, password, role } = formData;
    if (!name || !email || !phoneNumber || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      await authService.signup({ name, email, phone_number: phoneNumber, password, role });
      toast.success("OTP sent! Please check your email/phone.");
      navigate('/auth/verify-otp', { state: { formData: { name, email, phone_number: phoneNumber, password, role, photo: photoFile } } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Build a better parking journey from your first screen."
      description="Create a driver or parking owner account, verify your OTP, and step straight into the right workspace."
      panel="signup"
      footer={
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-white transition hover:text-emerald-300">
            Login instead
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-semibold text-slate-200">Full Name</Label>
            <div className="relative">
              <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-semibold text-slate-200">Profile Photo</Label>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <Camera className="h-6 w-6 text-slate-500" />
                  )}
                </div>

                <label className="flex-1 cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-4 text-sm text-slate-300 transition hover:bg-white/[0.06]">
                  <span className="font-medium text-white">Upload a photo</span>
                  <span className="mt-1 block text-slate-400">
                    JPG, PNG, or WebP. This will be sent when you verify your OTP.
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-200">Phone Number</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="phoneNumber"
                placeholder="+91 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-200">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-500 shadow-none focus:border-emerald-400 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-200">Password</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-200">Account Type</Label>
            <div className="relative">
              <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-1 text-sm text-white shadow-none outline-none transition focus:border-emerald-400 focus:bg-white/[0.06]"
              >
                <option value="user">User</option>
                <option value="owner">Parking Owner</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-white">
            <BadgeCheck className="h-4 w-4 text-emerald-300" />
            One-time OTP verification
          </div>
          <p className="mt-2 leading-6">
            We’ll send a verification code so your account is secure before you enter the app.
          </p>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white hover:brightness-110"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default Signup