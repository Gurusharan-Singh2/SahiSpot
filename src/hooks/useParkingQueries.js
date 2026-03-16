import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphQLClient } from '../lib/graphql-client';
import { gql } from 'graphql-request';
import { toast } from 'sonner';

// Queries
const GET_PARKING_LOCATIONS = gql`
  query GetParkingLocations {
    parkingLocations {
      id
      name
      latitude
      longitude
      address
      price
      average_rating
      review_count
      images {
        url
      }
    }
  }
`;

const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    myBookings {
        id
        start_time
        end_time
        total_fee
        parkingLocation {
            name
            address
        }
    }
  }
`;

// Mutations
const ADD_PARKING_LOCATION = gql`
  mutation AddParkingLocation($name: String!, $latitude: Float!, $longitude: Float!, $address: String, $price: Float!) {
    addParkingLocation(name: $name, latitude: $latitude, longitude: $longitude, address: $address, price: $price) {
      id
      name
    }
  }
`;

const BOOK_SLOT = gql`
  mutation BookSlot($parkingLocationId: Int!, $startTime: String!, $endTime: String!, $vehicleType: String!) {
    bookSlot(parkingLocationId: $parkingLocationId, startTime: $startTime, endTime: $endTime, vehicleType: $vehicleType) {
      id
      parkingLocation {
        name
      }
    }
  }
`;

export const useParkingLocations = () => {
  return useQuery({
    queryKey: ['parkingLocations'],
    queryFn: async () => {
      const data = await graphQLClient.request(GET_PARKING_LOCATIONS);
      // Map to format expected by UI (lat/lng -> lat/lng)
      return data.parkingLocations.map(loc => ({
        ...loc,
        lat: loc.latitude,
        lng: loc.longitude,
        available: true // Mock availability for now
      }));
    }
  });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: ['myBookings'],
        queryFn: async () => {
           const data = await graphQLClient.request(GET_MY_BOOKINGS);
           return data.myBookings;
        }
    });
}

export const useAddParkingLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars) => {
      return await graphQLClient.request(ADD_PARKING_LOCATION, vars);
    },
    onSuccess: () => {
      toast.success('Parking location added!');
      queryClient.invalidateQueries({ queryKey: ['parkingLocations'] });
    },
    onError: (error) => {
        toast.error('Failed to add location: ' + error.message);
    }
  });
};

export const useBookSpot = () => {
  return useMutation({
    mutationFn: async (vars) => {
      return await graphQLClient.request(BOOK_SLOT, vars);
    },
    onSuccess: (data) => {
      toast.success(`Booked spot at ${data.bookSlot.parkingLocation.name}!`);
    },
    onError: (error) => {
        toast.error('Booking failed: ' + error.message);
    }
  });
};
