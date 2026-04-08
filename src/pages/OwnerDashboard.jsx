import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useDeleteParkingLocation,
  useMyParkingLocations,
  useUpdateParkingLocation,
} from '../hooks/useParkingQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  PlusCircle,
  Radar,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';

const statusTone = {
  approved: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  available: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  pending: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  rejected: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  inactive: "border-slate-400/30 bg-slate-500/10 text-slate-200",
};

const createEditState = (location) => ({
  id: location.id,
  name: location.name || "",
  description: location.description || "",
  address: location.address || "",
  city: location.city || "New Delhi",
  state: location.state || "Delhi",
  availableSlots: Number(location.availableSlots ?? 0),
});

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const updateLocation = useUpdateParkingLocation();
  const deleteLocation = useDeleteParkingLocation();
  const [editingLocation, setEditingLocation] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { data: myLocations = [], isLoading } = useMyParkingLocations();

  const stats = useMemo(() => {
    const total = myLocations.length;
    const open = myLocations.filter((location) => location.available).length;
    const estimatedRevenue = myLocations.reduce(
      (sum, location) => sum + Number(location.pricePerHour || 0) * Math.max(Number(location.availableSlots || 0), 1),
      0
    );

    return [
      { label: 'Locations', value: total, icon: Building2 },
      { label: 'Active hubs', value: open, icon: Radar },
      { label: 'Est. revenue base', value: `Rs. ${estimatedRevenue}`, icon: Wallet },
    ];
  }, [myLocations]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!editingLocation) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editingLocation]);

  const openEditModal = (location) => {
    setEditingLocation(location);
    setEditForm(createEditState(location));
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setNewImages([]);
    setImagePreviews([]);
  };

  const closeEditModal = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditingLocation(null);
    setEditForm(null);
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: name === "availableSlots" ? value.replace(/[^\d]/g, "") : value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) {
      return;
    }

    const nextFiles = [...newImages, ...files].slice(0, 5);
    if (newImages.length + files.length > 5) {
      toast.info("You can upload up to 5 new images at a time.");
    }

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setNewImages(nextFiles);
    setImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const removePreview = (index) => {
    const nextFiles = newImages.filter((_, currentIndex) => currentIndex !== index);
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setNewImages(nextFiles);
    setImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editForm?.name || !editForm?.address || !editForm?.city || !editForm?.state) {
      toast.error("Fill in all required fields.");
      return;
    }

    if (Number(editForm.availableSlots) < 0) {
      toast.error("Available slots cannot be negative.");
      return;
    }

    await updateLocation.mutateAsync({
      ...editForm,
      availableSlots: Number(editForm.availableSlots || 0),
      images: newImages,
    });
    closeEditModal();
  };

  const handleDelete = async (location) => {
    const confirmed = window.confirm(`Delete "${location.name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deleteLocation.mutateAsync(location.id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Owner dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Manage your parking business with more visibility.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Review your locations, update the details, attach parking photos, and remove old listings
              without leaving the owner workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
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

        <Card className="border-white/10 bg-white/[0.04] text-white shadow-none">
          <CardHeader className="flex flex-col gap-4 border-b border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-white">My Parking Locations</CardTitle>
                <CardDescription className="mt-2 text-slate-400">
                  {myLocations.length
                    ? "Update, enrich, or remove locations directly from here."
                    : "Once you create locations, they’ll appear here."}
                </CardDescription>
              </div>
              <Button
                onClick={() => navigate('/manage-parking')}
                className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400">Loading your locations...</div>
            ) : myLocations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {myLocations.map((location) => {
                  const displayStatus =
                    location.status ||
                    location.slotTypes?.[0]?.status ||
                    "pending";

                  return (
                    <div
                      key={location.id}
                      className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(2,6,23,0.76))]"
                    >
                      <div className="flex h-40 items-center justify-center bg-white/[0.04]">
                        {location.images?.[0]?.url ? (
                          <img src={location.images[0].url} alt={location.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-500">
                            <Building2 size={34} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                            <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
                              <MapPin className="mt-0.5 h-4 w-4 text-orange-300" />
                              <span>{location.address || "Address pending"}</span>
                            </p>
                          </div>
                          <div className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusTone[displayStatus] || statusTone.pending}`}>
                            {displayStatus}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white/[0.04] p-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Price / hour</p>
                            <p className="mt-2 text-lg font-semibold text-white">Rs. {location.pricePerHour}</p>
                          </div>
                          <div className="rounded-2xl bg-white/[0.04] p-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Slots open</p>
                            <p className="mt-2 text-lg font-semibold text-white">{location.availableSlots}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          <Button
                            variant="outline"
                            className="flex-1 border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
                            onClick={() => openEditModal(location)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                            onClick={() => handleDelete(location)}
                            disabled={deleteLocation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-slate-950/45 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.05] text-slate-500">
                  <Building2 size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">No locations yet</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Start by creating your first parking location in the parking manager.
                </p>
                <Button
                  onClick={() => navigate('/manage-parking')}
                  className="mt-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create first location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editingLocation && editForm ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeEditModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.88))] p-4 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.95)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Edit location</p>
                <h2 className="mt-2 break-words text-xl font-semibold text-white sm:text-2xl">{editingLocation.name}</h2>
                <p className="mt-2 text-sm text-slate-400">Update parking details and upload new location images.</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="custom-scrollbar mt-6 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-2">
              <EditField label="Location name" required>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </EditField>

              <EditField label="Description">
                <textarea
                  name="description"
                  rows="4"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </EditField>

              <EditField label="Address" required>
                <input
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </EditField>

              <div className="grid gap-4 sm:grid-cols-2">
                <EditField label="City" required>
                  <input
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </EditField>

                <EditField label="State" required>
                  <input
                    name="state"
                    value={editForm.state}
                    onChange={handleEditChange}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                  />
                </EditField>
              </div>

              <EditField label="Available slots" required>
                <input
                  type="number"
                  min="0"
                  name="availableSlots"
                  value={editForm.availableSlots}
                  onChange={handleEditChange}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400"
                />
              </EditField>

              <EditField label="Upload new parking images">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-white/15 bg-slate-950/40 px-4 py-6 text-center transition hover:bg-white/[0.04]">
                    <ImagePlus className="h-6 w-6 text-orange-300" />
                    <span className="mt-3 text-sm font-medium text-white">Attach additional photos</span>
                    <span className="mt-1 text-xs text-slate-400">
                      Upload up to 5 new images to enrich this parking listing.
                    </span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>

                  {imagePreviews.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-white/10">
                          <img src={preview} alt="New parking upload" className="h-24 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePreview(index)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </EditField>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={updateLocation.isPending}
                  className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110"
                >
                  {updateLocation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
                  {updateLocation.isPending ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                  className="border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EditField({ label, required = false, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-200">
        {label} {required ? <span className="text-orange-300">*</span> : null}
      </span>
      {children}
    </label>
  );
}
