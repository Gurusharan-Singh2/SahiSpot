import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Loader2, User, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/Store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  const userInitial = String(user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: () => authService.editProfile({ name, photo: photoFile }),
    onSuccess: (data) => {
      const updated = data?.user ?? data;
      updateUser(updated);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
      handleClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setPhotoFile(null);
    setName(user?.name || "");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[1201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0b1220] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                <p className="mt-0.5 text-sm text-slate-400">Update your name and avatar</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="h-24 w-24 border-2 border-white/10 ring-4 ring-orange-500/20 transition group-hover:ring-orange-500/40">
                    <AvatarImage
                      src={previewUrl || user?.image}
                      alt={user?.name || "avatar"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-orange-500/10 text-3xl font-bold text-orange-300">
                      {user?.image && !previewUrl ? <User size={32} /> : userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <Camera size={22} className="text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Click avatar to change photo</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email <span className="text-xs text-slate-500">(cannot be changed)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-slate-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-medium text-white shadow-lg shadow-orange-900/30 transition hover:brightness-110 disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
