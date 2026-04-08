import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/services/booking.service";
import { locationService } from "@/services/location.service";

const normalizeSlotTypePayload = (slotType = {}) => {
  const vehicleType = slotType.vehicle_type ?? slotType.vehicleType ?? "car";
  const totalSlots = Number(slotType.total_slots ?? slotType.totalSlots ?? 0);
  const availableSlots = Number(
    slotType.available_slots ?? slotType.availableSlots ?? totalSlots
  );
  const pricePerHour = Number(slotType.price_per_hour ?? slotType.pricePerHour ?? 0);
  const pricePerDay = Number(slotType.price_per_day ?? slotType.pricePerDay ?? 0);
  const pricePerMonth = Number(slotType.price_per_month ?? slotType.pricePerMonth ?? 0);

  return {
    vehicle_type: vehicleType,
    vehicleType,
    total_slots: totalSlots,
    totalSlots,
    available_slots: availableSlots,
    availableSlots,
    price_per_hour: pricePerHour,
    pricePerHour,
    price_per_day: pricePerDay,
    pricePerDay,
    price_per_month: pricePerMonth,
    pricePerMonth,
  };
};

const buildLocationPayload = (location = {}) => {
  const slotTypes = (location.slot_types ?? location.slotTypes ?? []).map(normalizeSlotTypePayload);
  const totalSlots = slotTypes.reduce(
    (sum, slotType) => sum + Number(slotType.total_slots || 0),
    0
  );
  const availableSlots =
    location.available_slots ??
    location.availableSlots ??
    (slotTypes.length
      ? slotTypes.reduce((sum, slotType) => sum + Number(slotType.available_slots || 0), 0)
      : undefined);
  const hourlyPrices = slotTypes
    .map((slotType) => Number(slotType.price_per_hour))
    .filter((value) => Number.isFinite(value) && value >= 0);
  const startingPrice = hourlyPrices.length ? Math.min(...hourlyPrices) : 0;
  const latitude = location.latitude ?? location.lat;
  const longitude = location.longitude ?? location.lng;
  const payload = {
    name: location.name,
    description: location.description || "Added from the parking manager",
    address: location.address || "Address pending",
    city: location.city || "New Delhi",
    state: location.state || "Delhi",
  };

  if (latitude !== undefined && latitude !== null && latitude !== "") {
    payload.latitude = Number(latitude);
  }

  if (longitude !== undefined && longitude !== null && longitude !== "") {
    payload.longitude = Number(longitude);
  }

  if (Number.isFinite(Number(availableSlots))) {
    payload.available_slots = Number(availableSlots);
    payload.availableSlots = Number(availableSlots);
  }

  if (slotTypes.length) {
    payload.total_slots = totalSlots;
    payload.totalSlots = totalSlots;
    payload.price_per_hour = startingPrice;
    payload.pricePerHour = startingPrice;
    payload.slot_types = slotTypes;
    payload.slotTypes = slotTypes;
  }

  return payload;
};

export const useNearbyLocations = (params) =>
  useQuery({
    queryKey: ["nearbyLocations", params],
    queryFn: () => locationService.getNearbyLocations(params),
    staleTime: 30_000,
  });

export const useParkingLocations = (lat = 28.6139, lng = 77.209, radius = 10) =>
  useNearbyLocations({ lat, lng, radius, page: 1, limit: 20 });

export const useLocationDetails = (id) =>
  useQuery({
    queryKey: ["locationDetails", id],
    queryFn: () => locationService.getLocationDetails(id),
    enabled: Boolean(id),
  });

export const useLocationSlots = (locationId) =>
  useQuery({
    queryKey: ["locationSlots", locationId],
    queryFn: () => locationService.getLocationSlots(locationId),
    enabled: Boolean(locationId),
  });

export const useLocationReviews = (locationId) =>
  useQuery({
    queryKey: ["locationReviews", locationId],
    queryFn: () => locationService.getLocationReviews(locationId),
    enabled: Boolean(locationId),
  });

export const useLocationImages = (locationId) =>
  useQuery({
    queryKey: ["locationImages", locationId],
    queryFn: () => locationService.getLocationImages(locationId),
    enabled: Boolean(locationId),
  });

export const useMyParkingLocations = () =>
  useQuery({
    queryKey: ["ownerLocations"],
    queryFn: () => locationService.getMyLocations(),
  });

export const useCreateBooking = () =>
  useMutation({
    mutationFn: bookingService.createBooking,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to create booking right now.");
    },
  });

export const useAddParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location) => {
      const createdLocation = await locationService.createLocation(buildLocationPayload(location));

      if (location.images?.length && createdLocation?.id) {
        await Promise.all(
          location.images.map((file) => locationService.uploadLocationImage(createdLocation.id, file))
        );
      }

      return createdLocation;
    },
    onSuccess: () => {
      toast.success("Parking location added.");
      queryClient.invalidateQueries({ queryKey: ["nearbyLocations"] });
      queryClient.invalidateQueries({ queryKey: ["ownerLocations"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to add this location.");
    },
  });
};

export const useUpdateParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, images, ...location }) => {
      const updatedLocation = await locationService.updateLocation(
        id,
        buildLocationPayload(location)
      );

      if (images?.length && updatedLocation?.id) {
        await Promise.all(
          images.map((file) => locationService.uploadLocationImage(updatedLocation.id, file))
        );
      }

      return updatedLocation;
    },
    onSuccess: (_, variables) => {
      toast.success("Parking location updated.");
      queryClient.invalidateQueries({ queryKey: ["ownerLocations"] });
      queryClient.invalidateQueries({ queryKey: ["nearbyLocations"] });
      queryClient.invalidateQueries({ queryKey: ["locationDetails", String(variables.id)] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to update this location.");
    },
  });
};

export const useDeleteParkingLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId) => locationService.deleteLocation(locationId),
    onSuccess: () => {
      toast.success("Parking location deleted.");
      queryClient.invalidateQueries({ queryKey: ["ownerLocations"] });
      queryClient.invalidateQueries({ queryKey: ["nearbyLocations"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to delete this location.");
    },
  });
};
