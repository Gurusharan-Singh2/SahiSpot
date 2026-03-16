import React, { useState, useEffect } from 'react';
import { useParkingLocations, useBookSpot } from '../hooks/useParkingQueries';
import ParkingMap from '../components/ParkingMap';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, CreditCard, Search, Sliders, Navigation, Star } from 'lucide-react';

const FindParking = () => {
  const { data: parkingSpots = [], isLoading, isError } = useParkingLocations();
  const { mutate: bookSpot } = useBookSpot();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [range, setRange] = useState(20);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success("Location detected!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not detect location. Showing all spots.");
        }
      );
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleBook = (spot) => {
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 3600000).toISOString(); // +1 hour

    bookSpot({
        parkingLocationId: spot.id,
        startTime,
        endTime,
        vehicleType: "CAR"
    });
  };

  const filteredSpots = parkingSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!userLocation) return matchesSearch;
    
    const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        spot.lat, 
        spot.lng
    );
    return matchesSearch && distance <= range;
  }).map(spot => ({
      ...spot,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng).toFixed(1) : null
  })).sort((a, b) => (a.distance && b.distance) ? a.distance - b.distance : 0);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Primary"></div></div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-surface-dim">
      {/* List View */}
      <div className="w-full md:w-[450px] flex flex-col border-r border-gray-200 bg-white/80 backdrop-blur-md h-full z-10 shadow-xl">
        <div className="p-6 border-b border-gray-100 bg-white/50">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-Primary to-orange-600 mb-1">Find Parking</h1>
            <p className="text-gray-500 text-sm mb-4">
              {filteredSpots.length} locations found nearby
            </p>
            
            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-Primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search locations..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-Primary/20 focus:border-Primary outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {userLocation && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Navigation size={14} className="text-Primary" />
                                <span>Search Radius</span>
                            </div>
                            <span className="text-xs font-bold text-Primary bg-Primary/5 px-2.5 py-1 rounded-md">{range} km</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={range} 
                            onChange={(e) => setRange(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-Primary hover:accent-Primary-hover transition-colors"
                        />
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30">
            <AnimatePresence>
            {filteredSpots.map((spot, index) => (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={spot.id}
                    onClick={() => setSelectedSpotId(spot.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        selectedSpotId === spot.id 
                        ? 'border-Primary ring-1 ring-Primary/20 bg-white shadow-lg scale-[1.02]' 
                        : 'border-white bg-white/60 hover:bg-white hover:shadow-md hover:scale-[1.01]'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-Primary transition-colors">{spot.name}</h3>
                            <div className="flex items-center text-gray-500 text-xs mt-1 gap-2">
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>{spot.distance ? `${spot.distance} km` : 'N/A'}</span>
                                </div>
                                {spot.average_rating > 0 && (
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <Star size={10} fill="currentColor" />
                                        <span>{spot.average_rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            spot.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {spot.available ? 'Open' : 'Full'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pl-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900">₹{spot.price || 50}</span>
                            <span className="text-xs text-gray-500">/hour</span>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); handleBook(spot); }}
                            className="px-4 py-2 bg-gradient-to-r from-Primary to-red-600 text-white rounded-lg font-medium text-xs shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-shadow"
                        >
                            Book Spot
                        </motion.button>
                    </div>
                </motion.div>
            ))}
            </AnimatePresence>
            
            {filteredSpots.length === 0 && !isLoading && (
                <div className="text-center py-10 text-gray-400">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <p>No parking spots found in this area.</p>
                </div>
            )}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 h-[50vh] md:h-full relative bg-gray-100">
        <ParkingMap 
            spots={filteredSpots} 
            userLocation={userLocation}
            mode="book" 
            onBook={(id) => handleBook(filteredSpots.find(s => s.id === id))} 
        />
        
        {/* Mobile floating action */}
        <div className="absolute top-4 right-4 md:hidden z-[400]">
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs font-semibold text-gray-700 border border-white/50">
                Tap markers to book
            </div>
        </div>
      </div>
    </div>
  );
};

export default FindParking;
