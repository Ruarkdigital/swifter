## Overview

Implement real-time collaboration in the existing Yoopta-based editor using Yjs and y-websocket. We’ll bind each Yoopta block’s internal Slate editor to a Yjs shared type via slate-yjs, and use y-websocket for syncing between clients. Offline persistence uses y-indexeddb. No backend API changes.

## Approach

* Use the project’s existing dependencies: yjs, y-websocket, y-indexeddb, @slate-yjs/core, @slate-yjs/react.

* Wrap Yoopta plugins with a collaboration “extension” that binds each block’s Slate editor to a unique Yjs XmlFragment keyed by blockId.

* Connect/disconnect the slate-yjs binding on block lifecycle events.

* Scope v1 to collaborative text editing inside blocks; block order/moves are left out to avoid heavy custom CRDT design for Yoopta’s block model.

## Files to Add/Modify

1. Add a collaboration helper:

   * Path: /src/pages/CollaborationToolPage/collab/useYooptaYjs.ts

   * Provides setup for Y.Doc, WebsocketProvider, IndexeddbPersistence, and a function to wrap plugins with slate-yjs.
2. Update the EditorPanel to initialize collaboration and use collab-wrapped plugins.

   * Path: [EditorPanel.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx)

## Implementation Details

### 1) Collaboration Setup Hook

Create useYooptaYjs that:

* Initializes Y.Doc once, IndexeddbPersistence(roomId, doc), and WebsocketProvider(wsUrl, roomId, doc).

* Exposes wrapPluginsWithCollab(plugins, editor) which returns new plugin objects with extensions binding to Yjs per block.

```ts
// useYooptaYjs.ts (new file)
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { withYjs, YjsEditor } from '@slate-yjs/core'
import type { YooptaPlugin, YooEditor, SlateEditor } from '@yoopta/editor'

export type CollabConfig = {
  wsUrl: string
  roomId: string
}

export function createCollab(config: CollabConfig) {
  const doc = new Y.Doc()
  new IndexeddbPersistence(config.roomId, doc)
  const provider = new WebsocketProvider(config.wsUrl, config.roomId, doc)

  function wrapPluginsWithCollab(plugins: YooptaPlugin[], editor: YooEditor) {
    return plugins.map((plugin) => ({
      ...plugin,
      extensions: (slate: SlateEditor, yoo: YooEditor, blockId: string) => {
        const fragment = doc.getXmlFragment(`yoopta:${yoo.id}:block:${blockId}`)
        const e = withYjs(slate, fragment)
        // Connect once the editor is ready
        try { YjsEditor.connect(e) } catch {}
        return e
      },
      events: {
        ...(plugin.events ?? {}),
        onDestroy: (yoo: YooEditor, blockId: string) => {
          const slate = yoo.blockEditorsMap[blockId]
          if (slate) {
            try { YjsEditor.disconnect(slate) } catch {}
          }
          plugin.events?.onDestroy?.(yoo, blockId)
        },
      },
    })) as YooptaPlugin[]
  }

  return { doc, provider, wrapPluginsWithCollab }
}
```

### 2) EditorPanel Integration

* Initialize the collaboration setup with wsUrl and roomId.

* Wrap the PLUGINS with wrapPluginsWithCollab and pass them to YooptaEditor.

```tsx
// EditorPanel.tsx (modify)
import React, { useMemo, useState } from 'react'
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor'
import Paragraph from '@yoopta/paragraph'
// ... other imports
import { createCollab } from '../collab/useYooptaYjs'

const PLUGINS = [Paragraph, /* ... */]

const EditorPanel: React.FC<EditorPanelProps> = ({ className }) => {
  const editor = useMemo(() => createYooptaEditor(), [])
  const [value, setValue] = useState<YooptaContentValue>()

  const { wrapPluginsWithCollab } = useMemo(() =>
    createCollab({
      wsUrl: import.meta.env.VITE_YWS_URL ?? 'ws://localhost:1234',
      roomId: 'collab:editor', // can be route/param derived later
    }),
  [])

  const collabPlugins = useMemo(() => wrapPluginsWithCollab(PLUGINS, editor), [editor])

  const onChange = (v: YooptaContentValue, _opts: YooptaOnChangeOptions) => setValue(v)

  return (
    <YooptaEditor
      editor={editor}
      plugins={collabPlugins}
      marks={MARKS}
      tools={TOOLS}
      value={value}
      onChange={onChange}
      placeholder="Type text.."
      className="yoopta-editor w-full"
      style={{ width: '100%', paddingBottom: '120px' }}
    />
  )
}
```

### 3) Awareness (Optional v1)

* Presence/cursors can be added later using @slate-yjs/react CursorOverlay per block.

* For v1, we keep collaboration to text synchronization.

## Configuration

* Add VITE\_YWS\_URL in your .env (example: ws\://localhost:1234).

* Room IDs: use a stable identifier per document (hard-coded here as 'collab:editor').

## Verification

* Run a y-websocket server locally (e.g., `npx y-websocket-server --port 1234`).

* Open two browser windows to the Collaboration Tool page.

* Type into any block; changes reflect live across clients.

* Close and reopen; content rehydrates via IndexedDB and resyncs.

## Limitations & Next Steps

* v1 syncs text inside blocks. Block insert/delete/move and ordering are local-only.

* Next: model block order/meta in Yjs (Y.Array for order, Y.Map per block meta) and mirror Yoopta operations to Y updates; on remote changes, rebuild editor via setEditorValue.

* Add awareness UI: remote cursors and caret colors using @slate-yjs/react.

