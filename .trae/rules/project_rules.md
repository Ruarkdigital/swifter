## General Rules & Developer Mindset

1. You are a **senior software developer with 10+ years experience**. Always analyze the project structure and follow existing patterns and naming conventions.
2. **Do not run the dev server** — the app is already running on `localhost:5173` or `localhost:3000`.
3. **Never assume API contracts**. Use only the **provided API endpoints**, request formats, and response structures.
4. If API details or response schemas are not available, **skip implementation** for now — **do not guess or fabricate them**.
5. Do **not modify the UI layout** during API integration. Follow the existing UI as-is, or skip where data isn't available yet.
6. DO NOT CHANGE THE UI LAYOUT. UNLESS SPECIFIED TO DO SO

---

## 🎨 UI Implementation Rules

### General

1. Implement UIs exactly as per the **provided image design** — match **spacing, colors, positioning, and sizing** precisely.
2. Do **not deviate from the design**. No creative changes, additions, or omissions.

### Foldering & Components

3. Break UI into **reusable components**.

   * For feature-specific components:

     * **React Router:** `/src/pages/<feature>/components` and `/src/pages/<feature>/layouts`
     * **Next.js (App Router):** `/app/(Root)/<feature>/_components` or `/app/(Root)/<feature>/layout`
4. Before creating a new component, check if it already exists in `/components` or `/components/ui`.
5. Always use the `DataTable` from `/components/layouts` for all table-based views.
6. Use **ShadCN components** when applicable — unless the component already exists in `/components`.

---

## 🔌 API Integration Rules

1. Do **not** use `axiosInstance` directly. Instead, use the following functions from the `/api` folder:

   * `getRequest`
   * `postRequest`
   * `putRequest`
   * `deleteRequest`

2. Follow the exact API schema. **Do not send extra fields or reshape data** unless explicitly instructed.

---

## 🔍 SEO Implementation

### Required Components

1. Use the `SEOWrapper` from `/components/SEO` for static SEO config.
2. Use the `useSEO()` hook from `/hooks/useSEO` when metadata needs to be set dynamically.

```tsx
import { SEOWrapper } from '@/components/SEO';
<SEOWrapper
  title="Page Title - SwiftPro eProcurement Portal"
  description="Compelling description (150-160 characters)"
  keywords="relevant, keywords, comma, separated"
  canonical="/page-url"
  robots="index, follow"
/>
```

### Title Format

* Format: `"Page Name - SwiftPro eProcurement Portal"`
* Length: 50–60 characters
* Must be **unique and descriptive**

### Meta Description

* Length: 150–160 characters
* Compelling, action-oriented, with **natural keywords**
* Avoid duplicates across pages

### Robots

* Public pages: `"index, follow"`
* Private/dashboard pages: `"noindex, nofollow"`

### Open Graph (OG)

* Use images from `/public/assets/` or CDN
* Image size: `1200x630px`
* Alt text required

```tsx
<SEOWrapper
  ogImage="/assets/swiftpro-og-image.jpg"
  ogImageAlt="SwiftPro eProcurement Portal Dashboard"
/>
```

### Canonical URL

* Use absolute paths (e.g., `"/dashboard"`)
* Must reflect the actual route
* Keep under 100 characters and keyword friendly

---

## 🧩 Structured Data

### When to Use

* Main brand pages: `Organization`
* Detail or breadcrumb-enabled pages: `BreadcrumbList`
* Help pages: `FAQPage`
* Main app landing: `SoftwareApplication`

### Example

```tsx
<SEOWrapper
  structuredData={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SwiftPro eProcurement Portal"
  }}
/>
```

---

## 🧱 Project Structure (Next.js App Router)

* Use `/app/(Root)/.../_components` for page-specific components
* Use `layout.tsx` to wrap persistent layouts
* Use `page.tsx` for main route content
* Reuse common components from `/components/ui`
* Use `/lib`, `/hooks`, or `/features` for logic abstraction

---

## 🛑 Final Reminders

* ❌ Do not assume or fabricate data
* ❌ Do not alter UI layout unless told to
* ✅ Use existing components if available
* ✅ Stick to defined folder structures
* ✅ Test SEO implementations before deployment
* ✅ Ask questions when in doubt
