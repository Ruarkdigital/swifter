# Dark Mode Implementation Guide

## Overview

This project now includes a comprehensive dark mode implementation using Tailwind CSS and a custom theme provider. The dark mode system supports three modes: light, dark, and system (follows OS preference).

## Features

- ✅ **Class-based dark mode** using Tailwind CSS
- ✅ **Theme persistence** in localStorage
- ✅ **System preference detection** and automatic switching
- ✅ **Smooth transitions** between themes
- ✅ **Theme toggle component** in the header
- ✅ **Comprehensive styling** across all components

## Implementation Details

### 1. Theme Provider

The `ThemeProvider` context (`src/contexts/ThemeContext.tsx`) manages the global theme state:

```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

// Wrap your app
<ThemeProvider defaultTheme="system" storageKey="swiftpro-theme">
  {/* Your app */}
</ThemeProvider>
```

### 2. Theme Toggle Component

The `ThemeToggle` component (`src/components/ui/theme-toggle.tsx`) provides a dropdown to switch between themes:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Use in header or anywhere
<ThemeToggle />
```

### 3. Using the Theme Hook

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { theme, setTheme, actualTheme } = useTheme();
```

## Styling Guidelines

### Color Scheme

**Light Mode:**
- Background: `#F7F9FE` (main), `white` (cards/components)
- Text: `black`, `#2A4467` (primary), `#6B6B6B` (muted)
- Borders: `gray-200`, `gray-100`

**Dark Mode:**
- Background: `gray-950` (main), `gray-900` (cards/components)
- Text: `white`, `blue-400` (primary), `gray-400` (muted)
- Borders: `gray-700`, `gray-800`

### Best Practices

1. **Always include dark mode classes** when styling components:
   ```tsx
   className="bg-white dark:bg-gray-900 text-black dark:text-white"
   ```

2. **Use transition classes** for smooth theme switching:
   ```tsx
   className="transition-colors duration-200"
   ```

3. **Test both themes** during development

4. **Use semantic color variables** from Tailwind config when possible:
   ```tsx
   className="bg-background text-foreground"
   ```

## Component Coverage

The following components have been updated with dark mode support:

- ✅ **Layout Components**
  - Dashboard layout
  - Header with theme toggle
  - Sidebar with navigation
  - Footer
  - Auth layout

- ✅ **Authentication Pages**
  - Login page
  - Forgot password pages
  - Reset password page

- ✅ **UI Components**
  - Theme toggle dropdown
  - Buttons (via shadcn)
  - Cards, dialogs, sheets (via shadcn)
  - Form components (via shadcn)

## CSS Variables

The dark mode uses updated CSS variables in `src/index.css`:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

## Configuration

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"], // Enables class-based dark mode
  // ... rest of config
};
```

### Storage

Theme preference is stored in localStorage with the key `swiftpro-theme`.

## Troubleshooting

### Common Issues

1. **Dark mode not working**: Ensure `darkMode: ["class"]` is set in `tailwind.config.js`
2. **Styles not applying**: Check if the component is wrapped with `ThemeProvider`
3. **Flashing on load**: The theme provider handles this automatically

### Adding Dark Mode to New Components

1. Add dark mode classes to all background and text elements
2. Include transition classes for smooth switching
3. Test in both light and dark modes
4. Follow the established color scheme

Example:
```tsx
const MyComponent = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        My Component
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Some description text
      </p>
    </div>
  );
};
```

## Future Enhancements

- [ ] Add theme-aware icons and images
- [ ] Implement theme-specific animations
- [ ] Add more color scheme options
- [ ] Create theme preview component
- [ ] Add accessibility improvements for high contrast

---

**Note**: This implementation follows modern web standards and provides a smooth, accessible dark mode experience for all users.