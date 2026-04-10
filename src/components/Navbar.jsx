import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, LogOut, Menu, Settings, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../Store/authStore";
import { authService } from "../services/auth.service";
import { canManageParking, getDefaultRouteForRole, isAdminRole, normalizeRole } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const role = normalizeRole(user?.role);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      updateUser(profileQuery.data?.data ?? profileQuery.data?.user ?? profileQuery.data);
    }
  }, [profileQuery.data, updateUser]);

  const userInitial = String(user?.name || user?.email || "U").charAt(0).toUpperCase();

  const navItems = [
    { path: "/", label: "Home", visible: true },
    { path: "/find-parking", label: "Find Parking", visible: !isAuthenticated || (!canManageParking(role) && !isAdminRole(role)) },
    { path: "/manage-parking", label: "Manage Parking", visible: canManageParking(role) },
    { path: "/dashboard", label: "Dashboard", visible: isAuthenticated && !canManageParking(role) && !isAdminRole(role) },
    { path: "/owner", label: "Owner Panel", visible: isAuthenticated && canManageParking(role) },
    { path: "/admin", label: "Admin Panel", visible: isAuthenticated && isAdminRole(role) },
    { path: "/about-us", label: "About Us", visible: true },
    { path: "/contact-us", label: "Contact", visible: true },
  ].filter((item) => item.visible);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      logout();
      navigate("/");
      setIsOpen(false);
    }
  };

  const linkClasses = ({ isActive }) =>
    `relative px-1 py-1 font-medium transition-colors duration-300 ${
      isActive ? "text-orange-300" : "text-slate-300 hover:text-white"
    }`;

  const profileRoute = getDefaultRouteForRole(role);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#07111bcc]/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-3 py-3 sm:px-5 sm:py-4 lg:px-6 xl:px-8">
        <Link to="/" className="shrink-0">
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-lg font-bold text-white shadow-lg shadow-orange-900/30">
              S
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Sahi Spot
              </h1>
              <p className="text-xs text-slate-400">Smart parking, less friction</p>
            </div>
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <NavLink to={item.path} className={linkClasses}>
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive ? (
                        <motion.div
                          layoutId="underline"
                          className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-orange-400"
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink to="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-medium text-slate-200 transition hover:border-orange-400/40 hover:text-white"
                >
                  Login
                </motion.button>
              </NavLink>
              <NavLink to="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-orange-900/30 transition hover:brightness-110"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </NavLink>
            </div>
          ) : (
            <div className="group relative flex items-center">
              <button
                type="button"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-200 transition hover:bg-white/[0.06]"
              >
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarImage src={user?.image} alt={user?.name || "User profile"} className="object-cover" />
                  <AvatarFallback className="bg-orange-500/10 text-orange-300">
                    {user?.image ? <User size={18} /> : userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left lg:block">
                  <span className="block text-sm font-medium text-slate-100">
                    {user?.name || user?.email}
                  </span>
                  <span className="block text-xs capitalize text-slate-400">{role}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition group-hover:text-slate-200" />
              </button>

              <div className="pointer-events-none absolute right-0 top-full z-50 mt-3 w-52 translate-y-2 rounded-[1.2rem] border border-white/10 bg-[#0b1220]/96 p-2 opacity-0 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="truncate text-sm font-medium text-white">{user?.name || user?.email}</p>
                  <p className="text-xs capitalize text-slate-400">{role}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(profileRoute)}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded p-2 text-slate-200 focus:outline-none md:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 top-full flex w-full flex-col items-center space-y-4 overflow-hidden border-t border-white/10 bg-[#07111bf2] px-4 py-6 shadow-xl md:hidden"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="w-full"
              >
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-base font-medium text-slate-200 transition hover:border-orange-400/30 hover:text-orange-300"
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}

            {!isAuthenticated ? (
              <div className="flex w-full flex-col items-center gap-3">
                <NavLink to="/auth/login" onClick={() => setIsOpen(false)} className="flex w-full justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-slate-200"
                  >
                    Login
                  </motion.button>
                </NavLink>
                <NavLink to="/auth/signup" onClick={() => setIsOpen(false)} className="flex w-full justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-md"
                  >
                    Get started
                  </motion.button>
                </NavLink>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-center text-base font-medium text-white">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={user?.image} alt={user?.name || "User profile"} className="object-cover" />
                    <AvatarFallback className="bg-orange-500/10 text-orange-300">
                      {user?.image ? <User size={18} /> : userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div>{user?.name || user?.email}</div>
                    <div className="text-xs capitalize text-slate-400">{role}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate(profileRoute);
                    setIsOpen(false);
                  }}
                  className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-center text-sm font-medium text-slate-300 hover:text-white"
                >
                  Edit profile
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 font-medium text-red-400"
                >
                  <LogOut size={18} /> Logout
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
