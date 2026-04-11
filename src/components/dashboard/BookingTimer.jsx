import React, { useState } from 'react';
import { Calendar, Timer } from 'lucide-react';
import { parseDateTimeValue } from '@/lib/parking';

function BookingTimer({ startTime, endTime, isActive }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState(null);

  React.useEffect(() => {
    if (!isActive || !endTime || !startTime) return;
    
    const calculateTime = () => {
      const startDate = parseDateTimeValue(startTime);
      const endDate = parseDateTimeValue(endTime);

      if (!startDate || !endDate) {
        return null;
      }

      const start = startDate.getTime();
      const end = endDate.getTime();
      const now = new Date().getTime();
      
      if (now < start) {
        return { diff: start - now, type: 'upcoming' };
      } else if (now <= end) {
        return { diff: end - now, type: 'active' };
      } else {
        return { diff: now - end, type: 'overstay' };
      }
    };

    const initTime = calculateTime();
    if (!initTime) return;
    setTimeLeft(initTime.diff);
    setStatus(initTime.type);

    const interval = setInterval(() => {
      const t = calculateTime();
      if (!t) return;
      setTimeLeft(t.diff);
      setStatus(t.type);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, isActive]);

  if (!isActive || !endTime || !startTime || timeLeft === null) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (status === 'upcoming') {
    return (
      <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-300/90">Starts In</span>
        </div>
        <span className="font-mono text-base font-bold text-blue-300">
          {timeString}
        </span>
      </div>
    );
  }

  const isOverstay = status === 'overstay';

  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
      isOverstay 
        ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20' 
        : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
    }`}>
      <div className="flex items-center gap-2">
        <Timer size={14} className={isOverstay ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
        <span className={`text-xs font-semibold ${isOverstay ? 'text-red-300/90' : 'text-emerald-300/90'}`}>
          {isOverstay ? 'Overstay Time' : 'Time Remaining'}
        </span>
      </div>
      <span className={`font-mono text-base font-bold ${isOverstay ? 'text-red-300' : 'text-emerald-300'}`}>
        {isOverstay ? `-${timeString}` : timeString}
      </span>
    </div>
  );
}
export default BookingTimer;