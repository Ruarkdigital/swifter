import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Minimize2, RotateCcw, Paperclip, File, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/hooks/useAIChat';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
}

interface AIChatWidgetProps {
  onSendMessage?: (message: string, files?: FileAttachment[]) => Promise<string>;
  apiEndpoint?: string;
  className?: string;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ 
  onSendMessage,
  apiEndpoint,
  className,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = ['image/*', 'text/*', '.pdf', '.doc', '.docx', '.txt']
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use the AI chat hook for state management
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat({
    apiEndpoint,
    onError: (error) => {
      console.error('AI Chat Widget Error:', error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: FileAttachment[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        console.warn(`File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`);
        return;
      }

      const fileAttachment: FileAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        url: URL.createObjectURL(file)
      };
      newFiles.push(fileAttachment);
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
  }, [maxFileSize]);

  const handleFileRemove = useCallback((fileId: string) => {
    setAttachedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.url) {
        URL.revokeObjectURL(removedFile.url);
      }
      return updated;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) return;

    const messageContent = inputValue.trim();
    const filesToSend = [...attachedFiles];
    setInputValue('');
    setAttachedFiles([]);

    try {
      if (onSendMessage) {
        // Use custom message handler if provided
        await onSendMessage(messageContent, filesToSend);
        // Handle custom response (this would need to be integrated with the hook)
        await sendMessage(messageContent);
      } else {
        // Use the hook's built-in API integration
        await sendMessage(messageContent);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.includes('text') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className={cn('fixed bottom-12 right-8 z-50', className)}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <img 
            src="/src/assets/Modal-Confirm Booking.svg" 
            alt="Chat with AI" 
            className="w-20 h-20"
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          'w-96 shadow-2xl transition-all duration-300 ease-in-out border-0',
          isMinimized ? 'h-12' : 'h-[600px]',
          isDragOver && 'ring-2 ring-blue-500 ring-opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
          {/* Chat Header */}
          <CardHeader className="p-4 bg-[#334155] text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Ask about this page
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearMessages}
                  className="h-6 w-6 text-white hover:bg-white/20"
                  title="Clear conversation"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={minimizeChat}
                  className="h-6 w-6 text-white hover:bg-white/20"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeChat}
                  className="h-6 w-6 text-white hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(100%-3rem)]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                          message.sender === 'user'
                            ? 'bg-[#2A4467] text-white'
                            : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={cn(
                          'text-xs mt-1 opacity-70',
                          message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-2">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFileRemove(file.id)}
                          className="h-6 w-6 text-slate-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 items-end">
                   <div className="flex-1 relative">
                     <textarea
                       ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyPress}
                       placeholder="Send a message"
                       disabled={isLoading}
                       rows={1}
                       className="w-full min-h-[40px] max-h-[120px] resize-none pr-10 py-2 px-3 border border-slate-300 focus:border-slate-400 rounded-lg bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
                       style={{
                         height: 'auto',
                         minHeight: '40px',
                         maxHeight: '120px'
                       }}
                       onInput={(e) => {
                         const target = e.target as HTMLTextAreaElement;
                         target.style.height = 'auto';
                         target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                       }}
                     />
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute right-1 bottom-1 h-8 w-8 text-slate-500 hover:text-slate-700"
                     >
                       <Paperclip className="h-4 w-4" />
                     </Button>
                   </div>
                   <Button
                     onClick={handleSendMessage}
                     disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
                     size="icon"
                     className="bg-slate-600 hover:bg-slate-700 rounded-lg h-10 w-10"
                   >
                     <Send className="h-4 w-4" />
                   </Button>
                 </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={allowedFileTypes.join(',')}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIChatWidget;