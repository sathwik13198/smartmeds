import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AppointmentProps {
  id: number;
  patientId: number;
  patientName: string;
  patientImage: string;
  reason: string;
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  date: string;
  status: string;
}

const UpcomingAppointments: React.FC = () => {
  const { toast } = useToast();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments?today=true'],
  });

  const handleNewAppointment = () => {
    toast({
      title: "New Appointment Feature",
      description: "This feature will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-800">Upcoming Appointments</h2>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-neutral-200">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="px-6 py-4 animate-pulse">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-200"></div>
                  <div className="min-w-0 flex-1 px-4">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex-shrink-0 px-4">
                    <div className="h-4 bg-neutral-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-12"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-neutral-800">Upcoming Appointments</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="material-icons text-neutral-500 mr-2 text-sm">filter_list</span>
            Filter
          </button>
          <button 
            onClick={handleNewAppointment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="material-icons mr-2 text-sm">add</span>
            New Appointment
          </button>
        </div>
      </div>
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-neutral-200">
          {appointments && appointments.length > 0 ? (
            appointments.map((appointment: AppointmentProps) => (
              <li key={appointment.id} className="px-6 py-4 flex items-center">
                <div className="min-w-0 flex-1 flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={appointment.patientImage || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'} 
                      alt={`${appointment.patientName}'s avatar`} 
                    />
                  </div>
                  <div className="min-w-0 flex-1 px-4">
                    <div>
                      <p className="text-sm font-medium text-primary truncate">{appointment.patientName}</p>
                      <p className="mt-1 text-sm text-neutral-500 truncate">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4">
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-neutral-900">
                        {`${appointment.time.hours}:${String(appointment.time.minutes).padStart(2, '0')} ${appointment.time.hours >= 12 ? 'PM' : 'AM'}`}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">Today</p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button type="button" className="p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary">
                      <span className="material-icons">more_vert</span>
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4">
              <p className="text-center text-neutral-500">No appointments for today</p>
            </li>
          )}
        </ul>
        <div className="px-6 py-4 border-t border-neutral-200">
          <a href="#" className="text-sm font-medium text-primary hover:text-primary-600">
            View all appointments<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
