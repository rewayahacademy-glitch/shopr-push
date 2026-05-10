'use client';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'indigo' | 'green' | 'yellow' | 'red' | 'blue';
  subtitle?: string;
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-100 text-indigo-600',
    value: 'text-indigo-700',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-700',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-600',
    value: 'text-yellow-700',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-700',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
  },
};

export default function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${c.value}`}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className={`rounded-xl ${c.icon} p-3 text-2xl`}>{icon}</div>
      </div>
    </div>
  );
}
