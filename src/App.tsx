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
import { useToken, useUser } from "@/store/authSlice";

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
  const user = useUser();
  
  // Custom function to handle AI chat messages
  const handleAIChatMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://dev.swiftpro.tech/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, application/json'
        },
        body: JSON.stringify({
          userToken: token,
          stream: true,
          //  "model": "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        let errMsg = 'Unknown error';
        try {
          const errData = await response.json();
          errMsg = errData.message || errData.error || errMsg;
        } catch {}
        throw new Error(`API Error: ${response.status} - ${errMsg}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const data = await response.json();
        const direct =
          (data?.choices && data.choices[0]?.message?.content) ||
          data?.response ||
          data?.content ||
          data?.message;
        return direct || 'No response received from AI';
      }

      const contentType = response.headers.get('content-type') || '';
      const decoder = new TextDecoder();
      let buffer = '';
      let finalText = '';
      let doneReceived = false;

      while (!doneReceived) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        if (contentType.includes('text/event-stream')) {
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim();
            if (dataStr === '[DONE]') { buffer = ''; doneReceived = true; break; }
            // Only append actual content tokens; ignore info/metadata
            if (dataStr.startsWith('{') || dataStr.startsWith('[')) {
              try {
                const obj = JSON.parse(dataStr);
                const delta =
                  obj?.choices?.[0]?.delta?.content ??
                  obj?.content ??
                  obj?.message ??
                  obj?.response ??
                  '';
                if (typeof delta === 'string' && delta) finalText += delta;
              } catch {
                // ignore malformed partial JSON
              }
            }
          }
        } else {
          finalText += chunk;
          buffer = '';
        }
      }

      finalText = finalText.trim();
      return finalText || 'No response received from AI';
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  };

  // Streaming variant that emits deltas to a callback for live UI updates
  const handleAIChatMessageStream = async (
    message: string,
    onDelta: (partial: string) => void
  ): Promise<void> => {
    try {
      const response = await fetch('https://dev.swiftpro.tech/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, application/json'
        },
        body: JSON.stringify({
          userToken: token,
          stream: true,
          messages: [
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        let errMsg = 'Unknown error';
        try {
          const errData = await response.json();
          errMsg = errData.message || errData.error || errMsg;
        } catch {}
        throw new Error(`API Error: ${response.status} - ${errMsg}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const data = await response.json();
        const direct =
          (data?.choices && data.choices[0]?.message?.content) ||
          data?.response ||
          data?.content ||
          data?.message || '';
        if (direct) onDelta(direct);
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      const decoder = new TextDecoder();
      let buffer = '';
      let doneReceived = false;

      while (!doneReceived) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        if (contentType.includes('text/event-stream')) {
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim();
            if (dataStr === '[DONE]') { buffer = ''; doneReceived = true; break; }
            // Only emit actual content tokens; ignore info/metadata
            if (dataStr.startsWith('{') || dataStr.startsWith('[')) {
              try {
                const obj = JSON.parse(dataStr);
                const delta =
                  obj?.choices?.[0]?.delta?.content ??
                  obj?.content ??
                  obj?.message ??
                  obj?.response ??
                  '';
                if (typeof delta === 'string' && delta) onDelta(delta);
              } catch {
                // ignore malformed partial JSON
              }
            }
          }
        } else {
          if (chunk) onDelta(chunk);
          buffer = '';
        }
      }
    } catch (error) {
      console.error('AI Chat Stream Error:', error);
      throw new Error('Failed to stream AI response');
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
            {isAuthenticated && !isVendor && user?.isAi && (
              <AIChatWidget
                onSendMessage={handleAIChatMessage}
                onStreamMessage={handleAIChatMessageStream}
              />
            )}
          </QueryClientProvider>
          <Toaster />
        </Sentry.ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
