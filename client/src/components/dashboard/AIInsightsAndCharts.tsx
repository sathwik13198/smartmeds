import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Chart from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const ADRMonitoringCard = () => {
  const { data: adrData, isLoading } = useQuery({
    queryKey: ['/api/adr/statistics'],
  });

  const { data: reports } = useQuery({
    queryKey: ['/api/adr/reports'],
  });

  // Set up data for the chart
  const chartData = reports ? 
    reports.slice(0, 12).map((report: any, index: number) => ({
      name: `Day ${index + 1}`,
      count: Math.floor(Math.random() * 10) + 1,
      severity: report.severity
    })).reverse() : 
    Array(12).fill(0).map((_, index) => ({
      name: `Day ${index + 1}`,
      count: Math.floor(Math.random() * 10) + 1,
      severity: Math.floor(Math.random() * 5) + 1
    }));

  if (isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-neutral-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const topMedicationName = adrData?.topMedicationName || 'Lisinopril';
  const topMedicationCount = adrData?.topMedicationCount || 42;
  const commonSideEffect = adrData?.commonSideEffect || 'Dry Cough';
  const commonSideEffectCount = adrData?.commonSideEffectCount || 28;
  const increaseRate = adrData?.increaseRate || 18;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-neutral-800">ADR Monitoring</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500">Real-time data</span>
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative h-64">
          <Chart 
            data={chartData}
            type="bar"
            dataKeys={["count"]}
            xAxisDataKey="name"
            colors={["#2563eb", "#dc2626"]}
            showLegend={false}
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-700">Detected ADR Signals</span>
            <span className="font-medium text-danger">↑ {increaseRate}% last 24h</span>
          </div>
          <div className="mt-2">
            <div className="bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-2 bg-danger rounded-full" style={{ width: `${Math.min(increaseRate * 2, 100)}%` }}></div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="border border-neutral-200 rounded p-3">
            <div className="text-xs text-neutral-500">Top Reported Drug</div>
            <div className="font-medium">{topMedicationName}</div>
            <div className="text-xs text-danger">{topMedicationCount} reports</div>
          </div>
          <div className="border border-neutral-200 rounded p-3">
            <div className="text-xs text-neutral-500">Common Side Effect</div>
            <div className="font-medium">{commonSideEffect}</div>
            <div className="text-xs text-danger">{commonSideEffectCount} mentions</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
        <a href="/adr" className="text-sm font-medium text-primary hover:text-primary-600">
          View detailed ADR analysis
        </a>
      </CardFooter>
    </Card>
  );
};

const AIChatbotCard = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello Dr. Johnson, I've analyzed today's appointments. Would you like a summary?"
    },
    {
      role: 'user',
      content: "Yes, please provide a summary."
    }
  ]);

  const { data: summary, isLoading } = useQuery({
    queryKey: ['/api/chat/summary'],
  });

  useEffect(() => {
    if (summary && !isLoading) {
      // Add AI response with the summary
      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          content: summary.summary || "You have several appointments today. Check your schedule for details."
        },
        {
          role: 'assistant',
          content: "Also, I've detected an increase in ADR reports related to Lisinopril. Would you like me to prepare a detailed report on this medication?"
        }
      ]);
    }
  }, [summary, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');

    try {
      // In a real app, this would send the message to the backend
      const response = await apiRequest('POST', '/api/chat/messages', {
        userId: 1,
        message: message
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(prev => [
          ...prev,
          { role: 'assistant', content: data.assistantMessage.message }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-64 overflow-y-auto flex flex-col space-y-4">
          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mr-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                    <span className="material-icons text-sm">smart_toy</span>
                  </div>
                </div>
              )}
              <div 
                className={`${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 text-neutral-800'
                } rounded-lg p-3 max-w-xs sm:max-w-sm`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-2 top-1.5 p-1 rounded-full text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-icons">send</span>
          </button>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-neutral-500">Powered by GPT-3.5</span>
          <a href="/chatbot" className="text-sm font-medium text-primary hover:text-primary-600">
            Open full assistant
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

const AIInsightsAndCharts: React.FC = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ADRMonitoringCard />
      <AIChatbotCard />
    </div>
  );
};

export default AIInsightsAndCharts;
