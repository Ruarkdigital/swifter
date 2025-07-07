import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{count}</p>
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  );
};

const UserStats: React.FC = () => {
  // Placeholder data - this will eventually come from an API
  const stats = [
    { title: 'All Users', count: 20, icon: <UserGroupIcon /> },
    { title: 'Admins', count: 3, icon: <UserIcon /> },
    { title: 'Procurement Leads', count: 7, icon: <UserIcon /> },
    { title: 'Evaluators', count: 10, icon: <UserIcon /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} count={stat.count} icon={stat.icon} />
      ))}
    </div>
  );
};

// Placeholder Icons - these should be replaced with actual SVG icons
const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719" />
  </svg>
);

const UserIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export default UserStats;