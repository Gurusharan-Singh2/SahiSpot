import { motion } from "framer-motion";
import { ArrowRight, Bike, Car, MapPin, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canManageParking } from "@/lib/auth";

const typeIconMap = {
  car: Car,
  bike: Bike,
  ev: Zap,
};

export default function MapPopup({ location, highlighted, onBookNow }) {
  const { user } = useAuth();
  const isOwner = canManageParking(user?.role);
  const vehicleTypes = location.vehicleTypes?.length ? location.vehicleTypes : ["car"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`w-72 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] p-4 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur ${
        highlighted ? "ring-2 ring-orange-300/60" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Nearby parking
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{location.name}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-amber-200">
          {location.averageRating > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              {location.averageRating.toFixed(1)}
            </span>
          ) : (
            "New"
          )}
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm text-slate-300">
        <p className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-300" />
          {location.address || `${location.city || "City center"} parking access`}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold text-white">Rs. {location.pricePerHour}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">per hour</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Open slots</p>
            <p className="text-lg font-semibold text-white">{location.availableSlots}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {vehicleTypes.map((type) => {
          const Icon = typeIconMap[type] || Car;
          return (
            <span
              key={type}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium capitalize text-slate-200"
            >
              <Icon className="h-3.5 w-3.5" />
              {type}
            </span>
          );
        })}
      </div>

      <div className="flex gap-2">
        {!isOwner ? (
          <button
            type="button"
            onClick={() => onBookNow?.(location)}
            className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Book Now
          </button>
        ) : null}
        <Link
          to={`/locations/${location.id}`}
          className={`inline-flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] ${
            isOwner ? "flex-1" : ""
          }`}
        >
          Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
