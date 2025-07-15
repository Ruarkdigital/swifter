import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorFallback } from "./components/layouts/Error";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Loading from "@/components/ui/Spinner";
import AIChatWidget from "./components/layouts/AIChatWidget";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useUserRole } from "@/hooks/useUserRole";
import { useToken } from "@/store/authSlice";

import * as Sentry from "@sentry/react";
import { routes } from "./routes";
import { Suspense } from "react";


const RenderLoader = () => {
  return (
    <div className="flex flex-auto items-center justify-center flex-col min-h-[100vh]">
      <Loading />
    </div>
  );
};

// Create router with proper configuration
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthentication();
  const { isVendor } = useUserRole();
  const token = useToken();
  
  // Custom function to handle AI chat messages
  const handleAIChatMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://dev.swiftpro.tech/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userToken: token,
          //  "model": "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.message || 'Unknown error'}`);
      }
      
      // Extract the actual message content from the API response
      let aiResponse;
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        aiResponse = data.choices[0].message.content;
      } else if (data.response) {
        aiResponse = data.response;
      } else if (data.content) {
        aiResponse = data.content;
      } else if (data.message) {
        aiResponse = data.message;
      } else {
         aiResponse = 'No response received from AI';
       }
       
       return aiResponse;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  };

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="swiftpro-theme">
        <Sentry.ErrorBoundary fallback={({ error }) => <ErrorFallback error={error} />}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<RenderLoader />}>
              <RouterProvider router={router} />
            </Suspense>
            {isAuthenticated && !isVendor && <AIChatWidget onSendMessage={handleAIChatMessage} />}
          </QueryClientProvider>
          <Toaster />
        </Sentry.ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
