## Scope
- Build Collaboration Tool page with Yoopta on the left and a pixel-accurate right panel for Comments and Action Log.
- Use Yoopta as the only editor; no Quill fallback.

## Dependencies (Yoopta + peers)
- Install peer deps: slate, slate-react.
- Install core/tools/plugins (per official docs):
  - Core: @yoopta/editor
  - Marks: @yoopta/marks (Bold, Italic, Underline, Strike, CodeMark, Highlight)
  - Tools: @yoopta/toolbar, @yoopta/action-menu-list, @yoopta/link-tool
  - Plugins: @yoopta/paragraph, @yoopta/headings, @yoopta/lists, @yoopta/blockquote, @yoopta/divider, @yoopta/code, @yoopta/image, @yoopta/link
- Reference: @yoopta/editor and plugin list (Yoopta docs) [npm](https://www.npmjs.com/package/@yoopta/editor) and [GitHub](https://github.com/yoopta-editor/Yoopta-Editor).

## Design Mapping
- Left: “Document Editor” label, dotted grid background, YooptaEditor instance with paragraph, headings (H1–H3), lists, quote, divider, image, code, link, and marks.
- Right: segmented toggle and two views (“Comments and activity”, “Log”) matching Figma paddings, radii, fonts, and widths.

## File Structure
- /src/pages/CollaborationToolPage/index.tsx: page shell and SEO.
- /src/pages/CollaborationToolPage/components/EditorPanel.tsx: Yoopta setup, grid background, header/dismiss.
- /src/pages/CollaborationToolPage/components/SidebarPanel.tsx: segmented toggle and panel content.
- /src/pages/CollaborationToolPage/components/FeedItem.tsx: shared feed row.
- /src/pages/CollaborationToolPage/components/WriteComment.tsx: visual-only input stub.
- /src/pages/CollaborationToolPage/collaboration.css: exact pixel styles (panel width 900px, fonts, colors, grid).
- /public/assets/collaboration/*: icons and avatars from Figma.
- /src/pages/CollaborationToolPage/__tests__/collaboration.spec.ts: Playwright tests.

## Implementation Details (Yoopta)
- Initialize editor via createYooptaEditor(); pass plugins array and marks.
- Provide tools prop with Toolbar, ActionMenu, and LinkTool; set placeholder “Type text..”.
- Ensure editor fills the left canvas and respects focus/selection behaviors.
- Style to be neutral and aligned with SwiftPro typography; no global CSS overrides.

## UI Components
- SidebarPanel: build the segmented toggle with Button variants; switch content without modifying layout.
- FeedItem: props for avatarSrc, name, timestamp, message, statusDot, attachment (filename, size, icon).
- WriteComment: non-interactive box labeled “Write a Comment”.

## Routing & SEO
- Add route “/dashboard/collaboration-tool” under Dashboard [routes](file:///c:/Users/USER/Documents/GitHub/swifter/src/routes/index.tsx#L120-L365).
- Use SEOWrapper with title “Collaboration Tool - SwiftPro eProcurement Portal” and robots “noindex, nofollow”.

## Assets & Styling
- Move Figma assets to /public/assets/collaboration and update references.
- Tailwind-first styling; use collaboration.css for values Tailwind cannot express exactly.

## Accessibility
- Button roles/labels; status dot aria-label; alt text on images; keyboard focus order.

## Testing
- Playwright: verify segmented toggle switches views; assert feed items, attachment row, and Yoopta mounts successfully.

## Data & API
- No API calls; content is static placeholders until documented endpoints exist; later wire via /api layer per rules.

## Deliverables
- Yoopta-based editor integrated; pixel-accurate panels for both designs; route + SEO; assets moved; tests.

## Confirmation
- Proceed with installing Yoopta + peers and implementing the page at “/dashboard/collaboration-tool”.
