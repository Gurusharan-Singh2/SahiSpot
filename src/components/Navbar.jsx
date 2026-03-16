import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react"; // Import extra icons if needed
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const linkClasses = ({ isActive }) =>
    `relative mx-3 font-medium transition-colors duration-300 ${
      isActive ? "text-Primary" : "text-gray-600 hover:text-Primary"
    }`;

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex bg-white/80 backdrop-blur-md justify-between px-6 md:px-10 py-4 items-center w-full z-50 sticky top-0 border-b border-gray-100"
    >
      <motion.h1 
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-Primary to-orange-600 cursor-pointer"
      >
        Sahi Spot
      </motion.h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4">
        {["/", "/find-parking", "/manage-parking", "/Pricing", "/about-us"].map((path, index) => {
           const labels = { "/": "Home", "/find-parking": "Find Parking", "/manage-parking": "Manage Parking", "/Pricing": "Pricing", "/about-us": "About Us" };
           return (
             <motion.div key={path} variants={navItemVariants} initial="hidden" animate="visible" transition={{ delay: index * 0.1 }}>
                <NavLink to={path} className={linkClasses}>
                  {({ isActive }) => (
                    <>
                      {labels[path]}
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute left-0 right-0 -bottom-1 h-0.5 bg-Primary rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
             </motion.div>
           );
        })}

        {!user ? (
           <NavLink to="/login-signup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-Primary text-white px-5 py-2 rounded-full shadow-lg shadow-Primary/30 hover:shadow-Primary/50 transition font-medium"
            >
              Login / Signup
            </motion.button>
          </NavLink>
        ) : (
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="w-8 h-8 rounded-full bg-Primary/10 flex items-center justify-center text-Primary">
                    <User size={18} />
                </div>
                <span className="hidden lg:block">{user.name}</span>
             </div>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition"
                title="Logout"
            >
                <LogOut size={20} />
            </motion.button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded focus:outline-none text-gray-700"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col items-center space-y-6 py-8 md:hidden overflow-hidden"
          >
            {["/", "/find-parking", "/manage-parking", "/Pricing", "/about-us"].map((path, index) => {
               const labels = { "/": "Home", "/find-parking": "Find Parking", "/manage-parking": "Manage Parking", "/Pricing": "Pricing", "/about-us": "About Us" };
               return (
                 <motion.div
                   key={path}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                 >
                    <NavLink to={path} onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700 hover:text-Primary transition">
                        {labels[path]}
                    </NavLink>
                 </motion.div>
               )
            })}

            {!user ? (
               <NavLink to="/login-signup" onClick={() => setIsOpen(false)} className="w-full flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-Primary text-white px-6 py-2 rounded-full shadow-md w-3/4"
                >
                  Login / Signup
                </motion.button>
               </NavLink>
            ) : (
               <div className="flex flex-col items-center gap-4 w-full">
                  <div className="text-lg font-medium text-gray-800">Hi, {user.name}</div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        logout();
                        setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 font-medium"
                  >
                    <LogOut size={18} /> Logout
                  </motion.button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
