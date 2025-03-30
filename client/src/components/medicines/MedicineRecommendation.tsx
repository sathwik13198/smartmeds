import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AppItem {
  name: string;
  url: string;
}

interface RecommendationResult {
  apps: AppItem[];
  alternatives: string[];
  information: string;
}

const MedicineRecommendation: React.FC = () => {
  const [medication, setMedication] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const { toast } = useToast();

  const { mutate: getRecommendations, isPending } = useMutation({
    mutationFn: async (medicationName: string) => {
      try {
        // For a real app, we'd query a specific medication ID
        // Here we'll use a more generic route for demo purposes
        const response = await apiRequest('GET', `/api/medications/1/recommendations`, {});
        return await response.json();
      } catch (error) {
        throw new Error('Failed to get recommendations');
      }
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get medication recommendations. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medication.trim()) {
      getRecommendations(medication);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Medicine Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="medication">Medication Name</Label>
            <div className="flex gap-2">
              <Input
                id="medication"
                placeholder="Enter medication name"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isPending || !medication.trim()}>
                {isPending ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </form>

        {isPending && (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">General Information</h3>
              <p className="text-neutral-700">{result.information}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Where to Purchase</h3>
              <div className="grid gap-2">
                {result.apps.map((app, index) => (
                  <a
                    key={index}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-primary hover:bg-neutral-50"
                  >
                    <span className="material-icons mr-2 text-neutral-500">shopping_cart</span>
                    {app.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Alternative Medications</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-700">
                {result.alternatives.map((alternative, index) => (
                  <li key={index}>{alternative}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-neutral-50 text-xs text-neutral-500">
        Powered by GPT-3.5 • Recommendations are for informational purposes only
      </CardFooter>
    </Card>
  );
};

export default MedicineRecommendation;
