# Docusaurus Plugin Banner

A customizable, dismissable banner plugin for Docusaurus v2 sites with localStorage persistence.

## Features

- ✅ Fully dismissable banners with X button
- ✅ Persistent dismissal state using localStorage
- ✅ Customizable colors, content, and styling
- ✅ Support for HTML content
- ✅ Multiple banner instances with unique IDs
- ✅ Smooth animations on dismiss
- ✅ TypeScript support

## Installation

```bash
npm install docusaurus-plugin-banner
# or
yarn add docusaurus-plugin-banner
```

## Configuration

Add the plugin to your `docusaurus.config.js` or `docusaurus.config.ts`:

```js
module.exports = {
  // ... existing config ...
  plugins: [
    [
      'docusaurus-plugin-banner',
      {
        content: '🎉 Welcome to our documentation!',
        dismissible: true,
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
      }
    ]
  ]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | **required** | Banner content. Can be plain text or HTML. |
| `dismissible` | `boolean` | `true` | Whether users can dismiss the banner. |
| `backgroundColor` | `string` | `'#3b82f6'` | Background color of the banner. |
| `textColor` | `string` | `'#ffffff'` | Text color of the banner. |
| `showCloseIcon` | `boolean` | `true` | Whether to show the close (×) button. Only shown if `dismissible` is true. |
| `className` | `string` | - | Custom CSS class for the banner. |
| `storageKey` | `string` | `'docusaurus-banner-dismissed'` | localStorage key for persisting dismissal state. |
| `id` | `string` | - | Unique ID for the banner. Useful when multiple banners are needed. |

## Examples

### Basic Banner

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      content: 'Check out our new features!',
      dismissible: true,
    }
  ]
]
```

### Non-Dismissable Banner

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      content: 'Important announcement: Maintenance scheduled for Friday.',
      dismissible: false,
    }
  ]
]
```

### HTML Content

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      content: '<strong>Alert:</strong> Learn more about our <a href="/blog/2024/01/01/update">latest update</a>!',
      dismissible: true,
      backgroundColor: '#ef4444',
    }
  ]
]
```

### Multiple Banners with Different IDs

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      id: 'welcome',
      content: 'Welcome to our docs!',
      dismissible: true,
    }
  ],
  [
    'docusaurus-plugin-banner',
    {
      id: 'newsletter',
      content: 'Subscribe to our newsletter',
      dismissible: true,
      backgroundColor: '#10b981',
    }
  ]
]
```

### Custom Styling

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      content: 'Custom styled banner',
      backgroundColor: '#8b5cf6',
      textColor: '#f3f4f6',
      className: 'my-custom-banner',
    }
  ]
]
```

### Custom Storage Key

```js
plugins: [
  [
    'docusaurus-plugin-banner',
    {
      content: 'Special announcement',
      storageKey: 'special-announcement-dismissed',
    }
  ]
]
```

## How It Works

The banner appears at the very top of your Docusaurus site with a fixed position. When dismissed:

1. The banner animates out smoothly
2. The dismissal state is saved to localStorage
3. The banner won't appear again until the user clears their localStorage

Each banner instance (identified by `id`) maintains its own dismissal state.

## TypeScript

The plugin is written in TypeScript and exports type definitions:

```typescript
import type { BannerPluginOptions } from 'docusaurus-plugin-banner'

const options: BannerPluginOptions = {
  content: 'Hello from TypeScript!',
  dismissible: true,
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Clean dist
npm run clean
```

### Testing Locally

Link the plugin into your Docusaurus site:

```bash
# From the plugin directory
npm pack

# From your Docusaurus site
npm install ../path/to/docusaurus-plugin-banner-*.tgz
```

## Browser Support

Works in all modern browsers that support:
- ES2019
- React 17+
- localStorage API

## License

MIT
