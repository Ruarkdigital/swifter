/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import Blockquote from "@yoopta/blockquote";
import Divider from "@yoopta/divider";
import Code from "@yoopta/code";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import {
  Bold,
  Italic,
  Underline,
  Strike,
  CodeMark,
  Highlight,
} from "@yoopta/marks";
import { YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { cn } from "@/lib/utils";
import "@/pages/CollaborationToolPage/collaboration.css";
import { createCollab } from "../collab/useYooptaYjs";
import Table from "@yoopta/table";
import { useNavigate } from "react-router-dom";
import { convertFileUrlToYoopta } from "@/lib/fileToYoopta";
import { XIcon } from "lucide-react";

const PLUGINS = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  BulletedList,
  NumberedList,
  TodoList,
  Blockquote,
  Divider,
  Code,
  Image,
  Link,
  Table,
];

const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight];

const TOOLS = {
  Toolbar: { tool: Toolbar, render: DefaultToolbarRender },
  ActionMenu: { tool: ActionMenu, render: DefaultActionMenuRender },
  LinkTool: { tool: LinkTool, render: DefaultLinkToolRender },
};

interface EditorPanelProps {
  className?: string;
  initialValue?: string;
  importMeta?: {
    sourceUrl: string;
    fileName: string;
    fileType: string;
  };
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  className,
  importMeta,
}) => {
  const navigate = useNavigate();
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (v: YooptaContentValue, _opts: YooptaOnChangeOptions) =>
    setValue(v);

  const { wrapPluginsWithCollab } = useMemo(
    () =>
      createCollab({
        wsUrl: import.meta.env.VITE_YWS_URL ?? "ws://localhost:1234",
        roomId: "collab:editor",
        disable: true,
      }),
    []
  );

  const collabPlugins = useMemo(
    () => wrapPluginsWithCollab(PLUGINS),
    [wrapPluginsWithCollab]
  );

  useEffect(() => {
    if (!importMeta) return;
    convertFileUrlToYoopta(
      editor,
      importMeta.sourceUrl,
      importMeta.fileName,
      importMeta.fileType
    ).then((content) => {
      editor.setEditorValue(content);
      setValue(content);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importMeta]);

  return (
    <div className={cn("ct-editor-panel", className)}>
      <div className="ct-editor-header">
        <span className="ct-editor-title">Document Editor</span>
        <div
          className="ct-dismiss-pill cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <XIcon className="ct-editor-dismiss w-6 h-6" />
        </div>
      </div>
      <div className="ct-editor-canvas pl-[4.5rem] mt-5">
        <YooptaEditor
          editor={editor}
          plugins={collabPlugins}
          marks={MARKS}
          tools={TOOLS}
          value={value}
          onChange={onChange}
          placeholder="Type text.."
          className="yoopta-editor w-full"
          style={{ width: "100%", paddingBottom: "120px" }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
