import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  iconBgColor: string;
  changeText?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, iconBgColor, changeText }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <span className="material-icons text-white">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-neutral-900">{value}</div>
                {changeText && (
                  <span className="ml-2 text-sm font-medium text-danger flex items-center">
                    {changeText}
                  </span>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsOverview: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-6 animate-pulse">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-md bg-neutral-200"></div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback data in case API doesn't return anything
  const data = stats || {
    totalPatients: 248,
    todayAppointments: 12,
    adrReports: 28,
    prescribedMedicines: 156
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Patients"
        value={data.totalPatients}
        icon="people"
        iconBgColor="bg-primary"
      />
      <StatsCard
        title="Today's Appointments"
        value={data.todayAppointments}
        icon="calendar_today"
        iconBgColor="bg-secondary"
      />
      <StatsCard
        title="ADR Reports"
        value={data.adrReports}
        icon="assessment"
        iconBgColor="bg-accent"
        changeText={
          <>
            <span className="material-icons text-xs">arrow_upward</span>
            <span>4.8%</span>
          </>
        }
      />
      <StatsCard
        title="Prescribed Medicines"
        value={data.prescribedMedicines}
        icon="medication"
        iconBgColor="bg-success"
      />
    </div>
  );
};

export default StatsOverview;
