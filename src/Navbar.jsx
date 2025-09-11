import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `mx-3 transition-transform duration-300 hover:-translate-y-2 ${
      isActive ? "text-Primary font-semibold" : "text-gray-600 hover:text-Primary"
    }`;

  return (
    <header className="flex top-0 justify-between items-center p-5 shadow absolute w-full z-50 bg-white">
      <h1 className="text-2xl font-bold text-Primary">Sahi Spot</h1>

      <nav className="hidden md:flex">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="Find_Parking" className={linkClasses}>
          Find Parking
        </NavLink>
        <NavLink to="Pricing" className={linkClasses}>
          Pricing
        </NavLink>
        <NavLink to="About" className={linkClasses}>
          About Us
        </NavLink>
      </nav>

      <Link to="/login-signup" className="hidden md:block">
        <button className="bg-Primary text-white px-4 py-2 rounded-full hover:text-white transition-transform duration-300 hover:scale-105">
          Login/Signup
        </button>
      </Link>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-5 md:hidden">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="Find_Parking" onClick={() => setIsOpen(false)} className={linkClasses}>
            Find Parking
          </NavLink>
          <NavLink to="Pricing" onClick={() => setIsOpen(false)} className={linkClasses}>
            Pricing
          </NavLink>
          <NavLink to="About" onClick={() => setIsOpen(false)} className={linkClasses}>
            About Us
          </NavLink>
          <Link to="/login-signup" onClick={() => setIsOpen(false)}>
            <button className="bg-Primary text-white px-4 py-2 rounded-full hover:scale-105 transition">
              Login/Signup
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
