import React from 'react';
import { CheckCircle, Clock3, XCircle, Ban, Activity } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    approved: { icon: CheckCircle, label: 'Approved', color: 'emerald' },
    pending: { icon: Clock3, label: 'Pending', color: 'amber' },
    rejected: { icon: XCircle, label: 'Rejected', color: 'rose' },
    suspended: { icon: Ban, label: 'Suspended', color: 'rose' },
    active: { icon: Activity, label: 'Active', color: 'emerald' },
    completed: { icon: CheckCircle, label: 'Completed', color: 'blue' },
  };
  
  const { icon: Icon, label, color } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-${color}-400/20 bg-${color}-500/10 px-2.5 py-1 text-xs font-semibold text-${color}-200`}>
      <Icon size={10} />
      {label}
    </span>
  );
};

export default StatusBadge;
