import { Search, MapPin, CreditCard, ShieldCheck, Clock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Search className="w-6 h-6 text-blue-600" />,
        title: "Smart Search",
        desc: "Find the nearest parking spot in seconds with our real-time map.",
        color: "bg-blue-50"
    },
    {
        icon: <MapPin className="w-6 h-6 text-red-600" />,
        title: "Exact Location",
        desc: "Get precise navigation to your reserved spot without confusion.",
        color: "bg-red-50"
    },
    {
        icon: <CreditCard className="w-6 h-6 text-green-600" />,
        title: "Seamless Payment",
        desc: "Pay securely online and skip the cash hassle at the gate.",
        color: "bg-green-50"
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
        title: "Secure Parking",
        desc: "Verified parking locations ensuring your vehicle's safety.",
        color: "bg-purple-50"
    }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Working = () => (
  <section className="py-24 bg-white relative">
    <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-Primary font-semibold tracking-wide uppercase text-sm mb-3"
            >
              How It Works
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Parking made simple.
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Experience the easiest way to park your car. No tickets, no cash, no stress.
            </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
            {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="group p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300"
                >
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-gray-500 leading-relaxed">
                        {feature.desc}
                    </p>
                </motion.div>
            ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 bg-gray-900 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left"
        >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-800 to-transparent opacity-50 hidden md:block"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to park smarter?</h3>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                        Join thousands of drivers who save time and money with Sahi Spot. Download the app or start booking now.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-Primary text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-900/20"
                        >
                            Get Started Now
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition border border-white/10"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </div>
                <div className="relative hidden md:block">
                     {/* Decorative abstract graphic */}
                     <div className="grid grid-cols-2 gap-4 opacity-80">
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="bg-gray-800 p-6 rounded-2xl"
                        >
                            <Clock className="text-Primary w-8 h-8 mb-2" />
                            <div className="h-2 w-16 bg-gray-700 rounded mb-2"></div>
                            <div className="h-2 w-24 bg-gray-700 rounded"></div>
                        </motion.div>
                        <motion.div 
                          animate={{ y: [0, 10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="bg-gray-800 p-6 rounded-2xl mt-8"
                        >
                            <Smartphone className="text-blue-500 w-8 h-8 mb-2" />
                            <div className="h-2 w-16 bg-gray-700 rounded mb-2"></div>
                            <div className="h-2 w-24 bg-gray-700 rounded"></div>
                        </motion.div>
                     </div>
                </div>
            </div>
        </motion.div>
    </div>
  </section>
);

export default Working;
