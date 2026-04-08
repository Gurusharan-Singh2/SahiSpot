import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import MapMarker from "@/components/map/MapMarker";
import { getFallbackCenter } from "@/lib/parking";

const fallbackCenter = getFallbackCenter();

const userLocationIcon = L.divIcon({
  className: "sahispot-user-marker",
  html: `
    <div style="position:relative;display:flex;height:40px;width:40px;align-items:center;justify-content:center;">
      <span style="position:absolute;display:inline-flex;height:100%;width:100%;border-radius:999px;background:rgba(52,211,153,0.25);"></span>
      <span style="position:relative;display:inline-flex;height:18px;width:18px;border-radius:999px;border:4px solid white;background:#10b981;box-shadow:0 10px 30px rgba(16,185,129,0.35);"></span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function RecenterMap({ center, selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 15, {
        animate: true,
        duration: 0.8,
      });
      return;
    }

    if (center) {
      map.flyTo([center.lat, center.lng], 13, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [center, map, selectedLocation]);

  return null;
}

export default function MapView({
  locations,
  userLocation,
  selectedLocationId,
  hoveredLocationId,
  onSelectLocation,
  onHoverLocation,
  onBookNow,
  className,
}) {
  const center = userLocation || fallbackCenter;
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) || null;

  return (
    <div className={className}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation ? (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
        ) : null}

        {locations.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            isSelected={location.id === selectedLocationId}
            isHovered={location.id === hoveredLocationId}
            onSelect={onSelectLocation}
            onHover={onHoverLocation}
            onBookNow={onBookNow}
          />
        ))}

        <RecenterMap center={center} selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
}
