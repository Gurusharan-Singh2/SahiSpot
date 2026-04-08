import { useEffect, useRef } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MapPopup from "@/components/map/MapPopup";

const markerColorMap = {
  car: ["#0ea5e9", "#22d3ee"],
  bike: ["#d946ef", "#ec4899"],
  ev: ["#10b981", "#84cc16"],
};

const buildMarkerHtml = (type, highlighted) => {
  const [startColor, endColor] = markerColorMap[type] || markerColorMap.car;
  const size = highlighted ? 64 : 56;
  const innerSize = highlighted ? 42 : 36;

  return `
  <div class="relative">
    <div style="position:absolute;left:50%;top:${size - 20}px;height:14px;width:14px;transform:translateX(-50%) rotate(45deg);border-radius:4px;background:rgba(15,23,42,0.18);filter:blur(2px);"></div>
    <div style="display:flex;height:${innerSize}px;width:${innerSize}px;align-items:center;justify-content:center;border-radius:999px;border:2px solid rgba(255,255,255,0.92);background:linear-gradient(135deg, ${startColor}, ${endColor});color:white;font-size:10px;font-weight:900;letter-spacing:0.2em;box-shadow:0 18px 40px -16px rgba(15,23,42,0.7);">
      ${type === "ev" ? "EV" : type[0].toUpperCase()}
    </div>
  </div>
`;
};

const createMarkerIcon = (type, highlighted) =>
  L.divIcon({
    className: "sahispot-marker",
    html: buildMarkerHtml(type, highlighted),
    iconSize: highlighted ? [64, 64] : [56, 56],
    iconAnchor: highlighted ? [32, 54] : [28, 46],
    popupAnchor: [0, -42],
  });

export default function MapMarker({
  location,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onBookNow,
}) {
  const markerRef = useRef(null);
  const primaryType = location.vehicleTypes?.[0] || "car";
  const highlighted = isSelected || isHovered;

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }

    if (highlighted) {
      marker.openPopup();
    }
  }, [highlighted]);

  return (
    <Marker
      ref={markerRef}
      position={[location.latitude, location.longitude]}
      icon={createMarkerIcon(primaryType, highlighted)}
      eventHandlers={{
        click: () => onSelect(location.id),
        mouseover: () => onHover(location.id),
        mouseout: () => onHover(null),
      }}
    >
      <Popup closeButton={false} autoPan className="sahispot-popup" minWidth={288}>
        <MapPopup location={location} highlighted={highlighted} onBookNow={onBookNow} />
      </Popup>
    </Marker>
  );
}
