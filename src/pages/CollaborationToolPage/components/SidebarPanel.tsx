import React, { useState } from "react";
import { cn } from "@/lib/utils";
import "@/pages/CollaborationToolPage/collaboration.css";
import FeedItem from "./FeedItem";
import WriteComment from "./WriteComment";

interface SidebarPanelProps {
  className?: string;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ className }) => {
  const [tab, setTab] = useState<"comments" | "log">("comments");
  const avatarPublic = "/assets/collaboration/avatar-user.png";

  return (
    <div className={cn("ct-sidebar-panel", className)}>
      <div className="ct-segment">
        <button
          className={cn("ct-segment-btn", tab === "comments" && "ct-segment-btn-active")}
          onClick={() => setTab("comments")}
          aria-pressed={tab === "comments"}
        >
          {tab === "comments" ? "Comments" : "Comments"}
        </button>
        <button
          className={cn("ct-segment-btn", tab === "log" && "ct-segment-btn-active")}
          onClick={() => setTab("log")}
          aria-pressed={tab === "log"}
        >
          {tab === "log" ? "Action Log" : "Log"}
        </button>
      </div>

      {tab === "comments" ? (
        <div className="ct-comments-view my-5">
          <div className="ct-section-header">
            <span className="ct-section-title">Comments and activity</span>
            <div className="ct-avatars-cluster">
              <img src={avatarPublic} alt="Kate" className="ct-avatar-cluster-item" />
              <img src={avatarPublic} alt="Kate" className="ct-avatar-cluster-item second" />
              <img src={avatarPublic} alt="Kate" className="ct-avatar-cluster-item second" />
            </div>
          </div>

          <WriteComment />

          <div className="ct-feed mt-5">
            <FeedItem
              avatarSrc={avatarPublic}
              name="Kate Morrison"
              timestamp="5:20pm 20 Jan 2022"
              message="Office ipsum you must be muted. Breakout ensure what's."
            />
            <FeedItem
              avatarSrc={avatarPublic}
              name="Kate Morrison"
              timestamp="5:20pm 20 Jan 2022"
              message="Kate Uploaded a document"
              attachment={{ filename: "Tech requirements.pdf", size: "720 KB" }}
              showDot={false}
            />
          </div>
        </div>
      ) : (
        <div className="ct-log-view my-5">
          <div className="ct-log-title">Log</div>
          <div className="ct-feed mt-5">
            <FeedItem
              avatarSrc={avatarPublic}
              name="Kate Morrison"
              timestamp="5:20pm 20 Jan 2022"
              message="Edited The contract"
            />
            <FeedItem
              avatarSrc={avatarPublic}
              name="Kate Morrison"
              timestamp="5:20pm 20 Jan 2022"
              message="Drop a comment"
            />
            <FeedItem
              avatarSrc={avatarPublic}
              name="Kate Morrison"
              timestamp="5:20pm 20 Jan 2022"
              message="Kate Uploaded a document"
              attachment={{ filename: "Tech requirements.pdf", size: "720 KB" }}
              showDot={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarPanel;

