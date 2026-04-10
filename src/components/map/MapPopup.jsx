import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canManageParking } from "@/lib/auth";

export default function MapPopup({ location, highlighted, onBookNow }) {
  const { user } = useAuth();
  const isOwner = canManageParking(user?.role);
  const price = location.startingPrice || location.pricePerHour;

  return (
    <div
      className={`w-60 rounded-[1rem] border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.25)] ${
        highlighted ? "ring-1 ring-slate-200" : ""
      }`}
    >
      <p className="text-sm font-semibold text-slate-900">{location.name}</p>

      <p className="mt-2 inline-flex items-start gap-2 text-xs leading-5 text-slate-500">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        {location.address || `${location.city || "City center"} parking access`}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">Rs. {price}/hr</p>
          <p className="text-xs text-slate-500">{location.availableSlots} slots open</p>
        </div>
        {location.distanceKm != null ? (
          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {location.distanceKm.toFixed(1)} km
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex gap-2">
        {!isOwner ? (
          <button
            type="button"
            onClick={() => onBookNow?.(location)}
            className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Book
          </button>
        ) : null}
        <Link
          to={`/locations/${location.id}`}
          className={`inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${
            isOwner ? "flex-1" : ""
          }`}
        >
          Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
