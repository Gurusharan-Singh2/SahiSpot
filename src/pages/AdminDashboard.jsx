import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/Store/authStore';
import { adminService } from '@/services/admin.service';
import { isAdminRole } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  Building2,
  Clock3,
  UserRound,
  Users,
  XCircle,
  Ban,
  Wallet,
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Crown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: pendingLocations = [], isLoading: loadingLocations } = useQuery({
    queryKey: ['adminPendingLocations'],
    queryFn: adminService.getPendingLocations,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: allLocations = [], isLoading: loadingAllLocations } = useQuery({
    queryKey: ['adminAllLocations'],
    queryFn: adminService.getAllLocations,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    enabled: isAdminRole(user?.role),
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getAllUsers,
    enabled: isAdminRole(user?.role),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: adminService.getAllBookings,
    enabled: isAdminRole(user?.role),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const approveMutation = useMutation({
    mutationFn: adminService.approveLocation,
    onSuccess: () => {
      toast.success('Parking location approved.');
      queryClient.invalidateQueries({ queryKey: ['adminPendingLocations'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllLocations'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to approve.'),
  });

  const rejectMutation = useMutation({
    mutationFn: adminService.rejectLocation,
    onSuccess: () => {
      toast.success('Parking location rejected.');
      queryClient.invalidateQueries({ queryKey: ['adminPendingLocations'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllLocations'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to reject.'),
  });

  const suspendMutation = useMutation({
    mutationFn: adminService.suspendLocation,
    onSuccess: () => {
      toast.success('Parking location suspended.');
      queryClient.invalidateQueries({ queryKey: ['adminAllLocations'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to suspend location.'),
  });

  const suspendUserMutation = useMutation({
    mutationFn: adminService.suspendUser,
    onSuccess: () => {
      toast.success('User suspended.');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to suspend user.'),
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  const platformFees = bookings.reduce((sum, b) => sum + parseFloat(b.platform_fee || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'booked').length;
  
  const stats = [
    { label: 'Pending Approvals', value: pendingLocations.length, icon: Clock3, color: 'from-amber-500 to-orange-500', trend: 12, delay: 0 },
    { label: 'Active Locations', value: allLocations.filter(l => l.status === 'approved').length, icon: Building2, color: 'from-emerald-500 to-teal-500', trend: 8, delay: 0.1 },
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500', trend: 15, delay: 0.2 },
    { label: 'Platform Revenue', value: `₹${platformFees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, color: 'from-purple-500 to-pink-500', trend: 22, delay: 0.3 },
  ];

  const filteredLocations = allLocations.filter(loc => 
    filterStatus === 'all' ? true : loc.status === filterStatus
  ).filter(loc => 
    loc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={24} className="text-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Admin Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-white/50 mt-2">Manage platform operations, users, and parking locations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Crown size={14} className="text-amber-400" />
                <span className="text-sm text-white/80">{user?.name || 'Admin'}</span>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 rounded-full">
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {}
        <Tabs defaultValue="approvals" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl">
              <TabsTrigger value="approvals" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Approvals
              </TabsTrigger>
              <TabsTrigger value="locations" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Locations
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Users
              </TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white">
                Bookings
              </TabsTrigger>
            </TabsList>
            
            {}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 outline-none focus:border-orange-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {}
          <TabsContent value="approvals">
            <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl text-white">Parking Approval Queue</CardTitle>
                <CardDescription className="text-white/50">Review and manage new parking location requests</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="text-orange-400 animate-spin" />
                  </div>
                ) : pendingLocations.length > 0 ? (
                  <div className="space-y-4">
                    {pendingLocations.map((location, idx) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 p-5 hover:bg-slate-950/70 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-500" />
                        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building2 size={20} className="text-orange-400" />
                              <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                              <StatusBadge status="pending" />
                            </div>
                            <p className="text-sm text-white/60">{location.address}, {location.city}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                              <span>Owner: {location.owner_name || 'N/A'}</span>
                              <span>Submitted: {new Date(location.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => approveMutation.mutate(location.id)} 
                              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
                            >
                              <BadgeCheck size={16} className="mr-2" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => rejectMutation.mutate(location.id)} 
                              variant="outline" 
                              className="rounded-full border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:border-rose-500/60"
                            >
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4">
                      <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
                    <p className="text-white/50">No pending approval requests at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {}
          <TabsContent value="locations">
            <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">All Parking Locations</CardTitle>
                    <CardDescription className="text-white/50">Manage all parking spots across the platform</CardDescription>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-orange-500/50"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingAllLocations ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="text-orange-400 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-950/50">
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/60">Location</TableHead>
                          <TableHead className="text-white/60">City</TableHead>
                          <TableHead className="text-white/60">Status</TableHead>
                          <TableHead className="text-white/60">Total Slots</TableHead>
                          <TableHead className="text-right text-white/60">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLocations.map((loc) => (
                          <TableRow key={loc.id} className="border-white/10 hover:bg-white/5 transition-colors">
                            <TableCell className="font-medium text-white">{loc.name}</TableCell>
                            <TableCell className="text-white/60">{loc.city}</TableCell>
                            <TableCell>
                              <StatusBadge status={loc.status} />
                            </TableCell>
                            <TableCell className="text-white/60">{loc.total_slots || 0}</TableCell>
                            <TableCell className="text-right">
                              {loc.status === 'approved' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                                      <MoreVertical size={16} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-slate-900 border-white/10">
                                    <DropdownMenuItem 
                                      onClick={() => suspendMutation.mutate(loc.id)}
                                      className="text-rose-400 focus:text-rose-400 focus:bg-rose-500/10"
                                    >
                                      <Ban size={14} className="mr-2" />
                                      Suspend Location
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {}
          <TabsContent value="users">
            <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl text-white">Platform Users</CardTitle>
                <CardDescription className="text-white/50">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="text-orange-400 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredUsers.map((u, idx) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/70 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                              <UserRound className="h-6 w-6 text-orange-400" />
                            </div>
                            {u.role === 'admin' && (
                              <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-0.5">
                                <Crown size={10} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.name}</p>
                            <p className="text-sm text-white/50">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className={`text-xs uppercase px-2 py-1 rounded-full ${
                            u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/60'
                          }`}>
                            {u.role}
                          </span>
                          {u.role !== 'admin' && u.role !== 'suspended' && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => suspendUserMutation.mutate(u.id)} 
                              className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                            >
                              <Ban size={14} />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {}
          <TabsContent value="bookings">
            <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-2xl text-white">Global Bookings</CardTitle>
                <CardDescription className="text-white/50">Monitor all transactions and platform fee earnings</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="text-orange-400 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-950/50">
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-white/60">Booking ID</TableHead>
                          <TableHead className="text-white/60">User</TableHead>
                          <TableHead className="text-white/60">Location</TableHead>
                          <TableHead className="text-white/60">Date</TableHead>
                          <TableHead className="text-white/60">Status</TableHead>
                          <TableHead className="text-right text-white/60">Platform Fee</TableHead>
                          <TableHead className="text-right text-white/60">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.length > 0 ? (
                          bookings.slice(0, 20).map((b) => (
                            <TableRow key={b.id} className="border-white/10 hover:bg-white/5 transition-colors">
                              <TableCell className="font-mono text-xs text-white/60">#{b.id}</TableCell>
                              <TableCell className="text-white">{b.user_name || b.user_email}</TableCell>
                              <TableCell className="text-white/80">{b.parking_name}</TableCell>
                              <TableCell className="text-white/60">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                              <TableCell><StatusBadge status={b.status} /></TableCell>
                              <TableCell className="text-right text-orange-400 font-semibold">₹{parseFloat(b.platform_fee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              <TableCell className="text-right font-bold text-white">₹{parseFloat(b.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-white/40">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;
