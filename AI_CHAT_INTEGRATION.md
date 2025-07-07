# AI Chat Widget Integration Guide

This document provides comprehensive instructions for integrating the AI Chat Widget with your custom backend API.

## Overview

The AI Chat Widget is a floating chat interface that appears at the bottom right of the application. It provides a seamless way for users to interact with your AI assistant through a custom backend API.

## Features

- **Floating Interface**: Appears as a button at bottom right, expands to full chat window
- **Minimize/Maximize**: Users can minimize the chat while keeping it accessible
- **Message History**: Maintains conversation history during the session
- **Loading States**: Shows typing indicators while waiting for AI responses
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to the application's theme
- **Clear Conversation**: Users can reset the chat history

## Components

### 1. AIChatWidget Component

Location: `/src/components/layouts/AIChatWidget/index.tsx`

**Props:**
- `onSendMessage?: (message: string) => Promise<string>` - Custom message handler
- `apiEndpoint?: string` - API endpoint for chat requests
- `className?: string` - Additional CSS classes

### 2. useAIChat Hook

Location: `/src/hooks/useAIChat.ts`

Provides state management and API integration for the chat functionality.

**Options:**
- `apiEndpoint?: string` - Default: '/api/chat'
- `onError?: (error: Error) => void` - Error callback

## Backend API Integration

### API Endpoint Requirements

Your backend should provide an endpoint that accepts POST requests with the following structure:

**Request:**
```json
{
  "message": "User's message content",
  "conversation_id": "unique_conversation_id",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "response": "AI assistant's response",
  "conversation_id": "unique_conversation_id",
  "timestamp": "2024-01-15T10:30:05.000Z"
}
```

### Example Backend Implementation

#### Node.js/Express Example

```javascript
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation_id, timestamp } = req.body;
    
    // Process the message with your AI service
    const aiResponse = await processWithAI(message, conversation_id);
    
    res.json({
      response: aiResponse,
      conversation_id: conversation_id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
});
```

#### Python/FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str
    timestamp: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Process the message with your AI service
        ai_response = await process_with_ai(request.message, request.conversation_id)
        
        return ChatResponse(
            response=ai_response,
            conversation_id=request.conversation_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Sorry, I encountered an error. Please try again."
        )
```

## Integration Methods

### Method 1: Using the Built-in Hook (Recommended)

Update your `App.tsx` to specify the API endpoint:

```tsx
import AIChatWidget from "./components/layouts/AIChatWidget";

function App() {
  return (
    <div>
      {/* Your app content */}
      <AIChatWidget apiEndpoint="/api/chat" />
    </div>
  );
}
```

### Method 2: Using Custom Message Handler

For more control over the API integration:

```tsx
import AIChatWidget from "./components/layouts/AIChatWidget";

function App() {
  const handleAIChatMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`, // Add auth if needed
        },
        body: JSON.stringify({
          message,
          conversation_id: userId, // Use user ID or session ID
          timestamp: new Date().toISOString(),
          context: additionalContext // Add any additional context
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to get AI response');
    }
  };

  return (
    <div>
      {/* Your app content */}
      <AIChatWidget onSendMessage={handleAIChatMessage} />
    </div>
  );
}
```

## Customization

### Styling

The widget uses Tailwind CSS classes and can be customized by:

1. **Modifying the component directly** for structural changes
2. **Using the className prop** to add additional styles
3. **Updating the color scheme** by changing the `bg-[#2A4467]` classes

### Message Format

To customize message display, modify the message rendering section in the component:

```tsx
// In AIChatWidget component
<div className="space-y-4">
  {messages.map((message) => (
    <div key={message.id} className={/* your custom classes */}>
      {/* Custom message rendering */}
    </div>
  ))}
</div>
```

## Security Considerations

1. **Authentication**: Add proper authentication headers to API requests
2. **Rate Limiting**: Implement rate limiting on your backend
3. **Input Validation**: Validate and sanitize user inputs
4. **CORS**: Configure CORS properly for your domain
5. **Content Filtering**: Implement content filtering for inappropriate messages

## Error Handling

The widget includes comprehensive error handling:

- **Network Errors**: Displays user-friendly error messages
- **API Errors**: Handles HTTP error responses gracefully
- **Timeout Handling**: Manages request timeouts
- **Retry Logic**: Can be extended to include retry mechanisms

## Testing

To test the integration:

1. **Start your backend API** on the configured endpoint
2. **Open the application** and click the chat button
3. **Send test messages** to verify the integration
4. **Check browser console** for any error messages
5. **Test error scenarios** by temporarily stopping the backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **404 Errors**: Verify the API endpoint URL is correct
3. **Authentication Errors**: Check if authentication headers are properly set
4. **Timeout Issues**: Increase timeout values if your AI processing takes longer

### Debug Mode

Enable debug logging by adding console.log statements in the useAIChat hook:

```tsx
const sendMessage = useCallback(async (content: string): Promise<void> => {
  console.log('Sending message:', content);
  // ... rest of the function
}, []);
```

## Performance Optimization

1. **Message Pagination**: Implement pagination for long conversations
2. **Debouncing**: Add debouncing for rapid message sending
3. **Caching**: Cache recent responses for similar queries
4. **Lazy Loading**: Load chat history on demand

## Future Enhancements

- **File Upload Support**: Allow users to upload files
- **Voice Messages**: Add voice input/output capabilities
- **Message Reactions**: Allow users to react to messages
- **Conversation Export**: Export chat history
- **Multi-language Support**: Support for multiple languages
- **Typing Indicators**: Show when AI is typing
- **Message Threading**: Support for threaded conversations

## Support

For additional support or questions about the AI Chat Widget integration, please refer to the project documentation or contact the development team.