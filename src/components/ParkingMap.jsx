import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import MarkerClusterGroup from 'react-leaflet-cluster';

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

const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      html: `<span class="flex items-center justify-center bg-Primary text-white font-bold rounded-full h-10 w-10 border-2 border-white shadow-lg">${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40, true),
    });
};

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

const ParkingMap = ({ spots, userLocation, selectedPoint, onBook, onAddSpot, mode = 'view' }) => {
    const defaultCenter = [28.6139, 77.2090]; 
    const centerPoint = selectedPoint || userLocation;
    const center = centerPoint ? [centerPoint.lat, centerPoint.lng] : defaultCenter;

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
                </>
            )}

            {selectedPoint && (
                <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={defaultIcon}>
                    <Popup className="glass-popup">
                        <div className="min-w-[160px]">
                            <p className="font-semibold text-gray-900">Selected location</p>
                            <p className="mt-1 text-xs text-gray-600">
                                {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
            >
                {spots.map((spot) => (
                    <Marker 
                        key={spot.id} 
                        position={[spot.lat, spot.lng]} 
                        icon={spot.available ? availableIcon : fullIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 min-w-[180px]">
                                <h3 className="font-bold text-gray-900 text-base mb-1">{spot.name}</h3>
                                <p className="text-xs text-gray-600 mb-1">{spot.address || 'Address unavailable'}</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-lg font-bold text-Primary">₹{spot.price}</span>
                                    <span className="text-xs text-gray-500">/hr</span>
                                </div>
                                <div className="flex gap-2">
                                    {mode === 'book' && spot.available && (
                                        <button 
                                            onClick={() => onBook(spot.id)}
                                            className="flex-1 bg-Primary text-white py-2 px-3 rounded-lg hover:bg-Secondary transition font-medium text-xs shadow-md"
                                        >
                                            Book Spot
                                        </button>
                                    )}
                                    <button
                                        onClick={() => window.location.href = `/locations/${spot.id}`}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition font-medium text-xs shadow-md"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            {mode === 'add' && <LocationMarker onLocationSelect={onAddSpot} />}
            <RecenterMap location={selectedPoint || userLocation} />
        </MapContainer>
    );
};

export default ParkingMap;
