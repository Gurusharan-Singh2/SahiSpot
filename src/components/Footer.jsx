import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-Primary to-orange-600 mb-4">
              Sahi Spot
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Making parking effortless, secure, and accessible for everyone. Find your spot today.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, color: "#E62727" }}
                  className="text-gray-400 hover:text-Primary transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              {["About Us", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-Primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-Primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-500 mb-4 text-sm">Subscribe to get the latest updates and offers.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-Primary/20"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-Primary text-white px-4 py-2 rounded-lg font-medium"
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 Sahi Spot. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
