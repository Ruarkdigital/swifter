import React from "react";
import { SEOWrapper } from "@/components/SEO";
import EditorPanel from "./components/EditorPanel";
import SidebarPanel from "./components/SidebarPanel";
import "@/pages/CollaborationToolPage/collaboration.css";
import { useSearchParams } from "react-router-dom";

const CollaborationToolPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const sourceUrl = searchParams.get("sourceUrl") || "";
  const fileName = searchParams.get("fileName") || "";
  const fileType = searchParams.get("fileType") || "";

  return (
    <>
      <SEOWrapper
        title="Collaboration Tool - SwiftPro eProcurement Portal"
        description="Collaborate on documents with a Notion-like editor and a live comments/log panel."
        robots="noindex, nofollow"
        canonical="/collaboration-tool"
      />
      <div className="flex min-h-svh bg-white">
        <div className="flex-1 max-w-7xl  overflow-auto">
          <EditorPanel importMeta={{ sourceUrl, fileName, fileType }} />
        </div>
        <SidebarPanel />
      </div>
    </>
  );
};

export default CollaborationToolPage;
