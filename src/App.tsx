import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorFallback } from "./components/layouts/Error";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Loading from "@/components/ui/Spinner";
import AIChatWidget from "./components/layouts/AIChatWidget";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useUserRole } from "@/hooks/useUserRole";
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
  
  // Custom function to handle AI chat messages
  const handleAIChatMessage = async (message: string): Promise<string> => {
    try {
      // TODO: Replace with actual API call to your custom backend
      // Example API call structure:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message })
      // });
      // const data = await response.json();
      // return data.response;
      
      // Simulated response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `I received your message: "${message}". This is a demo response from the AI assistant. Please integrate with your custom backend API.`;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  };

  return (
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
  );
}

export default App;
