import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ADRMonitoringComponent from '@/components/dashboard/ADRMonitoring';

const ADRMonitoringPage: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">ADR Monitoring</h1>
          <p className="text-neutral-500 mt-1">
            Real-time monitoring of Adverse Drug Reaction reports from Twitter and FDA data.
          </p>
        </div>

        <div className="space-y-6">
          <ADRMonitoringComponent />

          <Card>
            <CardHeader>
              <CardTitle>About ADR Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Adverse Drug Reaction (ADR) monitoring system uses advanced Natural Language Processing (NLP) 
                to detect mentions of medication side effects across social media platforms and FDA reports.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-blue-400">info</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside">
                        <li>Collects data from Twitter and FDA Adverse Events Dataset</li>
                        <li>Analyzes sentiment and severity using VADER for NLP analysis</li>
                        <li>Identifies concerning patterns and trends in real-time</li>
                        <li>Provides actionable insights for healthcare providers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Benefits for Healthcare Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                      <span className="material-icons text-green-600">trending_up</span>
                    </div>
                    <h4 className="ml-3 text-base font-medium">Early Detection</h4>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Identify potential adverse drug reactions before they become widespread problems.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                      <span className="material-icons text-blue-600">insights</span>
                    </div>
                    <h4 className="ml-3 text-base font-medium">Data-Driven Decisions</h4>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Make informed medication decisions based on real-world patient experiences.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                      <span className="material-icons text-purple-600">speed</span>
                    </div>
                    <h4 className="ml-3 text-base font-medium">Real-time Updates</h4>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Stay informed with continuous monitoring and instant notifications of emerging trends.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                      <span className="material-icons text-red-600">health_and_safety</span>
                    </div>
                    <h4 className="ml-3 text-base font-medium">Improved Patient Safety</h4>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    Enhance patient safety by proactively addressing potential medication risks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ADRMonitoringPage;
