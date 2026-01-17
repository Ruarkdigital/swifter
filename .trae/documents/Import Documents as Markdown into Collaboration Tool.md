**Goal**

* Convert DOC/DOCX, PDF, and XLS/XLSX files into clean Markdown while preserving structure, then load the Markdown into the Collaboration Tool editor. Add an Edit button beside the existing eye (view) button in all document lists to open the Collaboration Tool preloaded with the converted content.

**Key Locations**

* Collaboration Tool: [CollaborationToolPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/index.tsx), [EditorPanel](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx)

* Document Viewer & utilities: [DocumentViewer.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/components/ui/DocumentViewer.tsx), [fileUtils.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/lib/fileUtils.tsx)

* Routes: [routes/index.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/routes/index.tsx#L359-L366)

* Document lists (examples to update): [Solicitation DocumentsTab](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/SolicitationManagementPage/components/DocumentsTab.tsx#L97-L111), Vendor/Proposal/Evaluation document tabs per search findings.

**Conversion Pipeline**

* DOC/DOCX → Markdown

  * Use existing mammoth to convert to HTML.

  * Convert HTML → Markdown using a small pipeline (rehype-remark + remark-stringify) to preserve headings, lists, links, images, tables.

* XLS/XLSX → Markdown

  * Use existing XLSX to read sheets.

  * For each sheet, emit a markdown section: `## {Sheet Name}` followed by a markdown table with header row (first row) and remaining rows.

  * Preserve empty cells; stringify values; basic date/number formatting via XLSX utilities if present.

* PDF → Markdown

  * Use pdfjs (already present via react-pdf) to load pages and call `getTextContent()`.

  * Group text items into lines and blocks; infer headings by fontSize weight; detect bullet characters for lists; keep paragraph breaks; include page breaks `\n\n---\n\n`.

  * Images/tables in PDFs: include placeholders with filenames if extractable; otherwise retain text structure faithfully.

**Markdown → Collaboration Tool Content**

* Import Markdown into the editor by mapping markdown elements to Yoopta blocks (paragraph, headings, lists, blockquote, code, link, image, divider):

  * Parse markdown to AST (remark-parse) and transform to a Yoopta `YooptaContentValue` structure compatible with the plugins registered in [EditorPanel](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx#L28-L41).

  * Fallback: if a node type is unsupported, emit a paragraph or code block with raw text.

* Pass initial content into EditorPanel via a new prop (e.g., `initialMarkdown` or `initialValue`). On mount, convert and set editor value.

**Open From Document Lists**

* Add an Edit button beside the Eye button in each document list component:

  * Use the Edit icon from lucide-react.

  * On click, navigate to `/collaboration-tool?sourceUrl={url}&fileName={name}&fileType={type}`.

  * Keep existing View and Download behaviors unchanged.

* Update at least these modules:

  * Solicitation Documents: [DocumentsTab.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/SolicitationManagementPage/components/DocumentsTab.tsx)

  * Vendor Documents: VendorManagementPage/components/DocumentsTab.tsx

  * Proposal Details page lists: [ProposalDetailsPage.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/SolicitationManagementPage/ProposalDetailsPage.tsx)

  * Evaluation Submitted documents: [SubmittedDocumentPage.tsx](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/EvaluationManagementPage/SubmittedDocumentPage.tsx)

**Collaboration Tool Import Flow**

* On [CollaborationToolPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/index.tsx), read query params (`sourceUrl`, `fileName`, `fileType`).

* Call a new utility `convertFileUrlToMarkdown(sourceUrl, fileName, fileType)` that returns a markdown string.

* Render EditorPanel and preload converted content; show a small import banner indicating the source file name.

**New/Updated Code (high-level)**

* Add `src/lib/fileToMarkdown.ts` with:

  * `convertDocxToMarkdown(arrayBuffer): Promise<string>` (mammoth → HTML → Markdown)

  * `convertXlsxToMarkdown(arrayBuffer): Promise<string>` (XLSX → tables)

  * `convertPdfToMarkdown(url): Promise<string>` (pdfjs text extraction → markdown)

  * `convertFileUrlToMarkdown(url, name, type): Promise<string>` dispatcher

* Update Collaboration Tool:

  * [CollaborationToolPage](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/index.tsx): parse params, fetch/convert, pass to EditorPanel.

  * [EditorPanel](file:///c:/Users/USER/Documents/GitHub/swifter/src/pages/CollaborationToolPage/components/EditorPanel.tsx): accept `initialMarkdown`/`initialValue`, convert markdown AST to Yoopta blocks and set `value`.

* Update document list UIs to include Edit button that routes to collaboration tool with params.

**Dependencies**

* Add minimal libraries only if needed:

  * `rehype-remark` and `remark-stringify` (HTML → Markdown) and `remark-parse` (Markdown → AST) to avoid adding heavier alternatives.

  * No backend changes; conversion runs client-side.

**Preservation & Limitations**

* Word/Excel: preserve headings, paragraphs, lists, links, images, and tables structure in markdown.

* PDF: preserve text blocks, headings, lists, paragraph spacing; images/tables may be placeholders depending on pdf content extraction.

* Styles (fonts, colors) are not preserved in markdown by design; structure is prioritized.

**Testing & Verification**

* Unit tests for `fileToMarkdown` functions using sample DOCX/XLSX/PDF files.

* Integration tests: clicking Edit navigates to `/collaboration-tool` and loads content into editor.

* Manual check: import large DOCX with headings/lists/tables; verify Yoopta blocks are correct.

**Security & Performance**

* Fetch files securely via provided URLs; no API schema changes.

* Avoid loading very large files in the main thread where possible; show progress indicators.

* Handle errors with clear messages and allow fallback to download.

**Deliverables**

* New conversion utility with tests.

* Collaboration Tool page enhanced to import & display converted markdown.

* Edit buttons added in all relevant document listings, placed directly beside the eye button, using the edit icon, opening the Collaboration Tool.

