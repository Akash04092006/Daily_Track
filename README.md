# DailyTrack 🎯

DailyTrack is a minimalist, privacy-first habit and daily routine tracker engineered with modern web standards, an App Router architecture, and local SQLite persistence.

---

## 🛠 Tech Stack & Versions

- **Framework**: [Next.js](https://nextjs.org/) `16.4.3` (App Router + Turbopack)
- **UI Runtime**: [React](https://react.dev/) `19.3.0` & React DOM `19.3.0`
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) `v4` with CSS Variables and class-based Dark Mode
- **Database ORM**: [Prisma](https://www.prisma.io/) `6.19.3` with SQLite _(Pinned to 6.x because Prisma 7 removed `url` from `schema.prisma`, maintaining zero-compilation embedded SQLite simplicity)_
- **Validation**: [Zod](https://zod.dev/) `4.6.7` (Strict Environment & Schema Validation)
- **Testing**: [Vitest](https://vitest.dev/) `4.1.12`
- **Linting & Formatting**: [ESLint](https://eslint.org/) `9.x` & [Prettier](https://prettier.io/) `3.9.x`
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) `9.1.x`

---

## 📂 Project Structure

```
Daily_Track/
├── .husky/                  # Git pre-commit hooks
│   └── pre-commit
├── docs/                    # Architectural & project logs
│   ├── ARCHITECTURE.md      # Core architecture and system design
│   └── PHASE_LOG.md         # Milestone and phase execution log
├── prisma/                  # Database schema & migrations
│   └── schema.prisma        # SQLite datasource configuration
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated application route group
│   │   │   ├── analytics/   # Analytics "Coming soon" page
│   │   │   ├── calendar/    # Calendar "Coming soon" page
│   │   │   ├── dashboard/   # Dashboard overview page
│   │   │   ├── goals/       # Goals "Coming soon" page
│   │   │   ├── habits/      # Habit tracking catalog page
│   │   │   ├── settings/    # Application settings page
│   │   │   └── layout.tsx   # Authenticated app header & nav layout
│   │   ├── (auth)/          # Authentication route group
│   │   │   ├── login/       # Login placeholder page
│   │   │   ├── signup/      # Sign-up placeholder page
│   │   │   └── layout.tsx   # Centered card authentication layout
│   │   ├── globals.css      # Design tokens, CSS variables & theme config
│   │   ├── layout.tsx       # Root HTML layout with anti-FOUC theme script
│   │   └── page.tsx         # Root landing / index page
│   ├── components/          # UI Components
│   │   ├── features/        # Feature-specific components (.gitkeep)
│   │   ├── ui/              # Base reusable UI components (.gitkeep)
│   │   └── theme-toggle.tsx # Class-based dark/light theme switch
│   ├── hooks/               # Custom React hooks (.gitkeep)
│   ├── lib/                 # Core utilities and singletons
│   │   ├── env.ts           # Zod-validated environment config
│   │   └── prisma.ts        # HMR-safe Prisma Client singleton
│   ├── server/              # Server-only utilities & actions (.gitkeep)
│   └── types/               # Domain interfaces & TypeScript definitions
│       └── index.ts
├── tests/                   # Top-level automated test suite
│   ├── env.test.ts          # Environment schema validation tests
│   └── prisma.test.ts       # Prisma singleton tests
├── .env.example             # Environment variable template
├── .gitattributes           # Git LF line-ending normalization
├── .gitignore               # Git ignore rules
├── .prettierrc              # Prettier code formatting rules
├── eslint.config.mjs        # ESLint flat configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and lifecycle scripts
├── tsconfig.json            # TypeScript configuration
└── vitest.config.mts        # Vitest test configuration
```

---

## 🧭 Route Inventory

| Route        | Route Group | Purpose                                                | Render Type  |
| ------------ | ----------- | ------------------------------------------------------ | ------------ |
| `/`          | Root        | Landing page introducing features & quick links        | Static (`○`) |
| `/login`     | `(auth)`    | User sign-in form placeholder                          | Static (`○`) |
| `/signup`    | `(auth)`    | User sign-up form placeholder                          | Static (`○`) |
| `/dashboard` | `(app)`     | Daily summary, stats cards, and habit checklist        | Static (`○`) |
| `/habits`    | `(app)`     | Habit catalog, category filtering, and streak tracking | Static (`○`) |
| `/calendar`  | `(app)`     | Coming soon: monthly & weekly completion calendar      | Static (`○`) |
| `/analytics` | `(app)`     | Coming soon: habit consistency metrics and heatmaps    | Static (`○`) |
| `/goals`     | `(app)`     | Coming soon: milestone tracking and long-term targets  | Static (`○`) |
| `/settings`  | `(app)`     | Theme switcher, SQLite diagnostics, system info        | Static (`○`) |

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js `20.x` or `22.x`
- npm `10.x` or later

### 2. Installation

```bash
git clone https://github.com/Akash04092006/Daily_Track.git
cd Daily_Track
npm install --no-audit --no-fund
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Default variables in `.env`:

```env
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
```

### 4. Database Setup

```bash
npm run db:generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script                 | Command              | Description                                              |
| ---------------------- | -------------------- | -------------------------------------------------------- |
| `npm run dev`          | `next dev`           | Starts local Next.js development server with Turbopack   |
| `npm run build`        | `next build`         | Creates production build and validates static generation |
| `npm run start`        | `next start`         | Runs the compiled production server                      |
| `npm run lint`         | `eslint`             | Runs ESLint analysis across the repository               |
| `npm run typecheck`    | `tsc --noEmit`       | Validates TypeScript types across all files              |
| `npm test`             | `vitest run`         | Runs unit tests once in top-level `tests/`               |
| `npm run test:watch`   | `vitest`             | Runs unit tests in interactive watch mode                |
| `npm run format`       | `prettier --write .` | Formats all code files with Prettier                     |
| `npm run format:check` | `prettier --check .` | Verifies code conforms to Prettier formatting            |
| `npm run db:generate`  | `prisma generate`    | Generates the Prisma client library                      |
| `npm run db:push`      | `prisma db push`     | Pushes the Prisma schema to the SQLite database          |

---

## 🛡 Quality & Verification

Every pull request and commit passes through the following automated checks:

- **Type Safety**: Zero TypeScript compilation warnings or errors (`tsc --noEmit`)
- **Lint Integrity**: Zero ESLint rule violations (`eslint`)
- **Unit Testing**: Vitest suite in `tests/` verifying Zod env parsing and Prisma singleton (`vitest run`)
- **Git Hook**: Husky pre-commit hook enforcing `lint`, `typecheck`, and `test`
