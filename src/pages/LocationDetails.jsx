import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bike,
  CalendarClock,
  Car,
  ImageIcon,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCreateBooking, useLocationDetails } from "@/hooks/useParkingQueries";
import { canManageParking } from "@/lib/auth";

const LazyMapView = lazy(() => import("@/components/map/MapView"));

const formatDateTimeInput = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(0)}`;

const vehicleIconMap = {
  car: Car,
  bike: Bike,
  truck: Truck,
  ev: Zap,
};

const addDurationToDate = (dateString, durationType, totalHours) => {
  const baseDate = new Date(dateString);

  if (Number.isNaN(baseDate.getTime())) {
    return dateString;
  }

  const nextDate = new Date(baseDate);

  if (durationType === "month") {
    nextDate.setMonth(nextDate.getMonth() + 1);
    return formatDateTimeInput(nextDate);
  }

  if (durationType === "day") {
    nextDate.setDate(nextDate.getDate() + 1);
    return formatDateTimeInput(nextDate);
  }

  nextDate.setHours(nextDate.getHours() + Math.max(1, Number(totalHours || 1)));
  return formatDateTimeInput(nextDate);
};

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-200 sm:w-auto sm:rounded-full">
      <Icon className="h-4 w-4 text-emerald-300" />
      {text}
    </span>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-slate-950 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">{title}</p>
      <p className="mt-3 text-xl font-semibold">{value}</p>
    </div>
  );
}

export default function LocationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [startTime, setStartTime] = useState(formatDateTimeInput(new Date()));
  const [selectedSlotTypeId, setSelectedSlotTypeId] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [durationType, setDurationType] = useState("hour");
  const [totalHours, setTotalHours] = useState(2);
  const [formError, setFormError] = useState("");
  const detailsQuery = useLocationDetails(id);
  const createBooking = useCreateBooking();
  const isOwner = canManageParking(user?.role);

  const location = detailsQuery.data;
  const slotTypes = location?.slotTypes || [];
  const availableSlotTypes = slotTypes.filter((slotType) => Number(slotType.availableSlots || 0) > 0);
  const selectedSlotType =
    slotTypes.find((slotType) => String(slotType.id) === String(selectedSlotTypeId)) ||
    slotTypes.find((slotType) => slotType.vehicleType === selectedVehicleType) ||
    slotTypes[0] ||
    null;

  useEffect(() => {
    if (!slotTypes.length) {
      return;
    }

    const nextSlotType = availableSlotTypes[0] || slotTypes[0];
    setSelectedSlotTypeId((current) => current || nextSlotType?.id || null);
    setSelectedVehicleType((current) => current || nextSlotType?.vehicleType || "");
  }, [slotTypes, availableSlotTypes]);

  useEffect(() => {
    if (!selectedSlotType) {
      return;
    }

    setSelectedSlotTypeId(selectedSlotType.id || null);
    setSelectedVehicleType(selectedSlotType.vehicleType || "");
  }, [selectedSlotType?.id, selectedSlotType?.vehicleType]);

  const endTime = addDurationToDate(startTime, durationType, totalHours);
  const basePrice =
    durationType === "month"
      ? Number(selectedSlotType?.pricePerMonth || 0)
      : durationType === "day"
        ? Number(selectedSlotType?.pricePerDay || 0)
        : Number(selectedSlotType?.pricePerHour || 0) * Math.max(1, Number(totalHours || 1));
  const platformFee = Number((basePrice * 0.1).toFixed(2));
  const finalPayable = Number((basePrice + platformFee).toFixed(2));
  const VehicleIcon = vehicleIconMap[selectedVehicleType] || Car;

  const handleBooking = async () => {
    setFormError("");

    if (!location || !selectedSlotType) {
      const message = "Choose a vehicle type before booking.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (Number(selectedSlotType.availableSlots || 0) <= 0) {
      const message = "No slots available for the selected vehicle type.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (!startTime) {
      const message = "Select a valid start time.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (durationType === "hour" && (!totalHours || Number(totalHours) < 1)) {
      const message = "Enter valid total hours for hourly booking.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (basePrice <= 0) {
      const message = "Pricing is unavailable for this vehicle type right now.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const booking = await createBooking.mutateAsync({
      location_id: location.id,
      slot_type_id: selectedSlotType.id,
      vehicle_type: selectedVehicleType,
      duration_type: durationType,
      total_hours: durationType === "hour" ? Number(totalHours) : undefined,
      start_time: startTime,
      end_time: endTime,
    });

    const bookingId = booking?.id || booking?.booking_id || location.id;
    toast.success("Booking created. Continuing to payment.");
    navigate(`/payment/${bookingId}?amount=${finalPayable}`);
  };

  if (detailsQuery.isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-slate-500">
        We could not load this parking location.
      </div>
    );
  }

  const gallery =
    location.images.length > 0
      ? location.images
      : [
          {
            id: "placeholder",
            url: "https://placehold.co/800x600/e2e8f0/64748b?text=SahiSpot+Parking",
            alt: "Placeholder parking",
          },
        ];

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="p-5 sm:p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-600">
                Location details
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
                {location.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {location.description ||
                  "Secure access, straightforward navigation, and live parking visibility for every arrival window."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                <Badge
                  icon={MapPin}
                  text={
                    location.address ||
                    [location.area, location.city].filter(Boolean).join(", ") ||
                    "City parking district"
                  }
                />
                <Badge
                  icon={ShieldCheck}
                  text={`${location.availableSlots} live slots available`}
                />
                <Badge
                  icon={Star}
                  text={
                    location.averageRating > 0
                      ? `${location.averageRating.toFixed(1)} rating`
                      : "New location"
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
              <MetricCard title="Starting / hour" value={formatCurrency(location.startingPrice || location.pricePerHour)} />
              <MetricCard title="Reviews" value={`${location.reviewCount}`} />
              <MetricCard title="Vehicle types" value={location.vehicleTypes.join(", ")} />
              <MetricCard
                title="Area / status"
                value={[location.area || "Area pending", location.status].filter(Boolean).join(" · ")}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold text-white">Parking map</h2>
              </div>
              <Suspense
                fallback={
                  <div className="flex h-[24rem] items-center justify-center text-slate-500">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                  </div>
                }
              >
                <LazyMapView
                  className="h-[24rem] w-full"
                  locations={[location]}
                  userLocation={{ lat: location.latitude, lng: location.longitude }}
                  selectedLocationId={location.id}
                  hoveredLocationId={location.id}
                  onSelectLocation={() => {}}
                  onHoverLocation={() => {}}
                  onBookNow={() => {}}
                />
              </Suspense>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <ImageIcon className="h-5 w-5 text-emerald-300" />
                  Parking images
                </h2>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2">
                {gallery.map((image) => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.02 }}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/45"
                  >
                    <img src={image.url} alt={image.alt} className="h-56 w-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <MessageSquareText className="h-5 w-5 text-emerald-300" />
                  Driver reviews
                </h2>
              </div>
              <div className="space-y-4 p-5">
                {location.reviews.length ? (
                  location.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-[1.4rem] border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{review.userName}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{review.comment}</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-amber-200">
                          {review.rating}/5
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400">
                    Reviews will appear here once drivers start rating this location.
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {!isOwner ? (
            <section className="sticky top-24 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.65)]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold">Book this location</h2>
                <p className="mt-1 text-sm text-white/65">
                  Choose vehicle type, duration, and arrival window to continue.
                </p>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium text-white/85">Vehicle type</h3>
                    <span className="text-sm text-white/60">{slotTypes.length} pricing options</span>
                  </div>
                  <div className="grid gap-3">
                    {slotTypes.length ? (
                      slotTypes.map((slotType) => {
                        const active =
                          String(selectedSlotType?.id || "") === String(slotType.id || "") ||
                          selectedVehicleType === slotType.vehicleType;
                        const Icon = vehicleIconMap[slotType.vehicleType] || Car;

                        return (
                          <button
                            key={`${slotType.id || slotType.vehicleType}`}
                            type="button"
                            onClick={() => {
                              setSelectedSlotTypeId(slotType.id);
                              setSelectedVehicleType(slotType.vehicleType);
                              setFormError("");
                            }}
                            className={`rounded-[1.2rem] border px-4 py-3 text-left transition ${
                              active
                                ? "border-emerald-400 bg-emerald-400/15"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="inline-flex items-center gap-2 text-sm font-semibold capitalize text-white">
                                  <Icon className="h-4 w-4 text-emerald-300" />
                                  {slotType.vehicleType}
                                </p>
                                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/55">
                                  {slotType.availableSlots} available of {slotType.totalSlots}
                                </p>
                              </div>
                              <div className="text-left text-sm text-white/70 sm:text-right">
                                <p>{formatCurrency(slotType.pricePerHour)}/hr</p>
                                <p>{formatCurrency(slotType.pricePerDay)}/day</p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/5 px-4 py-5 text-sm text-white/60">
                        No slot types available for this location yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-2 inline-flex items-center gap-2 font-medium text-white/80">
                      <VehicleIcon className="h-4 w-4 text-emerald-300" />
                      Vehicle
                    </span>
                    <select
                      value={selectedVehicleType}
                      onChange={(event) => {
                        const nextType = slotTypes.find(
                          (slotType) => slotType.vehicleType === event.target.value
                        );
                        setSelectedVehicleType(event.target.value);
                        setSelectedSlotTypeId(nextType?.id || null);
                        setFormError("");
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    >
                      {slotTypes.map((slotType) => (
                        <option
                          key={`vehicle-${slotType.id || slotType.vehicleType}`}
                          value={slotType.vehicleType}
                          className="bg-slate-900 text-white"
                        >
                          {slotType.vehicleType}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    <span className="mb-2 inline-flex items-center gap-2 font-medium text-white/80">
                      <CalendarClock className="h-4 w-4 text-emerald-300" />
                      Duration
                    </span>
                    <select
                      value={durationType}
                      onChange={(event) => {
                        setDurationType(event.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    >
                      <option value="hour" className="bg-slate-900 text-white">Hour</option>
                      <option value="day" className="bg-slate-900 text-white">Day</option>
                      <option value="month" className="bg-slate-900 text-white">Month</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-2 inline-flex items-center gap-2 font-medium text-white/80">
                      <CalendarClock className="h-4 w-4 text-emerald-300" />
                      Start
                    </span>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(event) => {
                        setStartTime(event.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    />
                  </label>

                  {durationType === "hour" ? (
                    <label className="text-sm">
                      <span className="mb-2 inline-flex items-center gap-2 font-medium text-white/80">
                        <CalendarClock className="h-4 w-4 text-emerald-300" />
                        Total hours
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={totalHours}
                        onChange={(event) => {
                          setTotalHours(event.target.value);
                          setFormError("");
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                      />
                    </label>
                  ) : (
                    <label className="text-sm">
                      <span className="mb-2 inline-flex items-center gap-2 font-medium text-white/80">
                        <CalendarClock className="h-4 w-4 text-emerald-300" />
                        End
                      </span>
                      <input
                        type="datetime-local"
                        value={endTime}
                        readOnly
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 outline-none"
                      />
                    </label>
                  )}
                </div>

                <div className="rounded-[1.5rem] bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Selected type</span>
                    <span className="text-right capitalize">{selectedVehicleType || "Not selected"}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Available slots</span>
                    <span>{selectedSlotType?.availableSlots || 0}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Hourly price</span>
                    <span className="text-right">{formatCurrency(selectedSlotType?.pricePerHour)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Daily price</span>
                    <span className="text-right">{formatCurrency(selectedSlotType?.pricePerDay)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Monthly price</span>
                    <span className="text-right">{formatCurrency(selectedSlotType?.pricePerMonth)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Booking total</span>
                    <span className="text-right">{formatCurrency(basePrice)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/70">
                    <span>Platform fee (10%)</span>
                    <span className="text-right">{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-white/70">Final payable</span>
                      <span className="text-right text-xl font-semibold sm:text-2xl">{formatCurrency(finalPayable)}</span>
                    </div>
                  </div>
                </div>

                {formError ? (
                  <div className="rounded-[1.2rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {formError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={
                    createBooking.isPending ||
                    !slotTypes.length ||
                    Number(selectedSlotType?.availableSlots || 0) <= 0
                  }
                  className="w-full rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createBooking.isPending
                    ? "Creating booking..."
                    : Number(selectedSlotType?.availableSlots || 0) <= 0
                      ? "No slots available"
                      : "Continue to payment"}
                </button>
              </div>
            </section>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
