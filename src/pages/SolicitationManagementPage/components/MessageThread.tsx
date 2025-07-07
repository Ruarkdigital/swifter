import React from "react";
import { Question } from "./QuestionsTab";
import MessageComponent from "./MessageComponent";


interface MessageThreadProps {
  question: Question;
  sendType: "reply" | "addendum" | null;
  onReply?: (questionId: string, type: "reply" | "addendum") => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  question,
  sendType,
  onReply,
}) => {
  // Convert the question and answer structure to a threaded format
  const buildThreadStructure = (question: Question) => {
    const thread = {
      id: question._id,
      note: question.note,
      createdAt: question.createdAt,
      user: question.user,
      replies: [] as any[],
    };

    if (question.responses) {
      const replies = question.responses.map((item) => ({
        id: `${item._id}-responses`,
        note: item.note,
        createdAt: item.createdAt,
        respondent: item.user,
        replies: item.responses,
      }));

      thread.replies = replies;
    }

    return thread;
  };

  const threadData = buildThreadStructure(question);
  const hasAnswer = question.isAnswered;

  return (
    <MessageComponent
      id={threadData.id}
      note={threadData.note}
      createdAt={threadData.createdAt}
      user={threadData.user}
      replies={threadData.replies}
      isQuestion={true}
      sendType={sendType}
      onReply={!hasAnswer ? onReply : undefined}
      showReplyButtons={!hasAnswer && !!onReply}
      depth={0}
    />
  );
};

export default MessageThread;
