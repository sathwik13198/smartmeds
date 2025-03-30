import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppointmentForm from '@/components/appointments/AppointmentForm';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  patientEmail: string;
  patientImage: string;
  date: string;
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  reason: string;
  status: string;
  notes?: string;
}

const Appointments: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }
      return response.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 1000
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: { hours: number; minutes: number }) => {
    return `${time.hours}:${String(time.minutes).padStart(2, '0')}`;
  };

  // Group appointments by status
  const groupedAppointments = appointments ? {
    upcoming: appointments.filter((a: Appointment) => a.status !== 'completed' && a.status !== 'cancelled'),
    completed: appointments.filter((a: Appointment) => a.status === 'completed'),
    cancelled: appointments.filter((a: Appointment) => a.status === 'cancelled')
  } : {
    upcoming: [],
    completed: [],
    cancelled: []
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Appointments</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center"
          >
            <span className="material-icons mr-2">add</span>
            New Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {['upcoming', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{status} Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-md shadow animate-pulse">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-neutral-200"></div>
                              <div className="ml-4">
                                <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-neutral-200 rounded w-32"></div>
                              </div>
                            </div>
                            <div className="h-4 bg-neutral-200 rounded w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupedAppointments[status as keyof typeof groupedAppointments].length > 0 ? (
                        groupedAppointments[status as keyof typeof groupedAppointments].map((appointment: Appointment) => (
                          <div key={appointment.id} className="bg-white p-4 rounded-md shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div className="flex items-center">
                                <img 
                                  src={appointment.patientImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'} 
                                  alt={appointment.patientName} 
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                  <h3 className="text-sm font-medium text-primary">{appointment.patientName}</h3>
                                  <p className="text-xs text-neutral-500">{appointment.patientEmail}</p>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center">
                                <div className="flex flex-col items-center justify-center bg-neutral-100 px-3 py-2 rounded-md mr-4">
                                  <span className="text-xs text-neutral-500">Date</span>
                                  <span className="text-sm font-medium">{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-neutral-100 px-3 py-2 rounded-md">
                                  <span className="text-xs text-neutral-500">Time</span>
                                  <span className="text-sm font-medium">{formatTime(appointment.time)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-xs text-neutral-500">Reason for Visit</h4>
                              <p className="text-sm">{appointment.reason}</p>
                            </div>
                            {appointment.notes && (
                              <div className="mt-2">
                                <h4 className="text-xs text-neutral-500">Notes</h4>
                                <p className="text-sm">{appointment.notes}</p>
                              </div>
                            )}
                            <div className="mt-4 flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                <span className="material-icons text-sm mr-1">visibility</span>
                                View Details
                              </Button>
                              {status === 'upcoming' && (
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                  <span className="material-icons text-sm mr-1">cancel</span>
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-neutral-500">
                          No {status} appointments found.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
