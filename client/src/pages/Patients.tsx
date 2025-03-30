import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Patient {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  address?: string;
  lastVisit: string;
}

export default function Patients() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      return response.json();
    }
  });

  const { data: patientAppointments } = useQuery({
    queryKey: ['patient-appointments', selectedPatient?.id],
    enabled: !!selectedPatient,
    queryFn: async () => {
      const response = await fetch(`/api/appointments?patientId=${selectedPatient?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Patients</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients?.map((patient: Patient) => (
                <div
                  key={patient.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-neutral-100 ${
                    selectedPatient?.id === patient.id ? 'bg-neutral-100' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.profileImage} />
                    <AvatarFallback>{patient.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-neutral-500">{patient.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedPatient && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedPatient.name}</CardTitle>
              <Button onClick={() => setIsAppointmentDialogOpen(true)}>
                Book Appointment
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="mt-6">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Email</h3>
                      <p className="text-sm text-neutral-600">{selectedPatient.email}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Address</h3>
                      <p className="text-sm text-neutral-600">{selectedPatient.address || 'Not provided'}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Last Visit</h3>
                      <p className="text-sm text-neutral-600">
                        {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                  {patientAppointments?.map((appointment: any) => (
                    <div key={appointment.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-neutral-500">{appointment.reason}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm capitalize" 
                              style={{
                                backgroundColor: appointment.status === 'completed' ? '#dcfce7' : 
                                                appointment.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
                                color: appointment.status === 'completed' ? '#166534' : 
                                       appointment.status === 'cancelled' ? '#991b1b' : '#1e40af'
                              }}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="prescriptions">
                  <div className="text-center py-4 text-neutral-500">
                    Prescription history will be displayed here
                  </div>
                </TabsContent>

                <TabsContent value="medical-history">
                  <div className="text-center py-4 text-neutral-500">
                    Medical history will be displayed here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <AppointmentForm 
            onSuccess={() => setIsAppointmentDialogOpen(false)}
            patientId={selectedPatient?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}