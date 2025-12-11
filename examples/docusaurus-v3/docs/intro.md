---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction

This is an example Docusaurus site demonstrating the **docusaurus-plugin-banner** plugin.

## Features

The banner plugin provides:

- Customizable banner content
- Dismissible banners with localStorage persistence
- Custom colors and styling
- Support for HTML content in banners
- Multiple banner instances with unique IDs

## Testing the Banner

Look at the top of the page - you should see a blue banner with a welcome message.

Try clicking the **X** button to dismiss it, then refresh the page. The banner should stay dismissed because the state is saved in localStorage.

To reset the banner, open your browser's developer tools and clear localStorage, or run:

```js
localStorage.removeItem('docusaurus-banner-dismissed-welcome')
```
