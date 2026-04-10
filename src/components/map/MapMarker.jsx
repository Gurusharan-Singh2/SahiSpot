import L from "leaflet";
import { Marker } from "react-leaflet";

const typeConfig = {
  car: {
    color: "#2563eb",
    bg: "#1e40af",
    glow: "rgba(37,99,235,0.45)",
    icon: "🚗",
  },
  bike: {
    color: "#7c3aed",
    bg: "#5b21b6",
    glow: "rgba(124,58,237,0.45)",
    icon: "🏍️",
  },
  ev: {
    color: "#059669",
    bg: "#065f46",
    glow: "rgba(5,150,105,0.45)",
    icon: "⚡",
  },
  truck: {
    color: "#d97706",
    bg: "#92400e",
    glow: "rgba(217,119,6,0.45)",
    icon: "🚛",
  },
};

const buildMarkerHtml = (type, price, selected) => {
  const cfg = typeConfig[type] || typeConfig.car;
  const scale = selected ? 1.18 : 1;
  const shadow = selected
    ? `0 8px 28px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.35)`
    : `0 4px 16px ${cfg.glow}, 0 2px 6px rgba(0,0,0,0.28)`;

  const pulse = selected
    ? `<span style="position:absolute;inset:-6px;border-radius:999px 999px 999px 0;border:2px solid ${cfg.color};opacity:0.55;animation:sahiPulse 1.4s ease-in-out infinite;"></span>`
    : "";

  const priceTag =
    price > 0
      ? `<span style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);white-space:nowrap;background:rgba(2,6,23,0.88);border:1px solid ${cfg.color}44;border-radius:4px;padding:1px 5px;font-size:9px;font-weight:700;color:${cfg.color};letter-spacing:0.03em;">₹${price}/hr</span>`
      : "";

  return `
    <style>
      @keyframes sahiPulse {
        0%,100% { transform:scale(1); opacity:0.55; }
        50% { transform:scale(1.22); opacity:0.2; }
      }
    </style>
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:scale(${scale});transform-origin:bottom center;transition:transform 0.18s ease;">
      ${pulse}
      <div style="
        display:flex;align-items:center;justify-content:center;
        background:linear-gradient(145deg,${cfg.color},${cfg.bg});
        border:2px solid rgba(255,255,255,0.22);
        border-radius:10px 10px 10px 0;
        padding:4px 7px;
        box-shadow:${shadow};
        min-width:36px;
        position:relative;
      ">
        <span style="font-size:13px;line-height:1;">${cfg.icon}</span>
      </div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${cfg.color};margin-top:-1px;"></div>
      ${priceTag}
    </div>
  `;
};

const createMarkerIcon = (type, price, selected) =>
  L.divIcon({
    className: "sahispot-parking-marker",
    html: buildMarkerHtml(type, price, selected),
    iconSize: [46, 52],
    iconAnchor: [23, 52],
    popupAnchor: [0, -54],
  });

export default function MapMarker({
  location,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) {
  const primaryType = location.vehicleTypes?.[0] || "car";
  const price = Math.round(location.pricePerHour || location.price || 0);

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={createMarkerIcon(primaryType, price, isSelected || isHovered)}
      eventHandlers={{
        click: () => onSelect(location),
        mouseover: () => onHover(location.id),
        mouseout: () => onHover(null),
      }}
      zIndexOffset={isSelected ? 1000 : isHovered ? 500 : 0}
    />
  );
}
