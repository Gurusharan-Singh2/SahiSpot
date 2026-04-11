import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Compass,
  Crosshair,
  Pencil,
  ImagePlus,
  Layers3,
  Loader2,
  MapPin,
  Plus,
  Radar,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ParkingMap from "../components/ParkingMap";
import {
  useAddParkingLocation,
  useDeleteParkingLocation,
  useMyParkingLocations,
  useParkingLocations,
  useUpdateParkingLocation,
} from "../hooks/useParkingQueries";

const vehicleTypeOptions = ["car", "bike", "truck", "ev"];

const createSlotType = (vehicleType = "car") => ({
  vehicle_type: vehicleType,
  total_slots: "1",
  price_per_hour: "",
  price_per_day: "",
  price_per_month: "",
});

const emptyForm = {
  name: "",
  description: "",
  address: "",
  area: "",
  city: "New Delhi",
  state: "Delhi",
  slot_types: [createSlotType()],
};

const createEditState = (location) => ({
  id: location.id,
  name: location.name || "",
  description: location.description || "",
  address: location.address || "",
  area: location.area || "",
  city: location.city || "New Delhi",
  state: location.state || "Delhi",
  slot_types:
    location.slotTypes?.length
      ? location.slotTypes.map((slotType) => ({
          vehicle_type: slotType.vehicleType || "car",
          total_slots: String(slotType.totalSlots ?? ""),
          price_per_hour: String(slotType.pricePerHour ?? ""),
          price_per_day: String(slotType.pricePerDay ?? ""),
          price_per_month: String(slotType.pricePerMonth ?? ""),
        }))
      : [createSlotType()],
});

const formatCoordinate = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(5) : "--";

const reverseGeocode = async (lat, lng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await response.json();
  const address = data.address || {};

  return {
    address:
      data.display_name ||
      [
        address.road,
        address.suburb,
        address.city || address.town || address.village,
        address.state,
      ]
        .filter(Boolean)
        .join(", "),
    area:
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.city_district ||
      "",
    city: address.city || address.town || address.village || "",
    state: address.state || "",
  };
};

const sanitizeSlotTypes = (slotTypes = []) =>
  slotTypes
    .map((slotType) => ({
      vehicle_type: slotType.vehicle_type,
      total_slots: Number(slotType.total_slots),
      price_per_hour: Number(slotType.price_per_hour),
      price_per_day: Number(slotType.price_per_day),
      price_per_month: Number(slotType.price_per_month),
    }))
    .filter((slotType) => slotType.vehicle_type);

const hasInvalidSlotType = (slotTypes = []) =>
  slotTypes.some((slotType) => {
    const totalSlots = Number(slotType.total_slots);
    const pricePerHour = Number(slotType.price_per_hour);
    const pricePerDay = Number(slotType.price_per_day);
    const pricePerMonth = Number(slotType.price_per_month);

    return (
      !slotType.vehicle_type ||
      !Number.isFinite(totalSlots) ||
      totalSlots < 1 ||
      !Number.isFinite(pricePerHour) ||
      pricePerHour < 0 ||
      !Number.isFinite(pricePerDay) ||
      pricePerDay < 0 ||
      !Number.isFinite(pricePerMonth) ||
      pricePerMonth < 0
    );
  });

const ManageParking = () => {
  const { data: parkingSpots = [], isLoading } = useParkingLocations();
  const { data: ownerLocations = [] } = useMyParkingLocations();
  const { mutate: addLocation, isPending: isAdding } = useAddParkingLocation();
  const updateLocation = useUpdateParkingLocation();
  const deleteLocation = useDeleteParkingLocation();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  const selectedLocation =
    parkingSpots.find((spot) => String(spot.id) === String(selectedLocationId)) || parkingSpots[0] || null;

  const stats = useMemo(() => {
    const total = ownerLocations.length;
    const open = ownerLocations.filter((spot) => spot.available).length;
    const cities = new Set(ownerLocations.map((spot) => spot.city).filter(Boolean)).size;

    return [
      { label: "Locations tracked", value: total, icon: Building2 },
      { label: "Currently open", value: open, icon: Radar },
      { label: "Cities covered", value: cities || 1, icon: Layers3 },
    ];
  }, [ownerLocations]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      editImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews, editImagePreviews]);

  const handleInputChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSlotTypeChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      slot_types: current.slot_types.map((slotType, slotIndex) =>
        slotIndex === index
          ? {
              ...slotType,
              [field]: value,
            }
          : slotType
      ),
    }));
  };

  const addSlotTypeRow = () => {
    setFormData((current) => ({
      ...current,
      slot_types: [...current.slot_types, createSlotType()],
    }));
  };

  const removeSlotTypeRow = (index) => {
    setFormData((current) => ({
      ...current,
      slot_types:
        current.slot_types.length > 1
          ? current.slot_types.filter((_, slotIndex) => slotIndex !== index)
          : current.slot_types,
    }));
  };

  const handlePickLocation = (latlng) => {
    setSelectedPoint(latlng);
    toast.success("Map point selected. Complete the location details to publish it.");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedPoint(nextPoint);
        reverseGeocode(nextPoint.lat, nextPoint.lng)
          .then((locationDetails) => {
            setFormData((current) => ({
              ...current,
              address: locationDetails.address || current.address,
              area: locationDetails.area || current.area,
              city: locationDetails.city || current.city,
              state: locationDetails.state || current.state,
            }));
            toast.success("Current location added and location fields updated.");
          })
          .catch(() => {
            toast.info("Current coordinates added, but address autofill was unavailable.");
          })
          .finally(() => {
            setIsLocating(false);
          });
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access was denied. Please allow location permission.");
          return;
        }
        toast.error("Unable to fetch current location right now.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Only image files can be uploaded.");
    }

    const nextFiles = [...images, ...validFiles].slice(0, 5);
    if (images.length + validFiles.length > 5) {
      toast.info("You can upload up to 5 images per parking location.");
    }

    setImages(nextFiles);
    setImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleEditChange = (event) => {
    setEditForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditSlotTypeChange = (index, field, value) => {
    setEditForm((current) => ({
      ...current,
      slot_types: current.slot_types.map((slotType, slotIndex) =>
        slotIndex === index
          ? {
              ...slotType,
              [field]: value,
            }
          : slotType
      ),
    }));
  };

  const addEditSlotTypeRow = () => {
    setEditForm((current) => ({
      ...current,
      slot_types: [...current.slot_types, createSlotType()],
    }));
  };

  const removeEditSlotTypeRow = (index) => {
    setEditForm((current) => ({
      ...current,
      slot_types:
        current.slot_types.length > 1
          ? current.slot_types.filter((_, slotIndex) => slotIndex !== index)
          : current.slot_types,
    }));
  };

  const handleRemoveImage = (index) => {
    const nextImages = images.filter((_, currentIndex) => currentIndex !== index);
    setImages(nextImages);
    setImagePreviews((current) => {
      current.forEach((preview, previewIndex) => {
        if (previewIndex === index) {
          URL.revokeObjectURL(preview);
        }
      });
      return nextImages.map((file) => URL.createObjectURL(file));
    });
  };

  const openEditModal = (location) => {
    editImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditingLocation(location);
    setEditForm(createEditState(location));
    setEditImages([]);
    setEditImagePreviews([]);
  };

  const closeEditModal = () => {
    editImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditingLocation(null);
    setEditForm(null);
    setEditImages([]);
    setEditImagePreviews([]);
  };

  const handleEditImageChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      return;
    }

    const nextFiles = [...editImages, ...files].slice(0, 5);
    if (editImages.length + files.length > 5) {
      toast.info("You can upload up to 5 new images at a time.");
    }

    editImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditImages(nextFiles);
    setEditImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveEditImage = (index) => {
    const nextFiles = editImages.filter((_, currentIndex) => currentIndex !== index);
    editImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditImages(nextFiles);
    setEditImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedPoint) {
      toast.error("Pick a point on the map before saving the location.");
      return;
    }

    if (!formData.name || !formData.address || !formData.city || !formData.state) {
      toast.error("Fill in the required location details first.");
      return;
    }

    if (!formData.slot_types.length || hasInvalidSlotType(formData.slot_types)) {
      toast.error("Add at least one valid slot type with slots and pricing.");
      return;
    }

    addLocation(
      {
        ...formData,
        latitude: selectedPoint.lat,
        longitude: selectedPoint.lng,
        slot_types: sanitizeSlotTypes(formData.slot_types),
        images,
      },
      {
        onSuccess: (createdLocation) => {
          setFormData(emptyForm);
          setSelectedPoint(null);
          imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
          setImages([]);
          setImagePreviews([]);
          setSelectedLocationId(createdLocation?.id || null);
        },
      }
    );
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editForm?.name || !editForm?.address || !editForm?.city || !editForm?.state) {
      toast.error("Fill in all required location details first.");
      return;
    }

    if (!editForm.slot_types.length || hasInvalidSlotType(editForm.slot_types)) {
      toast.error("Add at least one valid slot type with slots and pricing.");
      return;
    }

    await updateLocation.mutateAsync({
      ...editForm,
      slot_types: sanitizeSlotTypes(editForm.slot_types),
      images: editImages,
    });

    closeEditModal();
  };

  const handleDelete = async (location) => {
    const confirmed = window.confirm(`Delete "${location.name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deleteLocation.mutateAsync(location.id);
    if (String(selectedLocationId) === String(location.id)) {
      setSelectedLocationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-orange-300" />
              Owner workspace
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage parking inventory with a calmer workflow.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Pick a place on the map, fill in the essentials, and keep your parking portfolio visible
              in one owner-friendly workspace instead of juggling scattered forms.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06]">
                    <Icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[520px_minmax(0,0.88fr)]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.78))] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Plus className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Add new parking location</h2>
                  <p className="text-sm text-slate-400">Pick a map point, then publish the location details.</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Selected coordinates</p>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5 text-emerald-300" />}
                    {isLocating ? "Locating..." : "Use current location"}
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-950/55 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Latitude</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatCoordinate(selectedPoint?.lat)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950/55 p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Longitude</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatCoordinate(selectedPoint?.lng)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Tip: click anywhere on the map or use your current location to set the exact point.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Field label="Location name" required>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Central Mall Parking"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Secure underground parking with easy mall access."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </Field>

                <Field label="Address" required>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="12 Main Street, Connaught Place"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </Field>

                <Field label="Area">
                  <input
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g. Connaught Place"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" required>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                    />
                  </Field>

                  <Field label="State" required>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Slot Types <span className="text-orange-300">*</span>
                  </span>
                  <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                    {formData.slot_types.map((slotType, index) => (
                      <div
                        key={`slot-type-${index}`}
                        className="space-y-4 rounded-[1.4rem] border border-white/10 bg-slate-950/40 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-white">Slot Type {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeSlotTypeRow(index)}
                            disabled={formData.slot_types.length === 1}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Vehicle Type" required>
                            <select
                              value={slotType.vehicle_type}
                              onChange={(event) =>
                                handleSlotTypeChange(index, "vehicle_type", event.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                            >
                              {vehicleTypeOptions.map((option) => (
                                <option key={option} value={option} className="bg-slate-900 text-white">
                                  {option}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <Field label="Total Slots" required>
                            <input
                              type="number"
                              min="1"
                              value={slotType.total_slots}
                              onChange={(event) =>
                                handleSlotTypeChange(index, "total_slots", event.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                            />
                          </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Price / hour" required>
                            <input
                              type="number"
                              min="0"
                              value={slotType.price_per_hour}
                              onChange={(event) =>
                                handleSlotTypeChange(index, "price_per_hour", event.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                            />
                          </Field>

                          <Field label="Price / day" required>
                            <input
                              type="number"
                              min="0"
                              value={slotType.price_per_day}
                              onChange={(event) =>
                                handleSlotTypeChange(index, "price_per_day", event.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                            />
                          </Field>

                          <Field label="Price / month" required>
                            <input
                              type="number"
                              min="0"
                              value={slotType.price_per_month}
                              onChange={(event) =>
                                handleSlotTypeChange(index, "price_per_month", event.target.value)
                              }
                              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                            />
                          </Field>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSlotTypeRow}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      <Plus className="h-4 w-4" />
                      Add another slot type
                    </button>
                  </div>
                </div>

                <Field label="Parking images">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-white/15 bg-slate-950/40 px-4 py-6 text-center transition hover:bg-white/[0.04]">
                      <ImagePlus className="h-6 w-6 text-orange-300" />
                      <span className="mt-3 text-sm font-medium text-white">Upload parking photos</span>
                      <span className="mt-1 text-xs text-slate-400">
                        Add up to 5 JPG, PNG, or WebP images for this location.
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    {imagePreviews.length ? (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-white/10">
                            <img src={preview} alt="Parking preview" className="h-24 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {isAdding ? "Saving location..." : "Save parking location"}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06]">
                  <Compass className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Existing locations</h3>
                  <p className="text-sm text-slate-400">Quickly review what is already live nearby.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {ownerLocations.slice(0, 5).map((spot) => (
                  <div
                    key={spot.id}
                    className={`rounded-[1.4rem] border p-4 transition ${
                      String(selectedLocationId) === String(spot.id)
                        ? "border-emerald-400/40 bg-emerald-400/10"
                        : "border-white/10 bg-slate-950/45 hover:bg-white/[0.05]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedLocationId(spot.id)}
                      className="w-full text-left"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-white">{spot.name}</p>
                          <p className="mt-2 text-sm text-slate-400">{spot.address || "Address pending"}</p>
                        </div>
                        <div className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
                          {spot.city || "City"}
                        </div>
                      </div>
                    </button>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => openEditModal(spot)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                      >
                        <Pencil className="h-4 w-4" />
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(spot)}
                        disabled={deleteLocation.isPending}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {!ownerLocations.length && !isLoading ? (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-slate-950/45 p-5 text-sm text-slate-400">
                    No locations yet. Click the map to pick your first spot and start building your portfolio.
                  </div>
                ) : null}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.78))]">
              <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-emerald-300">Interactive map</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {selectedLocation ? selectedLocation.name : "Choose a location point"}
                  </h2>
                </div>
                <div className="rounded-full bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
                  Click map to place
                </div>
              </div>

              <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
                <ParkingMap
                  spots={parkingSpots}
                  selectedPoint={selectedPoint}
                  mode="add"
                  onAddSpot={handlePickLocation}
                />

                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-300" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-300" />
                  <h3 className="text-lg font-semibold text-white">Selected map point</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Use the exact point you clicked to anchor the parking location. This makes map discovery
                  and route guidance feel much more precise for drivers.
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-emerald-300" />
                  <h3 className="text-lg font-semibold text-white">Owner workflow tip</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Add the location first, then expand details like slots, images, and pricing from the owner
                  panel for a cleaner setup flow.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>

      {editingLocation && editForm ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeEditModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.88))] p-4 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.95)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Update location</p>
                <h2 className="mt-2 break-words text-xl font-semibold text-white sm:text-2xl">{editingLocation.name}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Refresh location details and upload new parking photos from the same workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <Field label="Location name" required>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  rows="4"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </Field>

              <Field label="Address" required>
                <input
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </Field>

              <Field label="Area">
                <input
                  name="area"
                  value={editForm.area}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" required>
                  <input
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </Field>

                <Field label="State" required>
                  <input
                    name="state"
                    value={editForm.state}
                    onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </Field>
            </div>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-200">
                  Slot Types <span className="text-orange-300">*</span>
                </span>
                <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                  {editForm.slot_types.map((slotType, index) => (
                    <div
                      key={`edit-slot-type-${index}`}
                      className="space-y-4 rounded-[1.4rem] border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-white">Slot Type {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => removeEditSlotTypeRow(index)}
                          disabled={editForm.slot_types.length === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Vehicle Type" required>
                          <select
                            value={slotType.vehicle_type}
                            onChange={(event) =>
                              handleEditSlotTypeChange(index, "vehicle_type", event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                          >
                            {vehicleTypeOptions.map((option) => (
                              <option key={option} value={option} className="bg-slate-900 text-white">
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Total Slots" required>
                          <input
                            type="number"
                            min="1"
                            value={slotType.total_slots}
                            onChange={(event) =>
                              handleEditSlotTypeChange(index, "total_slots", event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                          />
                        </Field>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Price / hour" required>
                          <input
                            type="number"
                            min="0"
                            value={slotType.price_per_hour}
                            onChange={(event) =>
                              handleEditSlotTypeChange(index, "price_per_hour", event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                          />
                        </Field>

                        <Field label="Price / day" required>
                          <input
                            type="number"
                            min="0"
                            value={slotType.price_per_day}
                            onChange={(event) =>
                              handleEditSlotTypeChange(index, "price_per_day", event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                          />
                        </Field>

                        <Field label="Price / month" required>
                          <input
                            type="number"
                            min="0"
                            value={slotType.price_per_month}
                            onChange={(event) =>
                              handleEditSlotTypeChange(index, "price_per_month", event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition focus:border-emerald-400"
                          />
                        </Field>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEditSlotTypeRow}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                  >
                    <Plus className="h-4 w-4" />
                    Add another slot type
                  </button>
                </div>
              </div>

              <Field label="Upload new parking images">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-white/15 bg-slate-950/40 px-4 py-6 text-center transition hover:bg-white/[0.04]">
                    <ImagePlus className="h-6 w-6 text-orange-300" />
                    <span className="mt-3 text-sm font-medium text-white">Attach more parking photos</span>
                    <span className="mt-1 text-xs text-slate-400">
                      Add up to 5 new images for this location.
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditImageChange}
                    />
                  </label>

                  {editImagePreviews.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {editImagePreviews.map((preview, index) => (
                        <div key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-white/10">
                          <img src={preview} alt="New parking upload" className="h-24 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveEditImage(index)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={updateLocation.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updateLocation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                  {updateLocation.isPending ? "Saving changes..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, required = false, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-200">
        {label} {required ? <span className="text-orange-300">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export default ManageParking;
