# Modern Portfolio Website

A high-performance portfolio website built with Astro.js, featuring modern theming, OAuth authentication, AI chat functionality, and MDX blog support.

## Features

### Core Functionality

- **Server-Side Rendering** with Astro.js for optimal performance
- **Multiple Theme Support** (Adwaita Dark/Light, Arc Dark/Light, Catppuccin Mocha, Tokyo Night)
- **OAuth GitHub Authentication** for guestbook functionality
- **AI Chat Integration** using OpenAI API
- **MDX Blog System** for content management
- **Project Showcase** with detailed project pages
- **Responsive Design** optimized for all devices

### Design & UX

- **Arch Linux Aesthetic** with terminal-inspired cards
- **JetBrains Mono** font throughout
- **Animated Starfield Background** with falling stars
- **Frosted Effects** and blur backgrounds
- **Smooth Animations** and micro-interactions
- **No Borders/Outlines** for clean, modern look

### Performance Optimizations

- **Code Splitting** and dynamic imports
- **Image Optimization** with lazy loading
- **Font Optimization** (WOFF2, subset loading)
- **Efficient Caching** strategies
- **Minimal JavaScript** footprint
- **CSS Optimization** with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Astro.js, React (selective components), TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: GitHub OAuth
- **AI Integration**: OpenAI API
- **Deployment**: Node.js server mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.astro
│   ├── ThemeToggle.astro
│   ├── StarField.astro
│   └── Footer.astro
├── layouts/             # Page layouts
│   └── Layout.astro
├── pages/               # Routes and API endpoints
│   ├── index.astro      # Home page
│   ├── projects.astro   # Projects listing
│   ├── guestbook.astro  # OAuth guestbook
│   ├── chat.astro       # AI chat interface
│   ├── blog.astro       # Blog listing
│   └── api/             # API routes
│       ├── auth/        # Authentication endpoints
│       ├── guestbook.ts # Guestbook CRUD
│       └── chat.ts      # AI chat endpoint
├── config/              # Configuration files
│   └── themes.ts        # Theme definitions
├── data/                # Static data
│   └── portfolio.ts     # Portfolio content
└── types/               # TypeScript definitions
    └── index.ts
```

## Theme System

The website supports multiple themes that can be switched dynamically:

### Available Themes

- **Adwaita Dark/Light**: GNOME's modern design language
- **Arc Dark/Light**: Popular GTK theme with clean aesthetics
- **Catppuccin Mocha**: Warm, pastel color palette
- **Tokyo Night**: Dark theme inspired by Tokyo's neon nights

### Theme Configuration

Themes are defined in `src/config/themes.ts` with full color system support:

```typescript
export const themes: Record<string, ThemeConfig> = {
  catppuccin: {
    name: "catppuccin",
    displayName: "Catppuccin Mocha",
    colors: {
      primary: "#89b4fa",
      secondary: "#cba6f7",
      accent: "#f9e2af",
      background: "#1e1e2e",
      surface: "#313244",
      text: "#cdd6f4",
      border: "#45475a",
    },
  },
  // ... other themes
};
```

## 🎉 Acknowledgments

- **Astro.js** team for the amazing framework
- **Catppuccin** for the beautiful color scheme
- **JetBrains** for the excellent monospace font
- **Prisma** for the fantastic ORM
- **Tailwind CSS** for the utility-first approach

---

Built with ❤️ using modern web technologies and best practices.
