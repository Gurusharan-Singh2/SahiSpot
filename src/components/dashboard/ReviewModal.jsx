import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { locationService } from '@/services/location.service';

function ReviewModal({ booking, userName, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: () =>
      locationService.createLocationReview({
        locationId: booking.locationId,
        bookingId: booking.id,
        rating,
        comment,
        userName,
      }),
    onSuccess: () => {
      toast.success('Thanks for sharing your feedback.');
      queryClient.invalidateQueries({ queryKey: ['locationDetails', String(booking.locationId)] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Unable to submit your comment right now.');
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Please write a short comment before submitting.');
      return;
    }

    submitReview();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-950/95 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Add Comment</h2>
                <p className="mt-1 text-sm text-white/60">
                  Share your experience for {booking.locationName || `Booking #${booking.id}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Your Rating</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        value <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-white">Comment</label>
              <textarea
                rows={5}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell other drivers what went well, how the location felt, and anything useful to know."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-white/10 px-6 py-5">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-amber-700 disabled:opacity-60"
            >
              {isPending ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
export default ReviewModal;