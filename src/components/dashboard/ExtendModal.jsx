import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, CheckCircle2 } from 'lucide-react';
import { bookingService } from '@/services/booking.service';
import { parseDateTimeValue } from '@/lib/parking';

const formatDate = (value) => {
  const date = parseDateTimeValue(value);
  return date ? date.toLocaleString() : 'Schedule pending';
};

function ExtendModal({ booking, onClose, onSuccess }) {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const EXTEND_OPTIONS = [
    { label: '+1 Hour', hours: 1, icon: '⏱️', price: 50, color: 'from-blue-500 to-cyan-500' },
    { label: '+2 Hours', hours: 2, icon: '⏰', price: 100, color: 'from-purple-500 to-pink-500' },
    { label: 'Full Day', hours: 8, icon: '☀️', price: 300, color: 'from-orange-500 to-red-500' },
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 shadow-2xl backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-5">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-2.5 shadow-lg">
                  <Timer size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Extend Parking</h2>
                  <p className="text-xs text-white/60">{booking.locationName || `Booking #${booking.id}`}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {}
          <div className="mx-6 mt-5 rounded-2xl border border-orange-400/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-orange-300/80 font-semibold">Current End Time</p>
            <p className="mt-1 text-lg font-bold text-orange-200">{formatDate(booking.endTime || booking.end_time)}</p>
          </div>

          {}
          <div className="px-6 py-5">
            <p className="mb-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Choose Extension</p>
            <div className="grid grid-cols-3 gap-3">
              {EXTEND_OPTIONS.map((opt) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={opt.hours}
                  onClick={() => setSelected(opt)}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    selected?.hours === opt.hours
                      ? `border-${opt.color.split('-')[1]}-400/60 bg-gradient-to-br ${opt.color}/20 shadow-[0_0_30px_rgba(249,115,22,0.3)]`
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="py-4 text-center">
                    <span className="text-3xl">{opt.icon}</span>
                    <p className="mt-2 text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-xs text-white/50 mt-1">+₹{opt.price}</p>
                    {selected?.hours === opt.hours && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {}
          <div className="border-t border-white/10 px-6 py-5 flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              disabled={!selected || isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 py-3.5 rounded-2xl text-base font-semibold text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extending...
                </div>
              ) : (
                `Confirm ${selected ? selected.label : 'Extension'}`
              )}
            </motion.button>
            <button
              onClick={onClose}
              disabled={isPending}
              className="w-full text-white/60 hover:text-white py-3 rounded-2xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
export default ExtendModal;