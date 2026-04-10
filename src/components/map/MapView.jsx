import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";
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

const MAP_STYLES = {
  normal: {
    label: "Normal",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

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

function FitToResults({ locations, userLocation, selectedLocationId }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocationId || !locations.length) {
      return;
    }

    const points = locations.map((location) => [location.latitude, location.longitude]);

    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(points, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [locations, map, selectedLocationId, userLocation]);

  return null;
}

function MapOverlay({ mapStyle, onChangeMapStyle, selectedLocation, userLocation, onFocusUser }) {
  return (
    <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-3">
      <div className="inline-flex rounded-full border border-white/10 bg-slate-950/80 p-1 text-xs font-medium text-white shadow-lg backdrop-blur">
        {Object.entries(MAP_STYLES).map(([key, style]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChangeMapStyle(key)}
            className={`rounded-full px-3 py-1.5 transition ${
              mapStyle === key
                ? "bg-white text-slate-950"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {userLocation ? (
        <button
          type="button"
          onClick={onFocusUser}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur transition hover:bg-slate-900"
        >
          <LocateFixed className="h-4 w-4 text-emerald-300" />
          My location
        </button>
      ) : null}

      {selectedLocation ? (
        <div className="max-w-[220px] rounded-[1rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-white shadow-lg backdrop-blur">
          <p className="text-sm font-semibold">{selectedLocation.name}</p>
          <p className="mt-1 text-xs text-slate-400">
            Tap the blue dot to open details
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function MapView({
  locations,
  userLocation,
  radiusKm,
  selectedLocationId,
  hoveredLocationId,
  onSelectLocation,
  onHoverLocation,
  className,
}) {
  const center = userLocation || fallbackCenter;
  const selectedLocation = locations.find((location) => location.id === selectedLocationId) || null;
  const [mapStyle, setMapStyle] = useState("normal");
  const activeMapStyle = MAP_STYLES[mapStyle] || MAP_STYLES.normal;

  return (
    <div className={`relative isolate z-0 ${className}`}>
      <MapOverlay
        mapStyle={mapStyle}
        onChangeMapStyle={setMapStyle}
        selectedLocation={selectedLocation}
        userLocation={userLocation}
        onFocusUser={() => {
          if (userLocation) {
            onSelectLocation(null);
          }
        }}
      />

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={6}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution={activeMapStyle.attribution}
          url={activeMapStyle.url}
        />

        {userLocation ? (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
        ) : null}

        <Circle
          center={[center.lat, center.lng]}
          radius={Number(radiusKm || 0) * 1000}
          pathOptions={{
            color: "#ef4444",
            weight: 2,
            opacity: 0.9,
            dashArray: "8 8",
            fillColor: "#ef4444",
            fillOpacity: 0.04,
          }}
        />

        {locations.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            isSelected={location.id === selectedLocationId}
            isHovered={location.id === hoveredLocationId}
            onSelect={onSelectLocation}
            onHover={onHoverLocation}
          />
        ))}

        <FitToResults locations={locations} userLocation={userLocation} selectedLocationId={selectedLocationId} />
        <RecenterMap center={center} selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
}
