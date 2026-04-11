import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Crosshair,
  LoaderCircle,
  MapPin,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNearbyLocations, useSearchLocations } from "@/hooks/useParkingQueries";
import { getFallbackCenter } from "@/lib/parking";
import { useLocationStore } from "@/Store/locationStore";
import { Slider } from "@/components/ui/slider";

const LazyMapView = lazy(() => import("@/components/map/MapView"));

const fallbackCenter = getFallbackCenter();

const formatMoney = (value) => `Rs. ${Number(value || 0)}`;

const formatDistance = (distanceKm) => {
  if (distanceKm == null) {
    return "Nearby";
  }
  return `${distanceKm.toFixed(1)} km`;
};

function ParkingDetailsModal({ location, onClose, onOpenDetails }) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[#0f172a] p-6 text-white shadow-[0_30px_80px_-28px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Parking details
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{location.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 inline-flex items-start gap-2 text-sm leading-6 text-slate-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
          {location.address || "Address not yet available"}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Starting price</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {formatMoney(location.startingPrice || location.pricePerHour)}/hr
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Available slots</p>
            <p className="mt-2 text-xl font-semibold text-white">{location.availableSlots}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Distance</p>
            <p className="mt-2 text-base font-medium text-white">{formatDistance(location.distanceKm)}</p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vehicle types</p>
            <p className="mt-2 text-base font-medium capitalize text-white">
              {location.vehicleTypes?.join(", ") || "Car"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenDetails(location.id)}
            className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Open details
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function FindParking() {
  const navigate = useNavigate();
  const {
    userLocation,
    selectedLocationId,
    hoveredLocationId,
    filters,
    fallbackCity,
    setUserLocation,
    setSelectedLocationId,
    setHoveredLocationId,
    setFilters,
    resetMapState,
  } = useLocationStore();
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const [isLocating, setIsLocating] = useState(false);
  const [modalLocation, setModalLocation] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => () => resetMapState(), [resetMapState]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters({ search: searchDraft });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchDraft, setFilters]);

  const resolveLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(fallbackCenter);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: "",
          label: "Your live location",
        });
        setIsLocating(false);
      },
      () => {
        setUserLocation(fallbackCenter);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  };

  useEffect(() => {
    resolveLocation();
  }, []);

  const queryLocation = userLocation || fallbackCity || fallbackCenter;
  const trimmedSearch = filters.search.trim();

  const nearbyQuery = useNearbyLocations({
    lat: queryLocation.lat,
    lng: queryLocation.lng,
    radius: filters.radius,
    city: filters.search || queryLocation.city,
    type: filters.vehicleType === "all" ? undefined : filters.vehicleType,
    page: 1,
    limit: 20,
  });

  const searchQuery = useSearchLocations({
    query: trimmedSearch,
    page: 1,
    limit: 20,
  });

  const activeQuery = trimmedSearch ? searchQuery : nearbyQuery;

  const locations = (activeQuery.data || []).filter((location) => {
    const search = trimmedSearch.toLowerCase();
    const matchesSearch =
      !search ||
      [location.name, location.address, location.city, location.state].some((value) =>
        String(value || "").toLowerCase().includes(search)
      );

    const matchesType =
      filters.vehicleType === "all" || location.vehicleTypes.includes(filters.vehicleType);

    const withinRadius =
      location.distanceKm == null || Number(location.distanceKm) <= Number(filters.radius);

    return matchesSearch && matchesType && withinRadius;
  });

  useEffect(() => {
    if (!locations.length) return;
    const selectedStillVisible = locations.some((location) => location.id === selectedLocationId);
    if (!selectedStillVisible) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId, setSelectedLocationId]);

  useEffect(() => {
    if (!selectedLocationId) return;
    const card = cardRefs.current[selectedLocationId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedLocationId]);

  const selectedLocation = locations.find((location) => location.id === selectedLocationId) || null;

  const handleMarkerSelect = (location) => {
    setSelectedLocationId(location.id);
    setModalLocation(location);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.1),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)]">
      {/* Header Section */}
      <div className="sticky top-[73px] z-40 border-b border-white/10 bg-black/20 backdrop-blur-sm md:top-[81px]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Find Parking
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Discover parking spots near you
              </h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1 sm:min-w-[20rem] lg:min-w-[26rem]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Search by city, area, or parking name"
                  className="w-full rounded-full border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:bg-white/[0.08]"
                />
              </div>
              <button
                onClick={resolveLocation}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                {isLocating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                My Location
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-emerald-300">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Search radius</p>
                <p className="text-sm text-slate-400">
                  Show parking spots within <span className="font-semibold text-white">{filters.radius} km</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>1 km</span>
                <span>{filters.radius} km</span>
                <span>25 km</span>
              </div>
              <Slider
                value={[Number(filters.radius)]}
                min={1}
                max={25}
                step={1}
                onValueChange={([value]) => setFilters({ radius: value })}
                className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-emerald-400 [&_[data-slot=slider-range]]:to-orange-400 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-emerald-300 [&_[data-slot=slider-thumb]]:bg-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-slate-300">
              <span className="font-semibold text-white">{locations.length}</span> locations found
            </span>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-slate-300">
              Searching near <span className="font-semibold text-white">{userLocation?.label || fallbackCity?.label || fallbackCenter.label}</span>
            </span>
          </div>
          {activeQuery.isFetching && locations.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <LoaderCircle className="h-3 w-3 animate-spin" />
              Refreshing...
            </div>
          )}
        </div>

        {/* Map Section - TOP */}
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
            <div className="border-b border-white/10 px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Interactive Map
                  </p>
                  <h2 className="text-sm font-medium text-white">
                    {selectedLocation ? selectedLocation.name : "Click markers for details"}
                  </h2>
                </div>
                <div className="text-xs text-slate-400">
                  {locations.length} locations shown
                </div>
              </div>
            </div>

            <div className="relative h-[400px] w-full lg:h-[450px]">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-orange-300" />
                  </div>
                }
              >
                <LazyMapView
                  className="h-full w-full"
                  locations={locations}
                  userLocation={userLocation}
                  radiusKm={filters.radius}
                  selectedLocationId={selectedLocationId}
                  hoveredLocationId={hoveredLocationId}
                  onSelectLocation={handleMarkerSelect}
                  onHoverLocation={setHoveredLocationId}
                />
              </Suspense>
            </div>

            {/* Map Hint */}
            <div className="border-t border-white/10 bg-black/30 px-5 py-2 text-center">
              <p className="text-xs text-slate-400">
                Click any map marker to preview parking details instantly
              </p>
            </div>
          </div>
        </div>

        {/* Locations List Section - BOTTOM */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Available Parking Locations</h2>
            <p className="text-sm text-slate-400">
              {locations.length} result{locations.length !== 1 ? "s" : ""}
            </p>
          </div>

          {activeQuery.isLoading && !(activeQuery.data?.length > 0) ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <LoaderCircle className="h-8 w-8 animate-spin text-orange-300" />
            </div>
          ) : null}

          {!activeQuery.isLoading && locations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-12 text-center">
              <p className="text-base text-slate-400">No parking locations found</p>
              <p className="mt-2 text-sm text-slate-500">Try adjusting your search or radius</p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence initial={false}>
              {locations.map((location, index) => {
                const isActive = location.id === selectedLocationId;
                const isHovered = location.id === hoveredLocationId;

                return (
                  <motion.article
                    key={location.id}
                    ref={(element) => {
                      cardRefs.current[location.id] = element;
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    onMouseEnter={() => setHoveredLocationId(location.id)}
                    onMouseLeave={() => setHoveredLocationId(null)}
                    onClick={() => setSelectedLocationId(location.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                        : isHovered
                          ? "border-white/20 bg-white/[0.08]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 truncate">
                          {[location.area, location.city].filter(Boolean).join(", ") || "Nearby"}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-white truncate">
                          {location.name}
                        </h3>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1 shrink-0">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">From</p>
                        <p className="text-sm font-semibold text-white">
                          {formatMoney(location.startingPrice || location.pricePerHour)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                      {location.address || "Address not available"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-slate-300">
                        {formatDistance(location.distanceKm)}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-slate-300">
                        {location.availableSlots} slots
                      </span>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/locations/${location.id}`);
                      }}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20"
                    >
                      View Details
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ParkingDetailsModal
        location={modalLocation}
        onClose={() => setModalLocation(null)}
        onOpenDetails={(id) => navigate(`/locations/${id}`)}
      />
    </div>
  );
}
