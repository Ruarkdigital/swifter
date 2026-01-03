**Goal**

* Remove the Markdown intermediary and convert DOC/DOCX, PDF, and XLS/XLSX directly into YooptaContentValue so the Collaboration Tool renders the structured content natively via Yoopta blocks.

**Where This Integrates**

* Use on import in [CollaborationToolPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/index.tsx) to set the editor value.

* Render in editor through [EditorPanel](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx) by calling `editor.setEditorValue(...)`.

**Yoopta Schema Targets**

* Blocks included in Editor: paragraph, heading-one/two/three, bulleted-list, numbered-list, todo-list, blockquote, divider, code, image, link.

* Proposal: add `@yoopta/table` for true table fidelity (optional but recommended for Excel files). If not added, fallback to structured lists or preformatted code blocks while preserving row/column grouping.

**DOC/DOCX → Yoopta**

* Parse DOCX using mammoth with `convertImage` callback to embed images (data URL) for `@yoopta/image` blocks.

* Convert mammoth HTML to an AST using `rehype-parse`. Map tags to Yoopta blocks:

  * h1/h2/h3 → heading-one/two/three

  * p → paragraph

  * ul/ol/li → bulleted-list/numbered-list with each item as a child line

  * blockquote → blockquote

  * hr → divider

  * pre/code → code (carry language if detectable)

  * a → link props retained in inline text (if Yoopta inline link not supported, flatten to text while preserving URL)

  * img → image with src/alt

* Preserve section breaks as dividers where applicable.

**XLS/XLSX → Yoopta**

* Read workbook with XLSX.

* If table plugin is added:

  * For each sheet, create a table block with header row and data rows, preserving column order and blank cells.

  * Add a heading block `heading-two` per sheet name above the table.

* If table plugin is not added:

  * Create a `heading-two` per sheet name.

  * Emit a `code` block or a structured list where each row becomes a line, columns joined with a delimiter while keeping row/column structure consistent.

**PDF → Yoopta**

* Load with PDF.js and extract text content per page.

* Group items into lines by Y coordinate; infer blocks:

  * Headings: detect font size/weight and short all-caps lines → heading blocks.

  * Lists: bullet characters (•, -, \*) → bulleted-list items.

  * Paragraphs: contiguous text lines → paragraph blocks.

  * Page breaks: insert divider or heading to mark separation.

* Images/tables: When extraction is limited, insert placeholder paragraphs noting image/table positions; preserve reading order.

**Implementation Plan**

* Add `src/lib/fileToYoopta.ts` with high-level dispatcher:

  * `convertDocxToYoopta(arrayBuffer): YooptaContentValue`

  * `convertXlsxToYoopta(arrayBuffer): YooptaContentValue`

  * `convertPdfToYoopta(url): YooptaContentValue`

  * `convertFileUrlToYoopta(url, name, type): Promise<YooptaContentValue>`

* Use `buildBlockData`, `generateId` from Yoopta to build blocks consistently.

* Integrate in [CollaborationToolPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/index.tsx): read query params, call `convertFileUrlToYoopta(...)`, pass `initialValue` to EditorPanel or directly set in EditorPanel via effect.

* Update [EditorPanel](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx) to accept `initialValue?: YooptaContentValue` and set `editor.setEditorValue(initialValue)` on mount.

**Dependencies**

* Optional: add `@yoopta/table` for high-fidelity Excel rendering.

* Already present: mammoth, unified/rehype-parse (for HTML mapping), pdf.js via react-pdf.

**Preservation Rules**

* Maintain hierarchy: headings, paragraphs, lists, quotes, code and images mapped to matching Yoopta blocks.

* Excel tables retain sheet structure (headers/rows/columns). Without table plugin, preserve rows and column groupings in a consistent preformatted representation.

* PDF preserves paragraphs, headings, lists and page structure; mark non-text artifacts clearly.

**Testing**

* Unit tests for `fileToYoopta` converters using sample DOCX/XLSX/PDF inputs.

* Playwright test: navigate to `/collaboration-tool?sourceUrl=...` and assert Yoopta blocks are rendered (headings/lists/table or code block for Excel, paragraphs for PDF).

**Deliverables**

* New direct converters to Yoopta.

* Collaboration Tool loads Yoopta value directly, no Markdown.

* Optional table plugin integration for

