import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { locationService } from '../services/location.service';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../Store/authStore';
import { parseDateTimeValue } from '@/lib/parking';
import {
  getFavoriteLocations,
  isFavoriteLocation,
  toggleFavoriteLocation,
} from '@/lib/userPreferences';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Clock, Mail, MapPin, Phone,
  Search, Timer, UserRound, WalletCards, X, Zap, LogOut, CheckCircle2,
  Calendar, ArrowRight, Sparkles, Star, ShieldCheck, Crown, TrendingUp,
  Bell, Menu, Home, Car, CreditCard, Heart, Settings, HelpCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const formatMoney = (value) => `₹${Number(value || 0).toFixed(0)}`;
const formatLabel = (value) => String(value || '').replace(/_/g, ' ');
const formatDate = (value) => {
  const date = parseDateTimeValue(value);
  return date ? date.toLocaleString() : 'Schedule pending';
};

import ExtendModal from '@/components/dashboard/ExtendModal';
import ReviewModal from '@/components/dashboard/ReviewModal';
import BookingTimer from '@/components/dashboard/BookingTimer';
import StatCard from '@/components/dashboard/DashboardStatCard';

const UserDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [extendTarget, setExtendTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [favorites, setFavorites] = useState(() => getFavoriteLocations());

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

  React.useEffect(() => {
    setFavorites(getFavoriteLocations());
  }, []);

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingService.getUserBookings,
  });
  
  const payments = bookings.filter((booking) => Number(booking.finalPayable || booking.totalPrice) > 0);
  const profileInitial = String(profile?.name || profile?.email || 'U').charAt(0).toUpperCase();

  const activeBookings = bookings.filter(b => b.status === 'booked').length;
  const totalSpent = payments.reduce((sum, p) => sum + Number(p.finalPayable || p.totalPrice || 0), 0);
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'ended').length;

  const handleToggleFavorite = (booking) => {
    const location = booking?.parkingLocation || {
      id: booking.locationId,
      name: booking.locationName,
      address: booking.locationAddress,
      images: booking.parkingLocation?.images,
      pricePerHour: booking.parkingLocation?.pricePerHour ?? booking.totalPrice,
    };
    const result = toggleFavoriteLocation(location);
    setFavorites(result.favorites);
    toast.success(result.isFavorite ? 'Added to favorites.' : 'Removed from favorites.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {}
      <AnimatePresence>
        {extendTarget && (
          <ExtendModal
            booking={extendTarget}
            onClose={() => setExtendTarget(null)}
            onSuccess={() => setExtendTarget(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal
            booking={reviewTarget}
            userName={profile?.name || profile?.email || 'Anonymous driver'}
            onClose={() => setReviewTarget(null)}
            onSuccess={() => setReviewTarget(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto pt-20 pb-12 px-4 md:px-8">
        
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                My Dashboard
              </h1>
              <p className="text-white/50 mt-2">Welcome back, {user?.name || user?.email || 'User'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
            >
              <Car size={18} />
              New Booking
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <StatCard
            title="Active Bookings"
            value={activeBookings}
            icon={Car}
            color="from-orange-500 to-amber-600"
          />
          <StatCard
            title="Total Spent"
            value={formatMoney(totalSpent)}
            icon={WalletCards}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Completed"
            value={completedBookings}
            icon={CheckCircle2}
            color="from-blue-500 to-cyan-600"
          />
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="text-white text-2xl">Profile Overview</CardTitle>
              <CardDescription className="text-white/50">Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 blur-lg opacity-50" />
                    <Avatar className="h-24 w-24 border-2 border-white/20 shadow-xl relative">
                      <AvatarImage src={profile?.image || profile?.img} alt={profile?.name || 'Profile'} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-2xl font-bold">
                        {profileInitial}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                          {profile?.role || 'user'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                        <Crown size={12} className="text-amber-400" />
                        <span className="text-xs font-semibold text-white/80">Member since 2024</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                      <Mail size={12} />
                      Email
                    </div>
                    <p className="text-white font-medium break-all">{profile?.email || 'Not available'}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                      <Phone size={12} />
                      Phone
                    </div>
                    <p className="text-white font-medium">{profile?.phoneNumber || profile?.phone_number || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3 max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-1">
              <TabsTrigger 
                value="bookings"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-white/70 transition-all duration-300"
              >
                <Car size={16} className="mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="payments"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-white/70 transition-all duration-300"
              >
                <CreditCard size={16} className="mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-white/70 transition-all duration-300"
              >
                <Heart size={16} className="mr-2" />
                Favorites
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">My Bookings</CardTitle>
                  <CardDescription className="text-white/50">View your active and past parking reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-pulse">
                          <div className="h-32 bg-gradient-to-r from-white/10 to-transparent" />
                          <div className="space-y-3 p-5">
                            <div className="h-5 rounded-lg bg-white/10 w-3/4" />
                            <div className="h-4 rounded-lg bg-white/5 w-full" />
                            <div className="h-4 rounded-lg bg-white/5 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.map((booking, idx) => {
                        const isActive = booking.status === 'booked';
                        const hasOverstay = Number(booking.overstayCharge || booking.overstay_charge || 0) > 0;
                        const isFavorite = isFavoriteLocation(booking.locationId);
                        const canComment = booking.status === 'completed' || booking.status === 'ended';
                        return (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5 }}
                          >
                            <Card className="group overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-white/20">
                              {}
                              <div className="relative overflow-hidden bg-gradient-to-r from-slate-800/50 to-transparent px-5 py-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-white/50" />
                                    <span className="text-sm font-medium text-white/80">
                                      {formatDate(booking.startTime || booking.start_time).split(',')[0] || 'Upcoming'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleToggleFavorite(booking)}
                                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                                    >
                                      <Heart size={14} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                                    </button>
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 capitalize">
                                      {booking.vehicleType || 'car'}
                                    </span>
                                    {hasOverstay && (
                                      <span className="flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-300 animate-pulse">
                                        <AlertTriangle size={10} />
                                        Overstay
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <CardContent className="p-5 space-y-4">
                                <h3 className="font-bold text-xl text-white line-clamp-1">{booking.locationName || `Location #${booking.locationId}`}</h3>
                                
                                <div className="flex items-start gap-2 text-sm text-white/60">
                                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                  <span className="line-clamp-1">{booking.locationAddress || booking.parkingLocation?.address || 'Address unavailable'}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <Clock size={14} className="flex-shrink-0" />
                                  <span className="text-xs">
                                    {formatDate(booking.startTime || booking.start_time)} 
                                    { (booking.endTime || booking.end_time) ? ` — ${formatDate(booking.endTime || booking.end_time)}` : ''}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-xl bg-white/5 px-3 py-2.5 border border-white/5">
                                    <p className="text-xs uppercase tracking-wider text-white/40">Duration</p>
                                    <p className="mt-1 font-semibold text-white capitalize">
                                      {formatLabel(booking.durationType)}
                                      {booking.durationType === 'hour' && booking.totalHours ? ` · ${booking.totalHours}h` : ''}
                                    </p>
                                  </div>
                                  <div className="rounded-xl bg-white/5 px-3 py-2.5 border border-white/5">
                                    <p className="text-xs uppercase tracking-wider text-white/40">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className={`font-semibold capitalize ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                                        {booking.status}
                                      </p>
                                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                        booking.raw?.payment_status === 'paid' 
                                          ? 'bg-emerald-500/20 text-emerald-300' 
                                          : 'bg-amber-500/20 text-amber-300'
                                      }`}>
                                        {booking.raw?.payment_status || 'Pending'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <BookingTimer 
                                  startTime={booking.startTime || booking.start_time} 
                                  endTime={booking.endTime || booking.end_time} 
                                  isActive={isActive} 
                                />

                                {}
                                <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 px-4 py-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-wider text-emerald-300/80 font-semibold">Total Price</p>
                                    <p className="font-bold text-emerald-100">{formatMoney(booking.totalPrice)}</p>
                                  </div>
                                  {hasOverstay && (
                                    <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                                      <p className="text-xs uppercase tracking-wider text-red-300/80 font-semibold">Overstay Fee</p>
                                      <p className="font-bold text-red-300">{formatMoney(booking.overstayCharge || booking.overstay_charge)}</p>
                                    </div>
                                  )}
                                </div>

                                {}
                                {isActive ? (
                                  <div className="grid grid-cols-2 gap-3 pt-2">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => setExtendTarget(booking)}
                                      className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-300 transition-all duration-300 hover:bg-orange-500/20 hover:border-orange-500/50"
                                    >
                                      <Zap size={14} />
                                      Extend
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleCheckout(booking)}
                                      disabled={isCheckingOut}
                                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                        hasOverstay 
                                          ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20" 
                                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                      }`}
                                    >
                                      <LogOut size={14} />
                                      {hasOverstay ? "Pay & Checkout" : "Checkout"}
                                    </motion.button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-3 pt-2">
                                    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/40">
                                      <CheckCircle2 size={14} className="text-emerald-500" />
                                      {canComment ? 'Booking Ended' : formatLabel(booking.status || 'inactive')}
                                    </div>
                                    {canComment && (
                                      <button
                                        onClick={() => setReviewTarget(booking)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/20"
                                      >
                                        <Star size={14} />
                                        Add Comment
                                      </button>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10"
                    >
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full blur-2xl opacity-30" />
                        <Search size={64} className="relative text-white/30 mb-4" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                      <p className="text-white/50 mb-6">You haven't made any parking reservations.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold"
                      >
                        Find Parking
                        <ArrowRight size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments">
              <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Payment History</CardTitle>
                  <CardDescription className="text-white/50">Track all your transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map((payment, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3">
                              <WalletCards size={24} className="text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{payment.locationName}</p>
                              <p className="text-xs text-white/50">{formatDate(payment.startTime || payment.start_time)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">{formatMoney(payment.finalPayable || payment.totalPrice)}</p>
                            <p className="text-xs text-emerald-400">Completed</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <CreditCard size={48} className="mx-auto text-white/20 mb-4" />
                      <p className="text-white/50">No payment history found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Favorite Locations</CardTitle>
                  <CardDescription className="text-white/50">Your saved parking spots</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((favorite, idx) => (
                        <motion.div
                          key={favorite.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card className="overflow-hidden border border-white/10 bg-slate-900/70">
                            <div className="h-32 bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-950">
                              {favorite.imageUrl ? (
                                <img src={favorite.imageUrl} alt={favorite.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Heart size={32} className="text-white/20" />
                                </div>
                              )}
                            </div>
                            <CardContent className="space-y-4 p-5">
                              <div>
                                <h3 className="text-lg font-semibold text-white">{favorite.name}</h3>
                                <p className="mt-2 text-sm text-white/50">
                                  {favorite.address || [favorite.area, favorite.city].filter(Boolean).join(', ') || 'Address unavailable'}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/50">Starting price</span>
                                <span className="font-semibold text-emerald-300">{formatMoney(favorite.pricePerHour)}/hr</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => navigate(`/locations/${favorite.id}`)}
                                  className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    const result = toggleFavoriteLocation(favorite);
                                    setFavorites(result.favorites);
                                    toast.success('Removed from favorites.');
                                  }}
                                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                                >
                                  Remove
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Heart size={48} className="mx-auto text-white/20 mb-4" />
                      <p className="text-white/50">You haven't added any favorites yet.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/search')}
                        className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                      >
                        Explore Locations
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default UserDashboard;
