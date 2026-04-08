import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/Store/authStore';
import { adminService } from '@/services/admin.service';
import { isAdminRole } from '@/lib/auth';
import {
  BadgeCheck,
  Building2,
  Clock3,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';

const statusTone = {
  approved: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  pending: 'bg-amber-500/15 text-amber-100 border-amber-400/20',
  rejected: 'bg-rose-500/15 text-rose-100 border-rose-400/20',
};

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: pendingLocations = [], isLoading: loadingLocations } = useQuery({
    queryKey: ['adminPendingLocations'],
    queryFn: adminService.getPendingLocations,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: approvedLocations = [] } = useQuery({
    queryKey: ['adminApprovedLocations'],
    queryFn: adminService.getApprovedLocations,
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

  const approveMutation = useMutation({
    mutationFn: adminService.approveLocation,
    onSuccess: () => {
      toast.success('Parking location approved.');
      queryClient.invalidateQueries({ queryKey: ['adminPendingLocations'] });
      queryClient.invalidateQueries({ queryKey: ['adminApprovedLocations'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyLocations'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Unable to approve this parking location.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: adminService.rejectLocation,
    onSuccess: () => {
      toast.success('Parking location rejected.');
      queryClient.invalidateQueries({ queryKey: ['adminPendingLocations'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyLocations'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Unable to reject this parking location.');
    },
  });

  const stats = [
    { label: 'Pending approvals', value: pendingLocations.length, icon: Clock3 },
    { label: 'Approved locations', value: 0, icon: BadgeCheck },
    { label: 'Registered users', value: users.length, icon: Users },
    { label: 'Rejected locations', value: 0, icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.10),transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Admin control</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Review parking approvals and monitor platform activity.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              This panel is available for both admin and super admin roles to review parking requests
              and track the current platform inventory.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-white/10 bg-white/[0.04] text-white shadow-none">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-2xl text-white">Parking Approval Queue</CardTitle>
              <CardDescription className="text-slate-400">
                Review locations and update approval status without leaving the admin workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {loadingLocations ? (
                <div className="py-14 text-center text-slate-400">Loading parking requests...</div>
              ) : pendingLocations.length ? (
                pendingLocations.map((location) => (
                  <div
                    key={location.id}
                    className="rounded-[1.6rem] border border-white/10 bg-slate-950/50 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{location.name}</h3>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusTone[location.status] || statusTone.pending}`}>
                            {location.status || 'pending'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                          {[location.area, location.city, location.state].filter(Boolean).join(', ') || 'Location details pending'}
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <InfoChip label="Vehicle types" value={location.vehicleTypes.join(', ') || 'N/A'} />
                          <InfoChip label="Open slots" value={String(location.availableSlots || 0)} />
                          <InfoChip label="Starting price" value={`Rs. ${location.startingPrice || location.pricePerHour || 0}/hr`} />
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                        <Button
                          onClick={() => approveMutation.mutate(location.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        >
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => rejectMutation.mutate(location.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          variant="outline"
                          className="rounded-full border-rose-500/40 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-slate-950/45 py-14 text-center text-slate-400">
                  No pending parking approvals right now.
                </div>
              )}

            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] text-white shadow-none">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xl text-white">Platform Users</CardTitle>
                <CardDescription className="text-slate-400">
                  Snapshot of users currently returned by the admin API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {loadingUsers ? (
                  <div className="py-10 text-center text-slate-400">Loading users...</div>
                ) : users.length ? (
                  users.slice(0, 6).map((platformUser) => (
                    <div key={platformUser.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-orange-300">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{platformUser.name}</p>
                          <p className="text-sm text-slate-400">{platformUser.email}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs capitalize text-slate-300">
                        {platformUser.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-400">No user records returned.</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] text-white shadow-none">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-orange-300">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Approved inventory</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{approvedLocations.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
