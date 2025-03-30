import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MedicineRecommendation from '@/components/medicines/MedicineRecommendation';

interface Medication {
  id: number;
  name: string;
  description: string;
  dosage: string;
  sideEffects: string;
}

const Medicine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: medications, isLoading } = useQuery({
    queryKey: ['/api/medications'],
  });

  // Filter medications based on search query
  const filteredMedications = medications 
    ? medications.filter((medication: Medication) => 
        medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Medicine Management</h1>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-neutral-400 text-sm">search</span>
              </span>
              <Input
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <span className="material-icons mr-2">add</span>
              Add Medication
            </Button>
          </div>
        </div>

        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="medications">Medication List</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Available Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-md p-4 animate-pulse">
                        <div className="h-6 bg-neutral-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="h-4 bg-neutral-200 rounded"></div>
                          <div className="h-4 bg-neutral-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMedications.length > 0 ? (
                      filteredMedications.map((medication: Medication) => (
                        <div key={medication.id} className="border rounded-md p-4 hover:bg-neutral-50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-primary">{medication.name}</h3>
                              <p className="text-sm text-neutral-600 mt-1">{medication.description}</p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                              <span className="material-icons text-sm mr-1">info</span>
                              Details
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="text-xs text-neutral-500">Dosage</h4>
                              <p className="text-sm">{medication.dosage}</p>
                            </div>
                            <div>
                              <h4 className="text-xs text-neutral-500">Side Effects</h4>
                              <p className="text-sm">{medication.sideEffects}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-neutral-500">
                        {searchQuery 
                          ? `No medications found matching "${searchQuery}"` 
                          : "No medications found."}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <MedicineRecommendation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Medicine;
