import { create } from "zustand";
import { getFallbackCenter } from "@/lib/parking";

const fallbackCenter = getFallbackCenter();

export const useLocationStore = create((set) => ({
  userLocation: null,
  selectedLocationId: null,
  hoveredLocationId: null,
  filters: {
    vehicleType: "all",
    radius: 10,
    search: "",
  },
  fallbackCity: fallbackCenter,
  setUserLocation: (userLocation) => set({ userLocation }),
  setSelectedLocationId: (selectedLocationId) => set({ selectedLocationId }),
  setHoveredLocationId: (hoveredLocationId) => set({ hoveredLocationId }),
  setFilters: (partialFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...partialFilters,
      },
    })),
  resetMapState: () =>
    set({
      selectedLocationId: null,
      hoveredLocationId: null,
    }),
}));
