import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: number;
  name: string;
  profileImage?: string;
  lastSeen?: string;
  unreadCount?: number;
}

const Messages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['/api/messages/users'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/messages/users');
        return await response.json();
      } catch (error) {
        return [];
      }
    }
  });

  // Fetch messages for selected user
  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['/api/messages/conversation', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      try {
        const response = await apiRequest('GET', `/api/messages/conversation/${selectedUser.id}`);
        return await response.json();
      } catch (error) {
        return [];
      }
    },
    enabled: !!selectedUser
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedUser) throw new Error("No recipient selected");
      const response = await apiRequest('POST', '/api/messages', {
        receiverId: selectedUser.id,
        content
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Update conversation in cache
      queryClient.setQueryData(['/api/messages/conversation', selectedUser?.id], 
        (oldData: Message[] = []) => [...oldData, data]);
      
      // Clear input
      setMessageText('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-800">Messages</h1>
          <p className="text-neutral-500 mt-1">
            Communicate securely with patients and other healthcare providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Users List */}
          <Card className="overflow-hidden h-full lg:col-span-1">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto h-[calc(100%-4rem)]">
              {loadingUsers ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {users && users.map((user: User) => (
                    <li 
                      key={user.id}
                      className={`p-4 hover:bg-neutral-50 cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-neutral-100' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                          <p className="text-xs text-neutral-500 truncate">
                            {user.lastSeen ? `Last seen: ${formatDate(user.lastSeen)}` : 'Offline'}
                          </p>
                        </div>
                        {user.unreadCount ? (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                            {user.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                  {!users?.length && (
                    <li className="p-4 text-center text-neutral-500">
                      No conversations yet
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card className="h-full lg:col-span-2 flex flex-col">
            {selectedUser ? (
              <>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedUser.profileImage} />
                      <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {messages && messages.length > 0 ? (
                        messages.map((message: Message) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`rounded-lg p-3 max-w-[80%] ${
                                message.senderId === user?.id 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div className={`text-xs mt-1 ${message.senderId === user?.id ? 'text-primary-100' : 'text-neutral-400'}`}>
                                {formatDate(message.timestamp)}
                                {message.read && message.senderId === user?.id && (
                                  <span className="ml-2">✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-neutral-500">
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation by sending a message</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isSending || !messageText.trim()}
                    >
                      {isSending ? (
                        <div className="animate-spin h-4 w-4 border-2 border-b-transparent border-white rounded-full mr-2"></div>
                      ) : (
                        <span className="material-icons">send</span>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-neutral-500">
                  <span className="material-icons text-4xl mb-2">chat</span>
                  <h3 className="text-lg font-medium mb-1">No conversation selected</h3>
                  <p>Choose a contact from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;