import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { withYjs, YjsEditor } from "@slate-yjs/core";
import type { YooEditor, SlateEditor, SlateElement } from "@yoopta/editor";
import { YooptaPlugin } from "@yoopta/editor";

export type CollabConfig = {
  wsUrl: string;
  roomId: string;
  disable?: boolean;
};

export function createCollab(config: CollabConfig) {
  const doc = new Y.Doc();
  new IndexeddbPersistence(config.roomId, doc);
  const provider = config.disable
    ? undefined
    : new WebsocketProvider(config.wsUrl, config.roomId, doc);

  function wrapPluginsWithCollab(
    plugins: YooptaPlugin<any, any>[]
  ) {
    function withCollabPlugin<
      TElementMap extends Record<string, SlateElement>,
      TOptions
    >(
      plugin: YooptaPlugin<TElementMap, TOptions>
    ): YooptaPlugin<TElementMap, TOptions> {
      const base = plugin.getPlugin;
      return new YooptaPlugin<TElementMap, TOptions>({
        ...base,
        extensions: (slate: SlateEditor, yoo: YooEditor, blockId: string) => {
          const fragment = doc.getXmlFragment(
            `yoopta:${yoo.id}:block:${blockId}`
          );

          const e = withYjs(slate, fragment as any);
          
          try {
            YjsEditor.connect(e);
          } catch {
            // ignore connection errors
          }
          return e;
        },

        events: {
          ...(base.events ?? {}),
          onDestroy: (yoo: YooEditor, blockId: string) => {
            const slate = yoo.blockEditorsMap[blockId] as unknown as YjsEditor;
            if (slate) {
              try {
                YjsEditor.disconnect(slate);
              } catch {
                // ignore disconnection errors
              }
            }
            base.events?.onDestroy?.(yoo, blockId);
          },
        },
      });
    }

    return plugins.map((p) => withCollabPlugin(p));
  }

  return { doc, provider, wrapPluginsWithCollab };
}
