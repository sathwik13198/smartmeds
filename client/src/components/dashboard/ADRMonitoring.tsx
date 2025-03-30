import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Chart from '@/components/ui/chart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const ADRMonitoring: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      // Request initial ADR data
      newSocket.send(JSON.stringify({ type: "REQUEST_ADR_UPDATE" }));
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "ADR_UPDATE") {
          // Update React Query cache with the new data
          queryClient.setQueryData('/api/adr/reports', data.reports);
          queryClient.setQueryData('/api/adr/statistics', data.statistics);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [queryClient]);

  // Fetch ADR reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/adr/reports'],
  });

  // Fetch ADR statistics
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/adr/statistics'],
  });

  // Mutation for refreshing ADR data
  const { mutate: refreshADRData, isPending: isRefreshing } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/adr/refresh', {});
      return await response.json();
    },
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData('/api/adr/reports', data.reports);
      queryClient.setQueryData('/api/adr/statistics', data.statistics);
    },
  });

  // Prepare chart data
  const chartData = reports ? 
    reports.map((report: any, index: number) => {
      // Create a date X days in the past
      const date = new Date();
      date.setDate(date.getDate() - (reports.length - index - 1));
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: 1,
        severity: report.severity,
        medication: report.medicationName || 'Unknown'
      };
    }).reduce((acc: any[], curr: any) => {
      // Group by date
      const existingDay = acc.find(d => d.date === curr.date);
      if (existingDay) {
        existingDay.count += 1;
        existingDay.severity = Math.max(existingDay.severity, curr.severity);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []) : 
    [];

  const isLoading = reportsLoading || statsLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ADR Monitoring Dashboard</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
            <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={() => refreshADRData()}
            disabled={isRefreshing}
            className="px-3 py-1 bg-primary text-white rounded-md text-sm flex items-center"
          >
            <span className="material-icons text-sm mr-1">refresh</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="h-64 mb-8">
              <Chart 
                data={chartData}
                type="bar"
                dataKeys={["count"]}
                xAxisDataKey="date"
                colors={["#2563eb"]}
                showLegend={false}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {reports?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Total ADR Reports
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-danger">
                    {statistics?.topMedicationName || 'Lisinopril'}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Most Reported Medication
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-warning">
                    {statistics?.commonSideEffect || 'Dry Cough'}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Most Common Side Effect
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-neutral-50 px-4 py-2 border-b font-medium">
                Recent ADR Reports
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {reports && reports.length > 0 ? (
                      reports.map((report: any) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {report.medicationName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {report.source}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-500 max-w-md truncate">
                            {report.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${report.severity >= 4 ? 'bg-red-100 text-red-800' : 
                                report.severity >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {report.severity}/5
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {new Date(report.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                          No ADR reports available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-neutral-50 border-t">
        <p className="text-xs text-neutral-500">
          Data sources: Twitter API and FDA Adverse Events Dataset. Updated in real-time.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ADRMonitoring;
