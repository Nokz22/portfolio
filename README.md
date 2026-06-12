# Portfolio — Nokz22

> Personal portfolio and CV website built to production standard. The codebase itself is the proof of skill.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript strict · Vite · Tailwind CSS |
| Animation | GSAP + ScrollTrigger · Lenis · Framer Motion · OGL (WebGL) |
| Backend | Spring Boot 3 · Java 17 · REST API v1 |
| Cache | Caffeine (GitHub API responses, 15 min TTL) |
| i18n | react-i18next (PT-PT primary, EN secondary) |
| Infra | Docker multi-stage · GitHub Actions CI/CD · Railway |

## Architecture

```
Browser → React SPA (Vite)
            ↓ /api/v1/*
         Spring Boot 3
            ↓ cache-aside
         GitHub API  /  JSON content files  /  SMTP
```

All secrets are environment variables — nothing hardcoded. See `.env.example`.

## Quick Start

### Prerequisites

- Node.js 20+
- Java 17+ (Temurin recommended)
- Docker + Docker Compose (optional, for containerised dev)

### With Docker

```bash
git clone https://github.com/Nokz22/portfolio.git
cd portfolio
cp .env.example .env   # fill in your values
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/v1

### Without Docker

```bash
# Terminal 1 — backend
cd backend
./gradlew bootRun

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

> **First-time backend setup:** if `./gradlew` is missing, run `gradle wrapper` once in `backend/`.

## Development Scripts

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run format` | Prettier |
| `npm test` | Vitest in watch mode |
| `npm run test:ci` | Vitest single run (CI) |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `./gradlew bootRun` | Start dev server with hot reload |
| `./gradlew test` | JUnit tests |
| `./gradlew bootJar` | Build fat JAR |
| `./gradlew checkstyleMain` | Checkstyle |

## Project Structure

```
personal-website/
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # ui/ · layout/ · sections/ · motion/
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # api client · i18n · motion tokens
│   │   ├── pages/          # Route-level components (lazy loaded)
│   │   └── types/          # DTO types (mirrors backend)
│   └── public/             # Static assets, robots.txt, sitemap.xml
│
├── backend/                # Spring Boot API
│   └── src/main/java/dev/nokz22/portfolio/
│       ├── controller/     # REST controllers (/api/v1/*)
│       ├── service/        # Business logic
│       ├── repository/     # Data access (JSON Phase 1, PostgreSQL Phase 2)
│       ├── dto/            # Request/response DTOs (never expose entities)
│       └── config/         # CORS, cache, security, rate limiting
│
├── .github/workflows/      # CI (lint→test→build) + deploy (Railway)
└── docker-compose.yml
```

## Quality Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Core bundle (gzipped) | < 150 KB |
| WCAG | 2.1 AA |

## Architecture Decisions

| ADR | Decision | Choice | Rationale |
|-----|----------|--------|-----------|
| 001 | Repo structure | Monorepo | Atomic cross-stack commits, unified CI |
| 002 | Backend runtime | Spring Boot 3 | Server-side GitHub cache, rate limiting, demonstrates backend skills |
| 003 | Frontend build | Vite + React Router | No SSR need; smaller bundle than Next.js; pure React |
| 004 | Content storage | JSON files → interface | Zero DB in Phase 1; repository abstraction enables PG migration without touching controllers |
| 005 | Animation | GSAP + Framer Motion | ScrollTrigger best-in-class for scrubbed scroll; AnimatePresence for routes |
| 006 | WebGL | OGL (~8 KB) | Single shader doesn't justify Three.js (~600 KB) |
| 007 | i18n | react-i18next | Industry standard, tree-shakeable, type-safe |
| 008 | Bundle strategy | Lazy chunks | GSAP/Lenis/OGL outside 150 KB core budget |
| 009 | Contact form | JavaMailSender | Email is what the owner needs; DB adds complexity without value |
| 010 | Rate limiting | Bucket4j in-process | Redis overkill at this scale |

## License

MIT
