import { Link } from "react-router-dom";

const Navbar = () => {
  
  return (
    <header className="flex top-0 justify-between items-center p-5 shadow absolute w-full z-50 bg-white">
      <h1 className="text-2xl font-bold text-Primary">Sahi Spot</h1>
      <nav>
        <Link to="/" className="mx-3 hover:text-blue-500 transition-transform duration-300 hover:-translate-y-2 ">Home</Link>
        <Link to="Find_Parking" className="mx-3 hover:text-Primary transition-transform duration-300 hover:-translate-y-2">Find Parking</Link>
        <Link to="Pricing" className="mx-3 hover:text-Primary transition-transform duration-300 hover:-translate-y-2">Pricing</Link>
        <Link to="About" className="mx-3 hover:text-Primary transition-transform duration-300 hover:-translate-y-2">About Us</Link>
      </nav>
     <Link to="/login-signup" > <button className="bg-Secondary text-white px-4 py-2 rounded-full hover:text-white transition-transform duration-300 hover:translate-0.5"  >
        Login/Signup
      </button></Link>
    </header>
  );
};

export default Navbar;