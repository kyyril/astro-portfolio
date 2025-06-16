# Modern Portfolio Website

A high-performance portfolio website built with Astro.js, featuring modern theming, OAuth authentication, AI chat functionality, and MDX blog support.

## 🚀 Features

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

## 📁 Project Structure

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

## 🎨 Theme System

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

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App
- AI key (optional, for chat functionality)

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CALLBACK_URL="http://localhost:4321/api/auth/github/callback"

# AI Key (optional)
AI_API_KEY="your_openai_api_key"

# App Settings
BASE_URL="http://localhost:4321"
JWT_SECRET="your_jwt_secret_key_here"
```

### Installation Steps

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd astro-portfolio
npm install
```

2. **Set up the database**:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

3. **Configure GitHub OAuth**:

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:4321/api/auth/github/callback`
   - Copy Client ID and Secret to your `.env` file

4. **Start development server**:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Server Deployment

The app is configured for Node.js server mode. Deploy to any Node.js hosting platform:

1. Set environment variables on your hosting platform
2. Ensure PostgreSQL database is accessible
3. Run build command
4. Start the server

### Database Migration

For production deployment:

```bash
npm run db:migrate
```

## 🎯 Performance Features

### Loading Optimization

- **Code Splitting**: Automatic route-based splitting
- **Dynamic Imports**: Components loaded on demand
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format, lazy loading, responsive images
- **Font Optimization**: WOFF2 format, subset loading, font-display: swap

### Runtime Performance

- **Minimal JavaScript**: Only essential client-side code
- **CSS Optimization**: Purged unused styles, efficient selectors
- **Efficient Animations**: GPU-accelerated transforms
- **Debounced Interactions**: Optimized event handling
- **Memory Management**: Proper cleanup of event listeners

### Caching Strategy

- **Static Assets**: Long-term caching with versioning
- **API Responses**: Appropriate cache headers
- **Database Queries**: Connection pooling and query optimization

## 🎨 Customization

### Adding New Themes

1. Define theme in `src/config/themes.ts`
2. Add corresponding Tailwind classes
3. Theme automatically appears in theme selector

### Modifying Portfolio Data

Update content in `src/data/portfolio.ts`:

- Personal information
- Skills and technologies
- Project details
- Work experience
- Education history

### Styling Components

- Use CSS custom properties for theme colors: `var(--color-primary)`
- Apply effects with `.` class
- Use terminal-style cards with `.terminal-card` class

## 🔧 API Endpoints

### Authentication

- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - Handle OAuth callback
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/signout` - Sign out user

### Guestbook

- `GET /api/guestbook` - Fetch all entries
- `POST /api/guestbook` - Create new entry (requires auth)

### AI Chat

- `POST /api/chat` - Send message to AI assistant

## 🛡 Security Features

- **CSRF Protection**: Same-site cookie policy
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: API endpoint protection
- **Secure Headers**: Content Security Policy
- **OAuth Security**: Proper token handling

## 📱 Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- **Astro.js** team for the amazing framework
- **Catppuccin** for the beautiful color scheme
- **JetBrains** for the excellent monospace font
- **Prisma** for the fantastic ORM
- **Tailwind CSS** for the utility-first approach

---

Built with ❤️ using modern web technologies and best practices.
