const fs = require('fs');
const content = fs.readFileSync('src/pages/UserDashboard.jsx', 'utf8');

const lines = content.split('\n');

const extendModalLines = lines.slice(33, 172).join('\n');
const reviewModalLines = lines.slice(173, 296).join('\n');
const bookingTimerLines = lines.slice(297, 382).join('\n');
const statCardLines = lines.slice(383, 408).join('\n');

if(!fs.existsSync('src/components/dashboard')) {
  fs.mkdirSync('src/components/dashboard', { recursive: true });
}

// Imports for ExtendModal
const extendModalFile = `import React, { useState } from 'react';
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

` + extendModalLines + `
export default ExtendModal;`;

// Imports for ReviewModal
const reviewModalFile = `import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { locationService } from '@/services/location.service';

` + reviewModalLines + `
export default ReviewModal;`;

// Imports for BookingTimer
const bookingTimerFile = `import React, { useState } from 'react';
import { Calendar, Timer } from 'lucide-react';
import { parseDateTimeValue } from '@/lib/parking';

` + bookingTimerLines + `
export default BookingTimer;`;

// Imports for StatCard
const statCardFile = `import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

` + statCardLines + `
export default StatCard;`;

fs.writeFileSync('src/components/dashboard/ExtendModal.jsx', extendModalFile);
fs.writeFileSync('src/components/dashboard/ReviewModal.jsx', reviewModalFile);
fs.writeFileSync('src/components/dashboard/BookingTimer.jsx', bookingTimerFile);
fs.writeFileSync('src/components/dashboard/DashboardStatCard.jsx', statCardFile);

// Now remove them from UserDashboard.jsx and add imports
const topImports = lines.slice(0, 33).join('\n') + `
import ExtendModal from '@/components/dashboard/ExtendModal';
import ReviewModal from '@/components/dashboard/ReviewModal';
import BookingTimer from '@/components/dashboard/BookingTimer';
import StatCard from '@/components/dashboard/DashboardStatCard';
`;

const remainingLines = lines.slice(408).join('\n');

fs.writeFileSync('src/pages/UserDashboard.jsx', topImports + remainingLines);
console.log('Successfully extracted components!');
