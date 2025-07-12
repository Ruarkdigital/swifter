## Important Notice
1. You are a senior Software developer with over a decade work experience, you are very good in understanding projects and following the codebase pattern.
1. Do not start the local server, the project is currently running on localhost:5173
2. Whenever you are implementing the API integration, use the provided API endpoints and request body formats, do not assume or suggest an API that is not provided.
3. Always stick to the information provided to you, do not make assumptions about the data you will get from the API.
4. Do not change the UI structure while implementing the APIs, if not available, skip it.


## Implementation of the UI
1. Follow exactly how the Image UI design provided, both to pixel perfect sizes, color and to the exact position.
2. Always break the UI into smaller components, and then create them as React components within the feature folder, that is `/src/pages/<feature_name>/components` folder or `/src/pages/<feature_name>/layouts` (layouts is the combination of components within that feature), then combine all to make up the UI design page component.
3. Always check if any of the design components exist already within the project, that is `/src/components` folder.
4. Use DataTable component from `/src/components/layouts` folder wherever there's a table design on the UI design.
5. Always use Shadcn components, if the component can be gotten from there and doesn't exist currently with `/src/components`.
6. Do not change, add or remove from the UI design provided, always implement accurately to the design.

## Implementation of API 
1. Never use the axiosInstance directly, always use the getRequest, postRequest, deleteRequest and putRequest functions from the api folder.

## SEO Implementation Guidelines

### 1. SEO Component Usage
1. **Always use SEOWrapper component** for every page that needs SEO optimization:
   ```tsx
   import { SEOWrapper } from '@/components/SEO';
   
   <SEOWrapper
     title="Page Title - SwiftPro eProcurement Portal"
     description="Compelling description (150-160 characters)"
     keywords="relevant, keywords, separated, by, commas"
     canonical="/page-url"
     robots="index, follow" // or "noindex, nofollow" for private pages
   />
   ```

2. **Use useSEO hook** for dynamic SEO updates:
   ```tsx
   import { useSEO } from '@/hooks/useSEO';
   
   const MyComponent = () => {
     useSEO({
       title: 'Dynamic Title',
       description: 'Dynamic description'
     });
   };
   ```

### 2. SEO Best Practices

#### Page Titles
- Keep titles between 50-60 characters
- Include "SwiftPro eProcurement Portal" for brand consistency
- Use descriptive, unique titles for each page
- Format: "Page Name - SwiftPro eProcurement Portal"

#### Meta Descriptions
- Keep descriptions between 150-160 characters
- Write compelling, action-oriented descriptions
- Include relevant keywords naturally
- Avoid duplicate descriptions across pages

#### Keywords
- Use relevant, specific keywords
- Include primary and secondary keywords
- Separate keywords with commas
- Focus on eProcurement, procurement, solicitation, vendor management terms

#### Robots Meta Tags
- **Public pages**: Use `"index, follow"`
- **Private/Dashboard pages**: Use `"noindex, nofollow"`
- **Login/Auth pages**: Use `"noindex, nofollow"`

### 3. Page-Specific SEO Rules

#### Public Pages (index, follow)
- Home/Landing pages
- Privacy Policy
- Terms & Conditions
- Contact Us
- About Us
- Help/Documentation

#### Private Pages (noindex, nofollow)
- Dashboard pages
- User management
- Solicitation details
- Vendor details
- Evaluation pages
- Admin panels
- Profile pages

### 4. Structured Data Implementation

#### When to Add Structured Data
- **Organization data**: On main pages
- **Breadcrumbs**: On detail pages with navigation
- **FAQ data**: On help/support pages
- **SoftwareApplication**: On main application pages

#### Implementation
```tsx
<SEOWrapper
  structuredData={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SwiftPro eProcurement Portal"
  }}
/>
```

### 5. Image SEO Guidelines

#### Open Graph Images
- Use high-quality images (1200x630px recommended)
- Include SwiftPro branding
- Store in `/src/assets/` or use CDN
- Provide alt text for accessibility

#### Implementation
```tsx
<SEOWrapper
  ogImage="/src/assets/swiftpro-og-image.jpg"
  ogImageAlt="SwiftPro eProcurement Portal Dashboard"
/>
```

### 6. URL and Canonical Guidelines

#### URL Structure
- Use descriptive, readable URLs
- Include relevant keywords
- Use hyphens to separate words
- Keep URLs under 100 characters

#### Canonical URLs
- Always provide canonical URLs
- Use absolute paths starting with `/`
- Ensure consistency across similar pages

### 7. Performance and SEO

#### Core Web Vitals
- Optimize component loading
- Use lazy loading for non-critical components
- Minimize SEO component re-renders
- Cache structured data when possible

#### Implementation Tips
```tsx
// Good: Memoize SEO data
const seoData = useMemo(() => ({
  title: `${item.name} - SwiftPro`,
  description: `Manage ${item.name} in SwiftPro eProcurement Portal`
}), [item.name]);

<SEOWrapper {...seoData} />
```

### 8. Testing and Validation

#### Required Checks
1. **Meta tags validation**: Use browser dev tools
2. **Structured data testing**: Use Google's Rich Results Test
3. **Open Graph testing**: Use Facebook Sharing Debugger
4. **Twitter Card testing**: Use Twitter Card Validator

#### Debug Commands
```bash
# Check if SEO components are working
# Open browser dev tools > Elements > Search for "helmet"

# Validate structured data
# Visit: https://search.google.com/test/rich-results
```

### 9. Maintenance Requirements

#### Regular Tasks
- **Monthly**: Review meta descriptions for new pages
- **Quarterly**: Update sitemap.xml with new routes
- **When adding new pages**: Always implement SEO components
- **When changing URLs**: Update canonical references

#### Documentation Updates
- Update `/docs/SEO_IMPLEMENTATION.md` when adding new SEO features
- Document any custom SEO implementations
- Keep track of SEO performance metrics

### 10. Common Mistakes to Avoid

#### Don't Do
- ❌ Duplicate meta descriptions across pages
- ❌ Missing SEO components on new pages
- ❌ Using generic titles like "Dashboard" or "Page"
- ❌ Indexing private/sensitive pages
- ❌ Forgetting to update sitemap for new public pages

#### Do
- ✅ Use unique, descriptive titles and descriptions
- ✅ Implement SEO components on every page
- ✅ Follow the established SEO patterns
- ✅ Test SEO implementation before deployment
- ✅ Monitor SEO performance regularly

### 11. Emergency SEO Fixes

If SEO issues are discovered in production:

1. **Missing meta tags**: Add SEOWrapper component immediately
2. **Wrong robots directive**: Update robots prop in SEOWrapper
3. **Broken structured data**: Validate and fix JSON-LD syntax
4. **Duplicate content**: Add proper canonical URLs

For urgent fixes, prioritize:
1. Public-facing pages
2. High-traffic pages
3. Pages with SEO value

### 12. SEO Checklist for New Features

Before deploying new pages/features:

- [ ] SEOWrapper component implemented
- [ ] Unique title and description added
- [ ] Appropriate robots directive set
- [ ] Canonical URL provided
- [ ] Keywords researched and added
- [ ] Open Graph image specified
- [ ] Structured data added (if applicable)
- [ ] URL structure follows guidelines
- [ ] SEO tested in development
- [ ] Documentation updated

Refer to `/docs/SEO_IMPLEMENTATION.md` for detailed technical documentation.