import { Suspense, lazy, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
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
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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

function Badge({ icon: Icon, text, variant = "default" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
      variant === "primary" 
        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
        : "border-white/10 bg-white/[0.04] text-slate-300"
    }`}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-5 transition hover:scale-[1.02]">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-emerald-400" />}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">
              {review.userName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-white">{review.userName || "Anonymous User"}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{review.comment}</p>
        </div>
      </div>
    </motion.article>
  );
}

function PricingCard({ slotType, isSelected, onSelect, Icon }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative w-full rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
          : "border-white/10 bg-white/[0.04] hover:border-white/20"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-400 flex items-center justify-center">
          <CheckCircle className="h-3.5 w-3.5 text-slate-950" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-emerald-400" />
            <p className="text-base font-semibold capitalize text-white">{slotType.vehicleType}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
              <Clock className="h-3 w-3" />
              {slotType.availableSlots} slots left
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatCurrency(slotType.pricePerHour)}</p>
          <p className="text-xs text-slate-400">/ hour</p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
        <div>
          <p className="text-xs text-slate-500">Daily</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(slotType.pricePerDay)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Monthly</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(slotType.pricePerMonth)}</p>
        </div>
      </div>
    </motion.button>
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
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
    if (!slotTypes.length) return;
    const nextSlotType = availableSlotTypes[0] || slotTypes[0];
    setSelectedSlotTypeId((current) => current || nextSlotType?.id || null);
    setSelectedVehicleType((current) => current || nextSlotType?.vehicleType || "");
  }, [slotTypes, availableSlotTypes]);

  useEffect(() => {
    if (!selectedSlotType) return;
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

  
  const finalPayable = Number((basePrice).toFixed(2));
  const VehicleIcon = vehicleIconMap[selectedVehicleType] || Car;
  const gallery =
    location?.images?.length > 0
      ? location.images
      : [
          {
            id: "placeholder",
            url: "https://placehold.co/800x600/e2e8f0/64748b?text=SahiSpot+Parking",
            alt: "Placeholder parking",
          },
        ];

  useEffect(() => {
    setActiveImageIndex((current) => {
      if (!gallery.length) return 0;
      if (current >= gallery.length) return 0;
      return current;
    });
  }, [gallery.length]);

  const handleBooking = async () => {
    setFormError("");

    if (!location || !selectedSlotType) {
      const message = "Please select a vehicle type before booking.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (Number(selectedSlotType.availableSlots || 0) <= 0) {
      const message = "Sorry, no slots available for the selected vehicle type.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (!startTime) {
      const message = "Please select a valid start time.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (durationType === "hour" && (!totalHours || Number(totalHours) < 1)) {
      const message = "Please enter valid total hours for hourly booking.";
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
    toast.success("Booking created! Redirecting to payment...");
    navigate(`/payment/${bookingId}?amount=${finalPayable}`);
  };

  if (detailsQuery.isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <LoaderCircle className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="text-slate-400">Loading parking details...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-slate-500" />
        <p className="text-slate-400">Could not load parking location details.</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const activeImage = gallery[activeImageIndex] || gallery[0];
  const showPrevImage = () => {
    setActiveImageIndex((current) => {
      if (!gallery.length) return 0;
      return current === 0 ? gallery.length - 1 : current - 1;
    });
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => {
      if (!gallery.length) return 0;
      return current === gallery.length - 1 ? 0 : current + 1;
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),transparent_40%),linear-gradient(180deg,#0a0f1a_0%,#0c111c_50%,#05080f_100%)]">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge icon={Star} text={location.averageRating > 0 ? `${location.averageRating.toFixed(1)} ★` : "New"} variant="primary" />
                <Badge icon={ShieldCheck} text={`${location.availableSlots} slots available`} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {location.name}
              </h1>
              <div className="mt-4 flex items-start gap-2 text-slate-300">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-sm leading-6">
                  {location.address || [location.area, location.city].filter(Boolean).join(", ") || "Location details available"}
                </p>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-400">
                {location.description ||
                  "Secure parking facility with 24/7 surveillance, easy access, and competitive rates. Perfect for daily commuters and long-term parking needs."}
              </p>
            </div>

            <div className="grid grid-cols-2 divide-y divide-white/10 border-t border-white/10 bg-slate-950/30 lg:border-l lg:border-t-0">
              <MetricCard title="Starting Price" value={formatCurrency(location.startingPrice || location.pricePerHour)} icon={DollarSign} />
              <MetricCard title="Total Reviews" value={location.reviewCount || 0} icon={Star} />
              <MetricCard title="Vehicle Types" value={location.vehicleTypes?.length || 0} icon={Car} />
              <MetricCard title="Status" value={location.status || "Active"} icon={CheckCircle} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Map Section */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  Location Map
                </h2>
              </div>
              <Suspense
                fallback={
                  <div className="flex h-[300px] items-center justify-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-emerald-500" />
                  </div>
                }
              >
                <LazyMapView
                  className="h-[300px] w-full"
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

            {/* Image Gallery */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <ImageIcon className="h-5 w-5 text-emerald-400" />
                  Gallery
                </h2>
              </div>
              <div className="p-5">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
                  <motion.img
                    key={activeImage?.id || activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={activeImage?.url}
                    alt={activeImage?.alt || "Parking image"}
                    className="h-80 w-full object-cover"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={showPrevImage}
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-white backdrop-blur transition hover:bg-slate-900"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={showNextImage}
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-white backdrop-blur transition hover:bg-slate-900"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        {activeImageIndex + 1} / {gallery.length}
                      </div>
                    </>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {gallery.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          index === activeImageIndex ? "border-emerald-400" : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <MessageSquareText className="h-5 w-5 text-emerald-400" />
                  Driver Reviews
                  <span className="ml-2 text-sm font-normal text-slate-400">({location.reviewCount || 0})</span>
                </h2>
              </div>
              <div className="max-h-[400px] space-y-3 overflow-y-auto p-5">
                {location.reviews?.length > 0 ? (
                  location.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center">
                    <MessageSquareText className="h-12 w-12 text-slate-600" />
                    <p className="text-sm text-slate-400">No reviews yet</p>
                    <p className="text-xs text-slate-500">Be the first to review this parking location</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          {!isOwner && (
            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur">
                <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent p-5">
                  <h2 className="text-xl font-bold text-white">Book Now</h2>
                  <p className="mt-1 text-sm text-slate-400">Secure your spot instantly</p>
                </div>

                <div className="space-y-5 p-5">
                  {/* Vehicle Type Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-white">Select Vehicle Type</label>
                    <div className="space-y-2">
                      {slotTypes.map((slotType) => {
                        const isSelected = String(selectedSlotType?.id) === String(slotType.id);
                        const Icon = vehicleIconMap[slotType.vehicleType] || Car;
                        return (
                          <PricingCard
                            key={slotType.id}
                            slotType={slotType}
                            isSelected={isSelected}
                            onSelect={() => {
                              setSelectedSlotTypeId(slotType.id);
                              setSelectedVehicleType(slotType.vehicleType);
                              setFormError("");
                            }}
                            Icon={Icon}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-white">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "hour", label: "Hourly", icon: Clock },
                        { value: "day", label: "Daily", icon: CalendarClock },
                        { value: "month", label: "Monthly", icon: CalendarClock },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDurationType(option.value)}
                          className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${
                            durationType === option.value
                              ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                              : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date/Time Selection */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-white">Start Time</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
                    />
                  </div>

                  {durationType === "hour" && (
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-white">Total Hours</label>
                      <input
                        type="number"
                        min="1"
                        value={totalHours}
                        onChange={(e) => {
                          setTotalHours(e.target.value);
                          setFormError("");
                        }}
                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white outline-none transition focus:border-emerald-400"
                      />
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="mb-3 text-sm font-semibold text-white">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      
                     
                      <div className="border-t border-white/10 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">Total Payable</span>
                          <span className="text-xl text-emerald-400">{formatCurrency(finalPayable)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                      <AlertCircle className="h-4 w-4" />
                      {formError}
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={createBooking.isPending || !slotTypes.length || Number(selectedSlotType?.availableSlots || 0) <= 0}
                    className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createBooking.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : Number(selectedSlotType?.availableSlots || 0) <= 0 ? (
                      "No Slots Available"
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Secure payment • Free cancellation • 24/7 support
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}