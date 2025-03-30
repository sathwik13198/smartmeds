import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ChatInterface from '@/components/chatbot/ChatInterface';

const Chatbot: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">AI Assistant</h1>
          <p className="text-neutral-500 mt-1">
            Intelligent assistance powered by GPT-3.5 for patient and medication inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
                <CardDescription>
                  How to get the most out of your AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">help</span>
                    Ask Medical Questions
                  </h3>
                  <p className="text-sm text-neutral-600">
                    "What are the common side effects of Lisinopril?"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">schedule</span>
                    Appointment Help
                  </h3>
                  <p className="text-sm text-neutral-600">
                    "I'd like to schedule a check-up next week"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">medication</span>
                    Medicine Information
                  </h3>
                  <p className="text-sm text-neutral-600">
                    "Can you explain how to take my medication?"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">summarize</span>
                    Get Summaries
                  </h3>
                  <p className="text-sm text-neutral-600">
                    "Summarize my appointments for today"
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <span className="text-sm">24/7 availability for patient inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <span className="text-sm">Medical information from trusted sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <span className="text-sm">Appointment scheduling assistance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <span className="text-sm">Medication reminders and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <span className="text-sm">Integration with hospital management system</span>
                  </li>
                </ul>

                <div className="mt-6 text-xs text-neutral-500">
                  <p className="font-medium">Important Note:</p>
                  <p>The AI assistant is not a replacement for professional medical advice. Always consult with a healthcare provider for medical decisions.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
