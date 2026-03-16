import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Custom Marker Helpers (since React-Leaflet icons can be tricky)
const createCustomIcon = (color = '#E62727') => {
    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 5px 50%; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

const defaultIcon = createCustomIcon('#E62727');
const availableIcon = createCustomIcon('#16a34a'); // Green
const fullIcon = createCustomIcon('#dc2626'); // Red
const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="background-color: #4f46e5; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function RecenterMap({ location }) {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 14, {
                animate: true,
                duration: 1.5
            });
        }
    }, [location, map]);
    return null;
}

const ParkingMap = ({ spots, userLocation, onBook, onAddSpot, mode = 'view' }) => {
    const defaultCenter = [28.6139, 77.2090]; 
    const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

    return (
        <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {userLocation && (
                <>
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup className="glass-popup">You are here</Popup>
                    </Marker>
                    <RecenterMap location={userLocation} />
                </>
            )}

            {spots.map((spot) => (
                <Marker 
                    key={spot.id} 
                    position={[spot.lat, spot.lng]} 
                    icon={spot.available ? availableIcon : fullIcon}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[180px]">
                            <h3 className="font-bold text-gray-900 text-base mb-1">{spot.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-lg font-bold text-Primary">₹{spot.price}</span>
                                <span className="text-xs text-gray-500">/hr</span>
                            </div>
                            
                            {mode === 'book' && spot.available && (
                                <button 
                                    onClick={() => onBook(spot.id)}
                                    className="w-full bg-Primary text-white py-2 px-3 rounded-lg hover:bg-Secondary transition font-medium text-xs shadow-md"
                                >
                                    Book Spot
                                </button>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}

            {mode === 'add' && <LocationMarker onLocationSelect={onAddSpot} />}
        </MapContainer>
    );
};

export default ParkingMap;
