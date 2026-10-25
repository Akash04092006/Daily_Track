# Daily_Track 🎯

Daily_Track is a minimalist, privacy-first habit and daily routine tracker engineered with modern web standards, an App Router architecture, session cookie authentication, and local SQLite persistence.

---

## 🛠 Tech Stack & Versions

- **Framework**: [Next.js](https://nextjs.org/) `16.4.3` (App Router + Turbopack + Proxy)
- **UI Runtime**: [React](https://react.dev/) `19.3.0` & React DOM `19.3.0`
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) `v4` with CSS Variables and class-based Dark Mode
- **Database ORM**: [Prisma](https://www.prisma.io/) `6.19.3` with SQLite _(Pinned to 6.x for zero-compilation embedded SQLite simplicity)_
- **Authentication**: Signed JWT session cookies via [jose](https://github.com/panva/jose) `6.2.x` and [bcryptjs](https://github.com/dcodeIO/bcrypt.js) `3.0.x`
- **Validation**: [Zod](https://zod.dev/) `4.6.7` (Strict Environment & Schema Validation)
- **Testing**: [Vitest](https://vitest.dev/) `4.1.12` (with isolated `test.db` database)
- **Code Quality**: [ESLint](https://eslint.org/) `9.x`, [Prettier](https://prettier.io/) `3.9.x`, [Husky](https://typicode.github.io/husky/) `9.1.x`

---

## 📂 Project Structure

```
Daily_Track/
├── .husky/                  # Git pre-commit hooks
│   └── pre-commit
├── docs/                    # Architectural & project logs
│   ├── API.md               # Complete REST API endpoint reference
│   ├── ARCHITECTURE.md      # Core architecture and system design
│   ├── DATA_MODEL.md        # Relational ERD and database dictionary
│   └── PHASE_LOG.md         # Milestone and phase execution log
├── prisma/                  # Database schema & migrations
│   ├── migrations/          # SQLite migrations
│   ├── schema.prisma        # Complete schema (7 models, cascade rules, indexes)
│   └── seed.ts              # Idempotent demo seeder
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (app)/           # Protected application route group
│   │   ├── (auth)/          # Authentication route group
│   │   ├── api/             # REST API Route Handlers
│   │   │   ├── auth/        # /api/auth (signup, login, logout, me)
│   │   │   ├── daily-entries# /api/daily-entries (range & date upsert)
│   │   │   ├── goals/       # /api/goals, milestones, habit links
│   │   │   ├── habit-logs/  # /api/habit-logs (range query)
│   │   │   ├── habits/      # /api/habits (CRUD, reorder, archive, logs)
│   │   │   ├── profile/     # /api/profile (preferences, password)
│   │   │   ├── stats/       # /api/stats (summary counts stub)
│   │   │   └── today/       # /api/today (today overview)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # UI components
│   ├── hooks/               # Custom hooks (.gitkeep)
│   ├── lib/                 # Shared utilities
│   │   ├── constants.ts     # Domain constants, categories, statuses, icons
│   │   ├── dates.ts         # Timezone-safe date formatting and range helpers
│   │   ├── env.ts           # Zod-validated environment config
│   │   └── prisma.ts        # HMR-safe Prisma Client singleton
│   ├── proxy.ts             # Next.js 16 Proxy convention (route protection)
│   ├── server/              # Backend service layer
│   │   ├── auth/            # Hashing, JWT session & rate limiting
│   │   ├── services/        # Domain business logic
│   │   ├── utils/           # Response wrappers (apiSuccess, apiError)
│   │   └── validators/      # Zod request validators
│   └── types/               # Domain interfaces & TypeScript definitions
│       └── index.ts
├── tests/                   # Automated Vitest test suite
│   ├── dates.test.ts        # Date and timezone edge-case tests
│   ├── env.test.ts          # Environment schema validation tests
│   ├── habits-service.test.ts # Multi-tenant isolation service tests
│   ├── password.test.ts     # Bcryptjs password hashing tests
│   ├── prisma.test.ts       # Prisma singleton tests
│   ├── session.test.ts      # Jose JWT session tests
│   └── validators.test.ts   # Zod request validation tests
├── .env.example             # Environment variable template
├── .gitattributes           # Git LF line-ending normalization
├── .gitignore               # Git ignore rules
├── .prettierrc              # Prettier code formatting rules
├── eslint.config.mjs        # ESLint flat configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and lifecycle scripts
├── tsconfig.json            # TypeScript configuration
└── vitest.config.mts        # Vitest test configuration (with test.db)
```

---

## 🧭 REST API Overview

| Group             | Route                                    |           Method           | Description                                         |
| ----------------- | ---------------------------------------- | :------------------------: | --------------------------------------------------- |
| **Auth**          | `/api/auth/signup`                       |           `POST`           | Register account & set session cookie               |
| **Auth**          | `/api/auth/login`                        |           `POST`           | Sign in & set session cookie                        |
| **Auth**          | `/api/auth/logout`                       |           `POST`           | Clear session cookie                                |
| **Auth**          | `/api/auth/me`                           |           `GET`            | Get current authenticated user                      |
| **Habits**        | `/api/habits`                            |           `GET`            | List active/archived habits by category             |
| **Habits**        | `/api/habits`                            |           `POST`           | Create a new habit                                  |
| **Habits**        | `/api/habits/:id`                        | `GET` / `PATCH` / `DELETE` | Read, update, or delete a habit                     |
| **Habits**        | `/api/habits/:id/archive`                |           `POST`           | Toggle archived state                               |
| **Habits**        | `/api/habits/reorder`                    |           `POST`           | Reorder habits via sortOrder array                  |
| **Habit Logs**    | `/api/habits/:id/logs/:date`             |      `PUT` / `DELETE`      | Upsert or delete log for habit and date             |
| **Habit Logs**    | `/api/habit-logs`                        |           `GET`            | Query logs by date range (`from`, `to`, `habitId`)  |
| **Today View**    | `/api/today`                             |           `GET`            | Complete today view (due habits, logs, daily entry) |
| **Daily Journal** | `/api/daily-entries`                     |           `GET`            | Query journal entries by date range                 |
| **Daily Journal** | `/api/daily-entries/:date`               |  `GET` / `PUT` / `DELETE`  | Read, upsert, or delete journal entry               |
| **Goals**         | `/api/goals`                             |       `GET` / `POST`       | List goals by status or create a goal               |
| **Goals**         | `/api/goals/:id`                         | `GET` / `PATCH` / `DELETE` | Read, update, or delete a goal                      |
| **Milestones**    | `/api/goals/:id/milestones`              |           `POST`           | Add milestone to goal                               |
| **Milestones**    | `/api/goals/:id/milestones/:milestoneId` |     `PATCH` / `DELETE`     | Update or delete a milestone                        |
| **Goal Habits**   | `/api/goals/:id/habits`                  |           `PUT`            | Replace linked habits for a goal                    |
| **Profile**       | `/api/profile`                           |      `GET` / `PATCH`       | Get or update profile & preferences                 |
| **Profile**       | `/api/profile/password`                  |           `POST`           | Update account password                             |
| **Stats**         | `/api/stats/summary`                     |           `GET`            | Dashboard count metrics stub                        |

_For full request/response schemas and examples, see [`docs/API.md`](docs/API.md)._

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
AUTH_SECRET="daily-track-secure-auth-secret-key-must-be-32-chars-long!"
DATABASE_URL="file:./dev.db"
```

### 4. Database Migration & Seeding

```bash
# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 5. Demo Account Credentials

- **Email**: `demo@dailytrack.app`
- **Password**: `Demo@1234`
- **Seeded Data**: 7 habits across categories, 301 habit logs (60 days), 31 daily journal entries (30 days), 3 goals with milestones, and habit associations.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script                 | Command                        | Description                                         |
| ---------------------- | ------------------------------ | --------------------------------------------------- |
| `npm run dev`          | `next dev`                     | Starts Next.js development server with Turbopack    |
| `npm run build`        | `next build`                   | Creates production build and validates all routes   |
| `npm run start`        | `next start`                   | Runs the compiled production server                 |
| `npm run lint`         | `eslint`                       | Runs ESLint analysis across the repository          |
| `npm run typecheck`    | `tsc --noEmit`                 | Validates TypeScript types across all files         |
| `npm test`             | `vitest run`                   | Runs test suite against isolated `test.db`          |
| `npm run test:watch`   | `vitest`                       | Runs tests in interactive watch mode                |
| `npm run format`       | `prettier --write .`           | Formats all code and markdown files                 |
| `npm run format:check` | `prettier --check .`           | Verifies code conforms to Prettier formatting       |
| `npm run db:migrate`   | `prisma migrate dev`           | Applies new schema migrations to SQLite             |
| `npm run db:seed`      | `prisma db seed`               | Seeds database with demo account and realistic data |
| `npm run db:reset`     | `prisma migrate reset --force` | Drops database, reapplies migrations, and seeds     |
| `npm run db:studio`    | `prisma studio`                | Opens Prisma Studio GUI in browser                  |
| `npm run db:generate`  | `prisma generate`              | Generates the Prisma client library                 |
| `npm run db:push`      | `prisma db push`               | Pushes schema directly to database                  |
