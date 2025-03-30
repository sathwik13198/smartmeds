import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: number;
  message: string;
  role: 'system' | 'user' | 'assistant';
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Fetch chat history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['/api/chat/messages'],
  });
  
  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat/messages', {
        userId: 1, // Using a fixed user ID
        message
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Update messages in cache
      queryClient.setQueryData(['/api/chat/messages'], (oldData: Message[] = []) => {
        return [...oldData, data.userMessage, data.assistantMessage];
      });
      
      // Clear input field
      setInputMessage('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
  };
  
  // Group messages by date
  const groupedMessages = () => {
    if (!messages) return {};
    
    const groups: Record<string, Message[]> = {};
    
    messages.forEach((message: Message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <span className="material-icons mr-2 text-primary">smart_toy</span>
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {Object.entries(groupedMessages()).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map((message: Message) => (
                    <div 
                      key={message.id}
                      className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white mr-2">
                          <span className="material-icons text-sm">smart_toy</span>
                        </div>
                      )}
                      <div 
                        className={`rounded-lg p-3 max-w-md ${
                          message.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
                        }`}
                      >
                        <p>{message.message}</p>
                        <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-100' : 'text-neutral-400'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isPending || !inputMessage.trim()}
          >
            {isPending ? (
              <div className="animate-spin h-4 w-4 border-2 border-b-transparent border-white rounded-full mr-2"></div>
            ) : (
              <span className="material-icons">send</span>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
