

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
