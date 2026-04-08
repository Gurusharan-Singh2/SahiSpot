import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  Car,
  ChevronRight,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Truck,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNearbyLocations } from "@/hooks/useParkingQueries";
import { getFallbackCenter } from "@/lib/parking";
import { useLocationStore } from "@/Store/locationStore";

const LazyMapView = lazy(() => import("@/components/map/MapView"));

const fallbackCenter = getFallbackCenter();
const vehicleTypes = [
  { id: "all", label: "All", icon: Car },
  { id: "car", label: "Car", icon: Car },
  { id: "bike", label: "Bike", icon: Bike },
  { id: "truck", label: "Truck", icon: Truck },
  { id: "ev", label: "EV", icon: Zap },
];

const formatMoney = (value) => `Rs. ${Number(value || 0)}`;

const formatDistance = (distanceKm) => {
  if (distanceKm == null) {
    return "Nearby";
  }

  return `${distanceKm.toFixed(1)} km`;
};

function StatCard({ label, value, note }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.8))] p-4 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-lg font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{note}</p>
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
  const cardRefs = useRef({});

  useEffect(() => () => resetMapState(), [resetMapState]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters({ search: searchDraft });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchDraft, setFilters]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(fallbackCenter);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: "",
          label: "Your live location",
        });
      },
      () => {
        setUserLocation(fallbackCenter);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  }, [setUserLocation]);

  const queryLocation = userLocation || fallbackCity || fallbackCenter;
  const nearbyQuery = useNearbyLocations({
    lat: queryLocation.lat,
    lng: queryLocation.lng,
    radius: filters.radius,
    city: filters.search || queryLocation.city,
    type: filters.vehicleType === "all" ? undefined : filters.vehicleType,
    page: 1,
    limit: 20,
  });

  const locations = (nearbyQuery.data || []).filter((location) => {
    const search = filters.search.toLowerCase();
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
    if (!locations.length) {
      return;
    }

    const selectedStillVisible = locations.some((location) => location.id === selectedLocationId);
    if (!selectedStillVisible) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId, setSelectedLocationId]);

  useEffect(() => {
    if (!selectedLocationId) {
      return;
    }

    const card = cardRefs.current[selectedLocationId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedLocationId]);

  const selectedLocation = locations.find((location) => location.id === selectedLocationId) || null;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)] backdrop-blur sm:p-5 xl:grid-cols-[1.7fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-600">
              SahiSpot Parking
            </p>
            <h1 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
              Map-first parking discovery for drivers, owners, and EV-ready fleets.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Search live parking nearby, compare availability in one split-screen layout, and jump
              into booking-ready location details without losing map context.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <StatCard label="Coverage" value={`${locations.length} hubs`} note="in the current search" />
            <StatCard
              label="Radius"
              value={`${filters.radius} km`}
              note={userLocation?.label || "using fallback city"}
            />
            <StatCard
              label="Focused"
              value={selectedLocation ? selectedLocation.name : "No selection"}
              note={
                selectedLocation
                  ? `${selectedLocation.availableSlots} open slots in ${selectedLocation.area || selectedLocation.city || "this zone"}`
                  : "pick a hub"
              }
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.82))] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur">
            <div className="border-b border-white/10 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Search by city, area, or parking name"
                  className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400 focus:bg-white/[0.06]"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {vehicleTypes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFilters({ vehicleType: id })}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      filters.vehicleType === id
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                        : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Search radius</span>
                  <span className="font-semibold text-white">{filters.radius} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={filters.radius}
                  onChange={(event) => setFilters({ radius: Number(event.target.value) })}
                  className="accent-emerald-500"
                />
                <p className="text-xs text-slate-500">
                  Live location: {userLocation?.label || fallbackCity?.label || fallbackCenter.label}
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-20rem)] space-y-3 overflow-y-auto p-4 custom-scrollbar">
              {nearbyQuery.isLoading ? (
                <div className="flex min-h-56 items-center justify-center text-slate-500">
                  <LoaderCircle className="h-5 w-5 animate-spin text-orange-300" />
                </div>
              ) : null}

              {!nearbyQuery.isLoading && locations.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                  No parking locations matched this search. Try expanding the radius or switching
                  vehicle type.
                </div>
              ) : null}

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
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.04, duration: 0.24 }}
                      onMouseEnter={() => setHoveredLocationId(location.id)}
                      onMouseLeave={() => setHoveredLocationId(null)}
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`cursor-pointer rounded-[1.5rem] border p-4 transition ${
                        isActive
                          ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                          : isHovered
                            ? "border-white/20 bg-white/[0.08] shadow-md"
                            : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            {[location.area, location.city].filter(Boolean).join(", ") || "Featured zone"}
                          </p>
                          <h2 className="mt-1 text-lg font-semibold text-white">{location.name}</h2>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                            {location.address || "Address not yet available in the API response."}
                          </p>
                        </div>
                        <div className="w-fit rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-left text-white sm:ml-auto sm:text-right">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">From</p>
                          <p className="text-lg font-semibold">{formatMoney(location.startingPrice || location.pricePerHour)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-300" />
                          {formatDistance(location.distanceKm)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-slate-200">
                          {location.availableSlots} slots
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {location.vehicleTypes.map((type) => (
                            <span
                              key={type}
                              className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium capitalize text-slate-300"
                            >
                              {type}
                            </span>
                          ))}
                        </div>

                        <div className="grid gap-2 rounded-[1.2rem] border border-white/10 bg-slate-950/45 p-3">
                          {location.slotTypes?.length ? (
                            location.slotTypes.map((slotType) => (
                              <div
                                key={`${location.id}-${slotType.id || slotType.vehicleType}`}
                                className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                              >
                                <span className="font-medium capitalize text-white">{slotType.vehicleType}</span>
                                <span>{formatMoney(slotType.pricePerHour)}/hr</span>
                                <span className="text-slate-500">({slotType.availableSlots} available)</span>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-500">
                              Slot type pricing will appear here once available from the API.
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                            Status: <span className="capitalize text-slate-200">{location.status}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/locations/${location.id}`);
                            }}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-300"
                          >
                            View
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </aside>

          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.6)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  Live map view
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {selectedLocation ? selectedLocation.name : "Explore nearby parking"}
                </h2>
              </div>
              <div className="text-left text-sm text-white/70 sm:text-right">
                <p>{selectedLocation ? `${selectedLocation.availableSlots} slots open` : "Select a marker"}</p>
                <p>
                  {selectedLocation
                    ? `${formatMoney(selectedLocation.startingPrice || selectedLocation.pricePerHour)}/hour start`
                    : "OpenStreetMap"}
                </p>
              </div>
            </div>

            <Suspense
              fallback={
                <div className="flex h-[65vh] items-center justify-center text-white/70">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                </div>
              }
            >
              <LazyMapView
                className="h-[65vh] w-full"
                locations={locations}
                userLocation={userLocation}
                selectedLocationId={selectedLocationId}
                hoveredLocationId={hoveredLocationId}
                onSelectLocation={setSelectedLocationId}
                onHoverLocation={setHoveredLocationId}
                onBookNow={(location) => navigate(`/locations/${location.id}`)}
              />
            </Suspense>
          </section>
        </div>
      </section>
    </div>
  );
}
