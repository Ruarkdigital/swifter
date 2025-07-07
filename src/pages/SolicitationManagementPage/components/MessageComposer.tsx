import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RichTextEditor from "@/components/layouts/FormInputs/RichTextEditor";
import { useUser } from "@/store/authSlice";

interface MessageComposerProps {
  onSend: (content: string, type: "reply" | "addendum" | null) => void;
  isLoading?: boolean;
  replyToUser?: {
    name: string;
    avatar?: string;
  };
  currentUser?: {
    name: string;
    avatar?: string;
  };
  sendType: "reply" | "addendum" | null;
  isNewChat: boolean;
  onSendTypeChange: (type: "reply" | "addendum") => void;
}

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  isLoading = false,
  replyToUser,
  currentUser,
  sendType,
  isNewChat,
}) => {
  const [content, setContent] = useState("");
  const user = useUser();

  // Use authenticated user data or fallback to prop/default
  const displayUser = user
    ? {
        name: user.name,
        avatar: user.avatar,
      }
    : currentUser || { name: "You" };

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content, sendType);
    setContent("");
  };

  const isContentEmpty =
    !content.trim() ||
    content === "<p><br></p>" ||
    content === "<div><br></div>";

  return (
    <div className="rounded-lg">
      {/* Header */}
      {!isNewChat && sendType && (
        <div className="py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={displayUser.avatar} />
              <AvatarFallback className="text-lg">
                {getInitials(displayUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reply to:
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {replyToUser?.name || ""}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="">
        {/* Rich Text Editor */}
        <div className="mb-4">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder=""
            minHeight="200px"
            disabled={isLoading}
          />
          {/* Character Count */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              Character count: {content.replace(/<[^>]*>/g, "").length} of 500
            </span>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSend}
            disabled={isLoading || isContentEmpty}
            className="px-6 py-2 rounded-md font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Response"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
