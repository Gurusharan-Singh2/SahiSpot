import { create } from "zustand";

export const useParkingStore = create((set) => ({
  parkingSpots: [
    { id: 1, lat: 28.6139, lng: 77.2090, name: "Connaught Place Parking", price: 50, available: true },
    { id: 2, lat: 28.5355, lng: 77.3910, name: "Noida Sector 18", price: 40, available: true },
    { id: 3, lat: 28.4595, lng: 77.0266, name: "Gurgaon Cyber Hub", price: 60, available: false },
  ],
  addParkingSpot: (spot) => set((state) => ({ 
    parkingSpots: [...state.parkingSpots, { ...spot, id: Date.now(), available: true }] 
  })),
  bookParkingSpot: (id) => set((state) => ({
    parkingSpots: state.parkingSpots.map((spot) => 
      spot.id === id ? { ...spot, available: false } : spot
    )
  })),
}));
