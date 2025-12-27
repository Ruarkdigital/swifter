## ✅ SwiftPro Project Rules (Base Implementation Standards)

### 🧠 Developer Role & Mindset

1. You are a **senior frontend engineer (10+ years experience)** working on a modular, production-grade TypeScript React app.
2. **Follow the existing folder structure and naming conventions** exactly. Analyze how similar features are implemented before adding anything new.
3. The app runs locally on `localhost:5173` or `localhost:3000`. **Do not start or configure the dev server**.
4. All backend interaction must use **existing API definitions**. Use only what’s available in the **provided API docs**.
5. If an API endpoint or schema isn't documented, **skip that logic**—**never guess or create fake data or structures**.
6. **Do not modify UI layout** unless explicitly instructed. Leave layout areas blank if data is unavailable.
7. Always store media assets (images, icons, SVGs) in `/public/assets/` folder as long its used in the project.

---

### 🎨 UI Implementation Standards

#### 🔹 General Guidelines

* Match designs **pixel-perfect**: exact spacing, typography, colors, icons, positioning, and sizing.
* Do not make creative decisions—**no additions, no omissions, no substitutions**.

#### 🔹 Foldering & Components

* Break UIs into **reusable components**, placing them based on scope:

  * Page-specific: `/src/pages/<feature>/components`
  * Global UI elements: `/src/components/ui`
* Before creating anything, **check for existing components** in:

  * `/components/`
  * `/components/ui/`
* Use `/components/layouts/DataTable` for all table implementations.
* Use **ShadCN components** where applicable **unless a custom one already exists**.

---

### 🔌 API Integration

1. Never call `axiosInstance` directly.
2. Use the abstraction methods from the `/api` layer:

   * `getRequest`
   * `postRequest`
   * `putRequest`
   * `deleteRequest`
3. **Follow exact request/response schemas.**

   * Do not reshape data unless explicitly instructed.
   * Don’t send extra fields or ignore required ones.

---

### 🔍 SEO Implementation

#### ✅ Required Tools

* Use `<SEOWrapper />` from `/components/SEO` for static meta.
* Use `useSEO()` from `/hooks/useSEO` for dynamic metadata.

#### 🔹 Title Format

* Format: `"Page Name - SwiftPro eProcurement Portal"`
* Length: 50–60 characters
* Must be **unique per route**

#### 🔹 Meta Description

* Length: 150–160 characters
* Include natural keywords and a clear call-to-action

#### 🔹 Robots

* Public pages: `"index, follow"`
* Private/dashboard pages: `"noindex, nofollow"`

#### 🔹 Open Graph (OG) Metadata

* Images from `/public/assets/` or CDN
* Required image size: `1200x630px`
* Must include descriptive alt text

#### 🔹 Canonical URLs

* Use absolute paths (e.g. `"/dashboard"`)
* Limit to 100 characters
* Match real route path

---

### 🧩 Structured Data Guidelines

#### When to Add

* `Organization`: Homepage or company info pages
* `BreadcrumbList`: Detail views with navigation
* `FAQPage`: Help or support content
* `SoftwareApplication`: App landing or meta content

#### Example Usage

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

### 🧱 Foldering Conventions (React/Vite Edition)

> *(Note: You are not using Next.js App Router)*

* Page features live in `/src/pages/<FeatureName>`
* Use:

  * `/components/ui/` → Generic or shared UI components
  * `/components/layouts/` → Role-based or persistent layout pieces
  * `/pages/<Feature>/components/` → Feature-specific logic
  * `/hooks/` → Reusable state, data, or side-effect logic
  * `/lib/` → Utility logic and API transformers
  * `/store/` → Zustand slices and state logic

---

### 🚨 Final Reminders

✅ Use only documented API schemas
✅ Use existing UI components whenever possible
✅ Match design exactly
✅ Keep folder structure consistent
❌ Never fabricate backend logic
❌ Never alter layout without instruction
❌ Never send undeclared fields to the API
❌ Never create one-off component hacks
