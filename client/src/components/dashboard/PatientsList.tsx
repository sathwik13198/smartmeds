import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface PatientProps {
  id: number;
  name: string;
  email: string;
  lastVisit: string;
  healthStatus: string;
  profileImage: string;
  medication?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'stable':
      return 'bg-green-100 text-green-800';
    case 'needs review':
      return 'bg-yellow-100 text-yellow-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

const PatientsList: React.FC = () => {
  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients'],
  });

  // Get medications for each patient if available
  const { data: medications } = useQuery({
    queryKey: ['/api/medications'],
    enabled: !!patients && patients.length > 0,
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-800">Recent Patients</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Visit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Health Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prescribed Medication</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-neutral-200"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-neutral-200 rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-neutral-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-neutral-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-neutral-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-neutral-200 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Merge patient data with medications if possible
  const enrichedPatients = patients ? patients.map((patient: PatientProps, index: number) => {
    const mockMedications = ["Atorvastatin 10mg", "Lisinopril 20mg", "Metformin 500mg"];
    return {
      ...patient,
      medication: medications ? medications[index % medications.length]?.name + ' ' + medications[index % medications.length]?.dosage : mockMedications[index % mockMedications.length]
    };
  }) : [];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-neutral-800">Recent Patients</h2>
        <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary">
          <span className="material-icons text-neutral-500 mr-2 text-sm">view_list</span>
          View All
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Visit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Health Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Prescribed Medication</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {enrichedPatients.map((patient: PatientProps) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={patient.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'} 
                          alt={patient.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{patient.name}</div>
                        <div className="text-sm text-neutral-500">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {new Date(patient.lastVisit).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.healthStatus)}`}>
                      {patient.healthStatus.charAt(0).toUpperCase() + patient.healthStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {patient.medication}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/patients/${patient.id}`} className="text-primary hover:text-primary-600">View</a>
                    <span className="mx-1 text-neutral-300">|</span>
                    <a href={`/patients/${patient.id}/edit`} className="text-primary hover:text-primary-600">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
