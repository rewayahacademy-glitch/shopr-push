'use client';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  allowed: {
    label: 'Approuvé',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  review: {
    label: 'En révision',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  needs_review: {
    label: 'À réviser',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  doubtful: {
    label: 'Douteux',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  rejected: {
    label: 'Rejeté',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  forbidden: {
    label: 'Haram',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  pending: {
    label: 'En attente',
    className: 'bg-gray-100 text-gray-700 border border-gray-200',
  },
  // Statuts de décisions de feedback
  approved: {
    label: 'Approuvé',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
