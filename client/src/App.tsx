import { Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/Appointments";
import Patients from "@/pages/Patients";
import Medicine from "@/pages/Medicine";
import ADRMonitoring from "@/pages/ADRMonitoring";
import Chatbot from "@/pages/Chatbot";
import Messages from "@/pages/Messages";
import AuthPage from "@/pages/auth-page";
import React, { useState, useEffect, createContext } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Settings from "@/pages/Settings"; // Added import for Settings component


// WebSocket Provider Component
export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <AppContent />
          <Toaster />
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={() => (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      )} />
      <ProtectedRoute path="/appointments" component={() => (
        <MainLayout>
          <Appointments />
        </MainLayout>
      )} />
      <ProtectedRoute path="/patients" component={() => (
        <MainLayout>
          <Patients />
        </MainLayout>
      )} />
      <ProtectedRoute path="/medicine" component={() => (
        <MainLayout>
          <Medicine />
        </MainLayout>
      )} />
      <ProtectedRoute path="/adr" component={() => (
        <MainLayout>
          <ADRMonitoring />
        </MainLayout>
      )} />
      <ProtectedRoute path="/chatbot" component={() => (
        <MainLayout>
          <Chatbot />
        </MainLayout>
      )} />
      <ProtectedRoute path="/messages" component={() => (
        <MainLayout>
          <Messages />
        </MainLayout>
      )} />
      <ProtectedRoute path="/settings" component={Settings} /> {/* Added settings route */}
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;