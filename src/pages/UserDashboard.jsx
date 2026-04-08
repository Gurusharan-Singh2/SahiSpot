import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../Store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Mail, MapPin, Phone, Search, UserRound, WalletCards } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formatMoney = (value) => `₹${Number(value || 0).toFixed(0)}`;
const formatLabel = (value) => String(value || '').replace(/_/g, ' ');
const formatDate = (value) => (value ? new Date(value).toLocaleString() : 'Schedule pending');

export default function UserDashboard() {
  const { user, updateUser } = useAuthStore();

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
  const favorites = []; // Mock empty
  const profileInitial = String(profile?.name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] pt-24 pb-12 px-4 md:px-8">
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
                            {bookings.map(booking => (
                                <Card key={booking.id} className="overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.82))] text-white shadow-md">
                                    <div className="flex flex-col gap-2 bg-slate-950 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
                                        <span>{booking.startTime ? new Date(booking.startTime).toLocaleDateString() : 'Upcoming'}</span>
                                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs capitalize">{booking.vehicleType || 'car'}</span>
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <h3 className="font-bold text-lg text-white line-clamp-1">{booking.locationName || `Location #${booking.locationId}`}</h3>
                                        <div className="flex items-start gap-2 text-sm text-slate-300">
                                            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                            <span className="line-clamp-1">{booking.locationAddress || booking.parkingLocation?.address || 'Address unavailable'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Clock size={14} className="text-slate-400" />
                                            <span>
                                                {formatDate(booking.startTime)}
                                            </span>
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
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
                                                <p className="mt-1 font-semibold capitalize text-white">{booking.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">Total price</p>
                                                <p className="mt-1 font-semibold text-emerald-100">{formatMoney(booking.totalPrice)}</p>
                                            </div>
                                            <div className="sm:text-right">
                                                <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">Payable</p>
                                                <p className="mt-1 font-semibold text-emerald-100">{formatMoney(booking.finalPayable || booking.totalPrice)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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
