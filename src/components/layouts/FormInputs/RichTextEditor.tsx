import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type your message...',
  className,
  disabled = false,
  minHeight = '120px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && !disabled) {
      isUpdatingRef.current = true;
      const content = editorRef.current.innerHTML;
      onChange(content);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Handle common formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={cn('border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => formatText('bold')}
          disabled={disabled}
          className="p-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Bold (Ctrl+B)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a1 1 0 000 2h1v10H5a1 1 0 100 2h6a4 4 0 001.866-7.539A3.5 3.5 0 0011 3H5zm6 6a1.5 1.5 0 100-3H8v3h3zm0 2H8v3h3a1.5 1.5 0 000-3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          disabled={disabled}
          className="p-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Italic (Ctrl+I)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 000 2h1.5l-2 10H6a1 1 0 100 2h6a1 1 0 100-2h-1.5l2-10H14a1 1 0 100-2H8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          disabled={disabled}
          className="p-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Underline (Ctrl+U)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12a1 1 0 100-2H4a1 1 0 100 2zM6 4a1 1 0 011-1h6a1 1 0 110 2v4a3 3 0 11-6 0V5a1 1 0 01-1-1z" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          disabled={disabled}
          className="p-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          disabled={disabled}
          className="p-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          'p-3 outline-none focus:ring-0 overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
          'prose prose-sm max-w-none dark:prose-invert',
          disabled && 'opacity-50 cursor-not-allowed',
          !value && 'text-gray-500 dark:text-gray-400'
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .dark [contenteditable]:empty:before {
          color: #6b7280;
        }
        [contenteditable]:focus:before {
          content: none;
        }
        .ql-toolbar {
          border: 1px solid #e2e8f0;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f8fafc;
        }
        .dark .ql-toolbar {
          border-color: #374151;
          background: #1f2937;
        }
        .ql-container {
          border: 1px solid #e2e8f0;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: inherit;
        }
        .dark .ql-container {
          border-color: #374151;
          background: #111827;
        }
        .ql-editor {
          min-height: 120px;
          font-size: 14px;
          line-height: 1.5;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .ql-snow .ql-tooltip {
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;