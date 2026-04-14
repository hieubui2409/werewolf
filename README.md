# Werewolf Moderator

A responsive web app for moderating Werewolf (Mafia) card game rounds. Manage players, roles, abilities, and game state with intuitive controls. Dark/light theme, PWA support, and bilingual interface (Vietnamese + English).

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** with Tailwind CSS v4 (@tailwindcss/vite, no PostCSS)
- **Zustand** for state management with persistence
- **PWA** via vite-plugin-pwa (prompt-to-reload strategy)
- **react-i18next** for i18n (Vietnamese default)
- **Font Awesome** for icons
- **Playwright** for e2e tests, Vitest for unit tests

## Getting Started

### Prerequisites

Node.js 18+

### Installation & Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run e2e tests
npm test:e2e
```

### Build

```bash
# Type check + bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                      # Root component with step routing
├── main.tsx                     # App entry, PWA register, theme init
├── components/
│   ├── common/                  # Shared UI: error boundary, modals, sheets
│   ├── setup/                   # Game setup screen and role management
│   └── game/                    # Game screen and action controls
├── store/
│   ├── game-store.ts            # Zustand store with persist middleware
│   ├── game-store-actions.ts    # Actions for mutations
│   └── game-store-selectors.ts  # Memoized selectors
├── types/game.ts                # TypeScript interfaces for roles, players, abilities
├── data/default-roles.ts        # Built-in role templates
├── utils/
│   ├── faction-theme.ts         # Color mapping for factions
│   └── sounds.ts                # Audio playback helpers
├── hooks/use-timer.ts           # Game timer logic
├── i18n/index.ts                # i18next config and locales
├── test/setup.ts                # Vitest configuration
└── index.css                    # Global Tailwind + theme styles

public/
├── favicon.svg                  # App icon
├── icons.svg                    # Icon sprite
├── sounds/                      # Game ambience and timer audio
└── icons/                       # PWA manifest icons (192x512)

e2e/                             # Playwright e2e tests
```

## Theme & Responsive Design

- **Dark/light mode**: Toggle via settings; persists to localStorage
- **Mobile first**: Phone portrait (single column), tablet landscape (sidebar layout)
- **Max width**: 512px on mobile, no limit on desktop (centered)
- **WCAG AA** compliance

## Deployment: Cloudflare Pages

### Prerequisites

- Cloudflare account
- Git repository (GitHub/GitLab/Gitea)

### Steps

1. **Connect repository**: In Cloudflare Pages dashboard, create new project and select your repo

2. **Configure build**:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)

3. **Environment variables** (if needed): Add in Pages > Settings > Environment variables

4. **Deploy**: Push to main branch; Cloudflare auto-builds and deploys

5. **Custom domain** (optional): Pages > Custom domains, point your domain DNS to Cloudflare

See [Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite-site/) for detailed setup.

## PWA Features

- **Installable**: "Add to Home Screen" on mobile
- **Offline support**: Assets cached via Workbox
- **Update prompt**: "Prompt-to-reload" strategy — user chooses when to refresh
- **Standalone mode**: Opens fullscreen on mobile

## Testing

```bash
# Unit & integration tests (Vitest)
npm test

# Watch mode
npm test:watch

# E2e tests (Playwright)
npm test:e2e
```

## Linting

```bash
npm run lint
```

## Code Standards

- TypeScript strict mode enforced
- ESLint config: flat config (no PostCSS)
- Component files use kebab-case filenames
- Store split into: store.ts (state) + actions.ts + selectors.ts
- Zustand persist middleware for localStorage sync

## Browser Support

- Chrome/Edge 120+
- Firefox 121+
- Safari 17+
- Fully responsive on mobile and tablet

## License

Private project. See LICENSE for details.
