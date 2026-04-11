const FAVORITES_STORAGE_KEY = "sahispot:favorites";
const REVIEWS_STORAGE_KEY = "sahispot:local-reviews";

const readJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read ${key} from storage`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write ${key} to storage`, error);
  }
};

const normalizeFavoriteLocation = (location = {}) => ({
  id: String(location.id ?? location.locationId ?? ""),
  name: String(location.name ?? location.locationName ?? "Parking location"),
  address: String(location.address ?? location.locationAddress ?? ""),
  area: String(location.area ?? ""),
  city: String(location.city ?? ""),
  pricePerHour: Number(location.pricePerHour ?? location.startingPrice ?? location.price ?? 0),
  imageUrl:
    location.imageUrl ??
    location.images?.[0]?.url ??
    location.parkingLocation?.images?.[0]?.url ??
    "",
  addedAt: new Date().toISOString(),
});

export const getFavoriteLocations = () => {
  const favorites = readJson(FAVORITES_STORAGE_KEY, []);
  return Array.isArray(favorites) ? favorites.filter((item) => item?.id) : [];
};

export const isFavoriteLocation = (locationId) =>
  getFavoriteLocations().some((item) => String(item.id) === String(locationId));

export const saveFavoriteLocation = (location) => {
  const nextLocation = normalizeFavoriteLocation(location);
  if (!nextLocation.id) {
    return getFavoriteLocations();
  }

  const favorites = getFavoriteLocations();
  const remaining = favorites.filter((item) => String(item.id) !== nextLocation.id);
  const nextFavorites = [nextLocation, ...remaining];
  writeJson(FAVORITES_STORAGE_KEY, nextFavorites);
  return nextFavorites;
};

export const removeFavoriteLocation = (locationId) => {
  const nextFavorites = getFavoriteLocations().filter(
    (item) => String(item.id) !== String(locationId)
  );
  writeJson(FAVORITES_STORAGE_KEY, nextFavorites);
  return nextFavorites;
};

export const toggleFavoriteLocation = (location) => {
  if (isFavoriteLocation(location?.id ?? location?.locationId)) {
    return {
      isFavorite: false,
      favorites: removeFavoriteLocation(location?.id ?? location?.locationId),
    };
  }

  return {
    isFavorite: true,
    favorites: saveFavoriteLocation(location),
  };
};

export const getLocalReviews = (locationId) => {
  const reviewsByLocation = readJson(REVIEWS_STORAGE_KEY, {});
  const list = reviewsByLocation?.[String(locationId)] ?? [];
  return Array.isArray(list) ? list.filter((item) => item?.id) : [];
};

export const saveLocalReview = ({ locationId, rating, comment, userName, bookingId }) => {
  const key = String(locationId ?? "");
  if (!key) {
    return [];
  }

  const reviewsByLocation = readJson(REVIEWS_STORAGE_KEY, {});
  const nextReview = {
    id: `local-${key}-${Date.now()}`,
    rating: Number(rating || 0),
    comment: String(comment || "").trim(),
    userName: String(userName || "Anonymous driver"),
    bookingId: String(bookingId ?? ""),
    createdAt: new Date().toISOString(),
    raw: {
      source: "local",
      booking_id: bookingId,
    },
  };

  const nextReviews = [nextReview, ...(Array.isArray(reviewsByLocation[key]) ? reviewsByLocation[key] : [])];
  writeJson(REVIEWS_STORAGE_KEY, {
    ...reviewsByLocation,
    [key]: nextReviews,
  });
  return nextReviews;
};
