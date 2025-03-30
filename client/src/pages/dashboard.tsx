import React from 'react';
import StatsOverview from '@/components/dashboard/StatsOverview';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import AIInsightsAndCharts from '@/components/dashboard/AIInsightsAndCharts';
import PatientsList from '@/components/dashboard/PatientsList';

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-neutral-800">Doctor Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Upcoming Appointments */}
        <UpcomingAppointments />

        {/* AI Insights and Charts */}
        <AIInsightsAndCharts />

        {/* Patients List */}
        <PatientsList />
      </div>
    </div>
  );
}
