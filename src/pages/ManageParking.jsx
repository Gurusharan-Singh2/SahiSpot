import React, { useState } from 'react';
import { useParkingLocations, useAddParkingLocation } from '../hooks/useParkingQueries';
import ParkingMap from '../components/ParkingMap';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MapPin, Loader2 } from 'lucide-react';

const ManageParking = () => {
  const { data: parkingSpots = [], isLoading } = useParkingLocations();
  const { mutate: addSpot, isPending: isAdding } = useAddParkingLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpotLocation, setNewSpotLocation] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const handleAddSpotClick = (latlng) => {
    setNewSpotLocation(latlng);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
        toast.error("Please fill in all fields");
        return;
    }

    addSpot({
        lat: newSpotLocation.lat,
        lng: newSpotLocation.lng,
        name: formData.name,
        latitude: newSpotLocation.lat,
        longitude: newSpotLocation.lng,
        price: Number(formData.price)
    }, {
        onSuccess: () => {
            setIsModalOpen(false);
            setFormData({ name: '', price: '' });
            setNewSpotLocation(null);
        }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 md:p-8 h-[calc(100vh-80px)]"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Parking Manager</h1>
            <p className="text-gray-500 mt-1">Manage your inventory and availability.</p>
        </div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass px-4 py-2 rounded-xl text-sm font-medium text-Primary flex items-center gap-2 border-Primary/10 bg-Primary/5"
        >
            <Plus size={16} />
            Tip: Click anywhere on the map to add a new spot
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-[calc(100%-120px)] w-full rounded-3xl overflow-hidden relative shadow-2xl border border-white/50"
      >
        <ParkingMap 
            spots={parkingSpots} 
            mode="add" 
            onAddSpot={handleAddSpotClick} 
        />
        
        {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[500]">
                <Loader2 className="animate-spin text-Primary" size={40} />
            </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-white p-8 rounded-3xl shadow-2xl w-[400px] max-w-full relative z-10 border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add Location</h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin size={12} />
                                {newSpotLocation?.lat.toFixed(4)}, {newSpotLocation?.lng.toFixed(4)}
                            </p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                            <X size={18} className="text-gray-600" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Location Name</label>
                            <input 
                                type="text" 
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-Primary/20 focus:border-Primary outline-none transition-all"
                                placeholder="e.g. Central Mall Parking"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Price per Hour (₹)</label>
                            <input 
                                type="number" 
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-Primary/20 focus:border-Primary outline-none transition-all"
                                placeholder="50"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-2">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isAdding}
                                className="w-full py-3.5 bg-gradient-to-r from-Primary to-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isAdding ? <Loader2 className="animate-spin" size={20} /> : 'Add Location'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageParking;
