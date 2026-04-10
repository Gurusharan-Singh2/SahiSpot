import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../Store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Clock, Mail, MapPin, Phone,
  Search, Timer, UserRound, WalletCards, X, Zap, LogOut, CheckCircle2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const formatMoney = (value) => `₹${Number(value || 0).toFixed(0)}`;
const formatLabel = (value) => String(value || '').replace(/_/g, ' ');
const formatDate  = (value) => (value ? new Date(value).toLocaleString() : 'Schedule pending');

// ─── Extend Booking Modal ─────────────────────────────────────────────────────
function ExtendModal({ booking, onClose, onSuccess }) {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const EXTEND_OPTIONS = [
    { label: '+1 Hour',  hours: 1,  icon: '⏱️' },
    { label: '+2 Hours', hours: 2,  icon: '⏰' },
    { label: 'Full Day', hours: 8,  icon: '☀️' },
  ];

  const { mutate: extend, isPending } = useMutation({
    mutationFn: ({ bookingId, hours }) => bookingService.extendBooking(bookingId, hours),
    onSuccess: () => {
      toast.success('Parking extended! A confirmation email has been sent.');
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to extend booking.');
    },
  });

  const handleConfirm = () => {
    if (!selected) return toast.error('Please select an extension option.');
    extend({ bookingId: booking.id, hours: selected.hours });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-500/20 p-2">
              <Timer size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Extend Parking</h2>
              <p className="text-xs text-slate-400">{booking.locationName || `Booking #${booking.id}`}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current end time */}
        <div className="mx-6 mt-5 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-orange-300/70">Current End Time</p>
          <p className="mt-1 font-semibold text-orange-200">{formatDate(booking.endTime)}</p>
        </div>

        {/* Option cards */}
        <div className="px-6 py-5">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">Choose Extension</p>
          <div className="grid grid-cols-3 gap-3">
            {EXTEND_OPTIONS.map((opt) => (
              <button
                key={opt.hours}
                onClick={() => setSelected(opt)}
                className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-all duration-200 ${
                  selected?.hours === opt.hours
                    ? 'border-orange-400/60 bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-sm font-semibold text-white">{opt.label}</span>
                {selected?.hours === opt.hours && (
                  <span className="text-[10px] text-orange-300 font-medium">Selected ✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex flex-col gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!selected || isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-5 text-base font-semibold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
          >
            {isPending ? 'Extending…' : `Confirm ${selected ? selected.label : 'Extension'}`}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="w-full text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [extendTarget, setExtendTarget] = useState(null);

  const { mutate: checkoutBooking, isPending: isCheckingOut } = useMutation({
    mutationFn: bookingService.checkoutBooking,
    onSuccess: () => {
      toast.success("Successfully checked out! Parking slot is now free.");
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const handleCheckout = (booking) => {
    checkoutBooking(booking.id, {
      onError: (err) => {
        const msg = err?.response?.data?.message || err.message || "";
        if (msg.includes("pay") || msg.toLowerCase().includes("balance")) {
          toast.error(msg, { description: "Redirecting to payment..." });
          navigate(`/payment/${booking.id}?checkout=true`);
        } else {
          toast.error(msg || "Failed to checkout.");
        }
      }
    });
  };

  const { data: profileResponse } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    staleTime: 60_000,
  });

  const profile = profileResponse?.data ?? profileResponse?.user ?? profileResponse ?? user;

  React.useEffect(() => {
    if (profileResponse) {
      updateUser(profile);
    }
  }, [profileResponse, profile, updateUser]);

  // Fetch Bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingService.getUserBookings,
  });

  const payments = bookings.filter((booking) => Number(booking.finalPayable || booking.totalPrice) > 0);
  const profileInitial = String(profile?.name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] pt-24 pb-12 px-4 md:px-8">
      {/* Extend Modal */}
      {extendTarget && (
        <ExtendModal
          booking={extendTarget}
          onClose={() => setExtendTarget(null)}
          onSuccess={() => setExtendTarget(null)}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
           <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
           <p className="text-slate-400 mt-1">Welcome back, {user?.name || user?.email || 'User'}</p>
        </div>

        <Card className="border border-white/10 bg-white/[0.04] text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-white">My Profile</CardTitle>
            <CardDescription className="text-slate-400">Your account details from the current profile API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border border-white/10">
                <AvatarImage src={profile?.image || profile?.img} alt={profile?.name || 'Profile'} className="object-cover" />
                <AvatarFallback className="bg-white/[0.06] text-slate-200 text-xl font-semibold">
                  {profileInitial}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white">{profile?.name || 'User'}</h2>
                <p className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {profile?.role || 'user'}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </p>
                    <p className="mt-2 text-sm font-medium text-white break-all">{profile?.email || 'Not available'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">{profile?.phoneNumber || profile?.phone_number || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 border border-white/10 bg-white/[0.04] md:w-[400px]">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card className="border border-white/10 bg-white/[0.04] text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.72)]">
                <CardHeader>
                    <CardTitle className="text-white">My Bookings</CardTitle>
                    <CardDescription className="text-slate-400">View your active and past parking reservations.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingBookings ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 animate-pulse">
                                    <div className="h-12 bg-white/10" />
                                    <div className="space-y-3 p-4">
                                        <div className="h-4 rounded bg-white/10" />
                                        <div className="h-4 rounded bg-white/5" />
                                        <div className="h-4 rounded bg-white/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map(booking => {
                              const isActive   = booking.status === 'booked';
                              const hasOverstay = Number(booking.overstayCharge || booking.overstay_charge || 0) > 0;
                              return (
                                <Card key={booking.id} className="overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.82))] text-white shadow-md">
                                    {/* Top bar */}
                                    <div className="flex flex-col gap-2 bg-slate-950 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
                                        <span>{booking.startTime ? new Date(booking.startTime).toLocaleDateString() : 'Upcoming'}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs capitalize">{booking.vehicleType || 'car'}</span>
                                          {/* Overstay badge */}
                                          {hasOverstay && (
                                            <span className="flex items-center gap-1 rounded-md bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-xs text-red-300 font-semibold animate-pulse">
                                              <AlertTriangle size={10} />
                                              Overstay
                                            </span>
                                          )}
                                        </div>
                                    </div>

                                    <CardContent className="p-4 space-y-3">
                                        <h3 className="font-bold text-lg text-white line-clamp-1">{booking.locationName || `Location #${booking.locationId}`}</h3>
                                        <div className="flex items-start gap-2 text-sm text-slate-300">
                                            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                            <span className="line-clamp-1">{booking.locationAddress || booking.parkingLocation?.address || 'Address unavailable'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Clock size={14} className="text-slate-400" />
                                            <span>{formatDate(booking.startTime)}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl bg-white/[0.05] px-3 py-2">
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Duration</p>
                                                <p className="mt-1 font-semibold capitalize text-white">
                                                    {formatLabel(booking.durationType)}
                                                    {booking.durationType === 'hour' && booking.totalHours ? ` · ${booking.totalHours}h` : ''}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white/[0.05] px-3 py-2">
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status / Payment</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <p className={`font-semibold capitalize ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                                                    {booking.status}
                                                  </p>
                                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${booking.paymentStatus === 'paid' || booking.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                                    {booking.paymentStatus || booking.payment_status || 'Pending'}
                                                  </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price section */}
                                        <div className="flex flex-col gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">Total price</p>
                                                <p className="mt-1 font-semibold text-emerald-100">{formatMoney(booking.totalPrice)}</p>
                                            </div>
                                            {hasOverstay && (
                                              <div className="sm:text-right">
                                                <p className="text-xs uppercase tracking-[0.18em] text-red-300/70">Overstay Fee</p>
                                                <p className="mt-1 font-bold text-red-300">{formatMoney(booking.overstayCharge || booking.overstay_charge)}</p>
                                              </div>
                                            )}
                                        </div>

                                        {/* Action buttons — only for active bookings */}
                                        {isActive ? (
                                          <div className="mt-2 grid grid-cols-2 gap-2">
                                            <button
                                              onClick={() => setExtendTarget(booking)}
                                              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2.5 text-xs font-semibold text-orange-300 transition-all hover:bg-orange-500/20 hover:border-orange-400/50 hover:text-orange-200 active:scale-[0.98]"
                                            >
                                              <Zap size={14} />
                                              Extend
                                            </button>
                                            <button
                                              onClick={() => handleCheckout(booking)}
                                              disabled={isCheckingOut}
                                              className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
                                                hasOverstay 
                                                  ? "border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/50" 
                                                  : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50"
                                              }`}
                                            >
                                              <LogOut size={14} />
                                              {hasOverstay ? "Pay & Checkout" : "Checkout"}
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="mt-2">
                                            <button disabled className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-slate-800/30 px-3 py-2.5 text-xs font-semibold text-slate-400">
                                              <CheckCircle2 size={14} className="text-emerald-500" />
                                              Booking Ended
                                            </button>
                                          </div>
                                        )}
                                    </CardContent>
                                </Card>
                              );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-950/40 rounded-lg border border-dashed border-white/10">
                            <Search size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-1">No Bookings Yet</h3>
                            <p className="text-slate-400 text-sm mb-4">You haven't made any parking reservations.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card className="border border-white/10 bg-white/[0.04] text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.72)]">
              <CardHeader>
                <CardTitle className="text-white">My Payments</CardTitle>
                <CardDescription className="text-slate-400">History of your parking transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                 {payments.length > 0 ? (
                      <div className="space-y-4">
                          {payments.map((p, i) => (
                              <div key={i} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/45 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-emerald-500/15 p-2 rounded-full text-emerald-300">
                                          <WalletCards size={24} />
                                      </div>
                                      <div>
                                          <p className="font-semibold text-white">{p.locationName}</p>
                                          <p className="text-xs text-slate-400">{formatDate(p.startTime)}</p>
                                      </div>
                                  </div>
                                  <span className="text-lg font-bold text-white sm:text-right">{formatMoney(p.finalPayable || p.totalPrice)}</span>
                              </div>
                          ))}
                      </div>
                 ) : (
                     <div className="text-center py-10 text-slate-400">No payment history found.</div>
                 )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
             <Card className="border border-white/10 bg-white/[0.04] text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.72)]">
                <CardHeader>
                    <CardTitle className="text-white">Favorites</CardTitle>
                    <CardDescription className="text-slate-400">Your saved parking locations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-slate-400">You haven't added any favorites yet.</div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
