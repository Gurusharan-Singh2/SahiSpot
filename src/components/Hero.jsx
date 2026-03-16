import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-Primary/5 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" 
        />
      </div>

      <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Parking Availability
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-Primary to-orange-600">Sahi Spot</span>, <br/>Anytime.
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            Stop circling the block. Reserve your perfect parking spot in seconds and save time for what really matters.
          </p>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-md flex items-center gap-2"
          >
            <div className="pl-4 text-gray-400">
              <MapPin size={20} />
            </div>
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 h-12"
            />
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/find-parking')}
                className="bg-Primary hover:bg-Secondary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-Primary/25 flex items-center gap-2"
            >
              Search
            </motion.button>
          </motion.div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-4">
               {[1,2,3,4].map((i, index) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.5 + (index * 0.1) }}
                     className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                   >
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                   </motion.div>
               ))}
            </div>
            <div className="text-sm font-medium text-gray-600">
                <span className="text-Primary font-bold">1000+</span> Happy Drivers
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative hidden md:block"
        >
           <motion.div 
             whileHover={{ rotate: 0, scale: 1.02 }}
             className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 transform rotate-[-3deg] transition-all duration-500"
           >
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Available Now
                </div>
                <div className="h-64 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.openstreetmap.org/assets/osm_logo-4e72df37.svg')] bg-repeat space-x-4"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <MapPin size={48} className="text-Primary drop-shadow-lg" />
                        </motion.div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">Connaught Place, Block B</h3>
                        <p className="text-gray-500 text-sm">0.2 miles away</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xl text-Primary">₹50<span className="text-sm text-gray-500 font-normal">/hr</span></p>
                    </div>
                </div>
                <button className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                    Book This Spot
                </button>
           </motion.div>

           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 1 }}
             className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
           >
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <ArrowRight size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Time Saved</p>
                        <p className="font-bold text-gray-800">15 mins</p>
                    </div>
                </div>
           </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
