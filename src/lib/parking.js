const FALLBACK_CENTER = {
  lat: 28.6139,
  lng: 77.209,
  city: "New Delhi",
  label: "Connaught Place, New Delhi",
};

const getFirstNumber = (...values) => {
  for (const value of values) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const getFirstString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

export const extractPayload = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  return (
    response.data ??
    response.locations ??
    response.parkingLocations ??
    response.location ??
    response.result ??
    response.results ??
    response.items ??
    response.rows ??
    response
  );
};

export const normalizeVehicleType = (value) => {
  const raw = String(value || "").toLowerCase();

  if (raw.includes("bike") || raw.includes("two")) {
    return "bike";
  }

  if (raw.includes("truck")) {
    return "truck";
  }

  if (raw.includes("ev") || raw.includes("electric")) {
    return "ev";
  }

  return "car";
};

export const normalizeSlotType = (slotType = {}) => ({
  id: String(slotType.id ?? slotType.slot_type_id ?? slotType.slotTypeId ?? ""),
  vehicleType: normalizeVehicleType(slotType.vehicle_type ?? slotType.vehicleType ?? slotType.type),
  status: getFirstString(slotType.status, slotType.slot_status, "available").toLowerCase(),
  totalSlots:
    getFirstNumber(slotType.total_slots, slotType.totalSlots, slotType.slot_count, slotType.slotCount) ?? 0,
  availableSlots:
    getFirstNumber(
      slotType.available_slots,
      slotType.availableSlots,
      slotType.available_count,
      slotType.availableCount
    ) ?? 0,
  pricePerHour:
    getFirstNumber(slotType.price_per_hour, slotType.pricePerHour, slotType.hour_price) ?? 0,
  pricePerDay:
    getFirstNumber(slotType.price_per_day, slotType.pricePerDay, slotType.day_price) ?? 0,
  pricePerMonth:
    getFirstNumber(slotType.price_per_month, slotType.pricePerMonth, slotType.month_price) ?? 0,
  raw: slotType,
});

export const normalizeLocation = (location = {}) => {
  const latitude = getFirstNumber(
    location.latitude,
    location.lat,
    location.location?.latitude,
    location.location?.lat
  );
  const longitude = getFirstNumber(
    location.longitude,
    location.lng,
    location.lon,
    location.location?.longitude,
    location.location?.lng
  );

  const normalizedSlotTypes = Array.isArray(location.slot_types)
    ? location.slot_types.map(normalizeSlotType).filter((slotType) => slotType.id || slotType.vehicleType)
    : Array.isArray(location.slotTypes)
      ? location.slotTypes.map(normalizeSlotType).filter((slotType) => slotType.id || slotType.vehicleType)
      : [];

  const totalSlots = getFirstNumber(
    location.total_slots,
    location.totalSlots,
    location.slot_count,
    location.slotCount
  ) ?? normalizedSlotTypes.reduce((sum, slotType) => sum + Number(slotType.totalSlots || 0), 0);
  const availableSlots = getFirstNumber(
    location.available_slots,
    location.availableSlots,
    location.available_count,
    location.availableCount,
    location.slots_available
  ) ?? normalizedSlotTypes.reduce((sum, slotType) => sum + Number(slotType.availableSlots || 0), 0);

  const fallbackType = normalizeVehicleType(location.type);
  const vehicleTypes = Array.isArray(location.vehicleTypes)
    ? location.vehicleTypes.map(normalizeVehicleType)
    : Array.isArray(location.vehicle_types)
      ? location.vehicle_types.map(normalizeVehicleType)
      : normalizedSlotTypes.length
        ? normalizedSlotTypes.map((slotType) => slotType.vehicleType)
      : totalSlots || availableSlots
        ? ["car", "bike", "truck", "ev"]
        : [fallbackType];

  const startingPriceFromSlotTypes = normalizedSlotTypes
    .map((slotType) => Number(slotType.pricePerHour))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((left, right) => left - right)[0];

  const pricePerHour =
    getFirstNumber(
      location.price_per_hour,
      location.pricePerHour,
      location.price,
      location.rate,
      startingPriceFromSlotTypes
    ) ?? 50;

  return {
    id: String(location.id ?? location.location_id ?? location.locationId ?? ""),
    name: getFirstString(location.name, location.title, "Untitled parking hub"),
    description: getFirstString(location.description, location.summary),
    address: getFirstString(location.address, location.street, location.full_address),
    area: getFirstString(location.area, location.locality, location.zone),
    city: getFirstString(location.city, location.location?.city),
    state: getFirstString(location.state, location.location?.state),
    status: getFirstString(location.status, location.approval_status, "approved").toLowerCase(),
    latitude: latitude ?? FALLBACK_CENTER.lat,
    longitude: longitude ?? FALLBACK_CENTER.lng,
    lat: latitude ?? FALLBACK_CENTER.lat,
    lng: longitude ?? FALLBACK_CENTER.lng,
    pricePerHour,
    startingPrice: pricePerHour,
    price: pricePerHour,
    totalSlots: totalSlots ?? 0,
    availableSlots: availableSlots ?? Math.max(totalSlots ?? 0, 0),
    available: (availableSlots ?? Math.max(totalSlots ?? 0, 0)) > 0,
    distanceKm:
      getFirstNumber(location.distance_km, location.distanceKm, location.distance) ?? null,
    averageRating:
      getFirstNumber(location.average_rating, location.averageRating, location.rating) ?? 0,
    reviewCount:
      getFirstNumber(location.review_count, location.reviewCount, location.total_reviews) ?? 0,
    vehicleTypes: [...new Set(vehicleTypes)].filter(Boolean),
    slotTypes: normalizedSlotTypes,
    images: Array.isArray(location.images) ? location.images.map(normalizeImage).filter(Boolean) : [],
    reviews: Array.isArray(location.reviews)
      ? location.reviews.map(normalizeReview).filter(Boolean)
      : [],
    raw: location,
  };
};

export const normalizeSlot = (slot = {}) => {
  const isAvailableValue =
    slot.is_available ?? slot.isAvailable ?? slot.available ?? slot.status === "available";

  return {
    id: String(slot.id ?? slot.slot_id ?? slot.slotId ?? ""),
    slotNumber: getFirstString(slot.slot_number, slot.slotNumber, slot.code, slot.name),
    type: normalizeVehicleType(slot.type),
    isAvailable: Boolean(isAvailableValue),
    pricePerHour:
      getFirstNumber(slot.price_per_hour, slot.pricePerHour, slot.price, slot.rate) ?? null,
    raw: slot,
  };
};

export const normalizeBooking = (booking = {}) => {
  const location = normalizeLocation(
    booking.location ??
      booking.parking_location ??
      booking.parkingLocation ??
      booking.location_details ??
      {}
  );

  const slotType = normalizeSlotType(
    booking.slot_type ?? booking.slotType ?? booking.parking_slot_type ?? {}
  );

  return {
    id: String(booking.id ?? booking.booking_id ?? booking.bookingId ?? ""),
    locationId: String(booking.location_id ?? booking.locationId ?? location.id ?? ""),
    locationName:
      getFirstString(
        booking.location_name,
        booking.locationName,
        location.name
      ) || "Parking location",
    locationAddress: getFirstString(
      booking.location_address,
      booking.locationAddress,
      location.address
    ),
    vehicleType: normalizeVehicleType(
      booking.vehicle_type ?? booking.vehicleType ?? slotType.vehicleType
    ),
    durationType: getFirstString(
      booking.duration_type,
      booking.durationType,
      "hour"
    ).toLowerCase(),
    totalHours: getFirstNumber(booking.total_hours, booking.totalHours) ?? 0,
    startTime: getFirstString(booking.start_time, booking.startTime),
    endTime: getFirstString(booking.end_time, booking.endTime),
    status: getFirstString(booking.status, booking.booking_status, "pending").toLowerCase(),
    totalPrice:
      getFirstNumber(
        booking.total_price,
        booking.totalPrice,
        booking.amount,
        booking.total_amount
      ) ?? 0,
    platformFee:
      getFirstNumber(booking.platform_fee, booking.platformFee, booking.fee) ?? 0,
    finalPayable:
      getFirstNumber(
        booking.final_payable,
        booking.finalPayable,
        booking.payable_amount
      ) ?? 0,
    parkingLocation: location.id ? location : null,
    slotType,
    raw: booking,
  };
};

export const normalizeReview = (review = {}) => ({
  id: String(review.id ?? review.review_id ?? review.reviewId ?? ""),
  rating: getFirstNumber(review.rating, review.stars) ?? 0,
  comment: getFirstString(review.comment, review.message),
  userName: getFirstString(
    review.user_name,
    review.userName,
    review.user?.name,
    review.author
  ) || "Anonymous driver",
  createdAt: getFirstString(review.created_at, review.createdAt),
  raw: review,
});

export const normalizeImage = (image = {}) => {
  const url =
    typeof image === "string"
      ? getFirstString(image)
      : getFirstString(image.url, image.image_url, image.imageUrl, image.src);
  if (!url) {
    return null;
  }

  return {
    id: String(
      typeof image === "string" ? url : image.id ?? image.image_id ?? image.imageId ?? url
    ),
    url,
    alt:
      typeof image === "string"
        ? "Parking view"
        : getFirstString(image.alt, image.caption, "Parking view"),
    raw: image,
  };
};

export const normalizeLocations = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.locations)
      ? data.locations
      : Array.isArray(data?.parkingLocations)
        ? data.parkingLocations
        : [];
  return list.map(normalizeLocation).filter((location) => location.id);
};

export const normalizeSlots = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data) ? data : Array.isArray(data?.slots) ? data.slots : [];
  return list.map(normalizeSlot).filter((slot) => slot.id);
};

export const normalizeReviews = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data) ? data : Array.isArray(data?.reviews) ? data.reviews : [];
  return list.map(normalizeReview).filter((review) => review.id);
};

export const normalizeImages = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data) ? data : Array.isArray(data?.images) ? data.images : [];
  return list.map(normalizeImage).filter(Boolean);
};

export const normalizeBookings = (payload) => {
  const data = extractPayload(payload);
  const list = Array.isArray(data) ? data : Array.isArray(data?.bookings) ? data.bookings : [];
  return list.map(normalizeBooking).filter((booking) => booking.id);
};

export const getFallbackCenter = () => FALLBACK_CENTER;
