# Portfolio — Nuno Ferreira

> Personal portfolio built to production standard. The codebase itself is the proof of skill.

[![CI](https://github.com/Nokz22/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Nokz22/portfolio/actions/workflows/ci.yml)

## 🔗 [portfolio-orcin-omega-47.vercel.app](https://portfolio-orcin-omega-47.vercel.app)

**Live:** https://portfolio-orcin-omega-47.vercel.app &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/nuno-ferreira-a02552203/) &nbsp;·&nbsp; [GitHub](https://github.com/Nokz22)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript strict · Vite · Tailwind CSS |
| Animation | GSAP · Lenis · Framer Motion · OGL (WebGL shader) |
| Backend | Spring Boot 3 · Java 17 · REST API v1 |
| Cache | Caffeine (GitHub API, 15 min TTL) |
| i18n | react-i18next (PT-PT primary, EN secondary) |
| Fonts | @fontsource-variable (self-hosted, no Google Fonts CDN) |
| Infra | Docker multi-stage · GitHub Actions CI · Render (backend) · Vercel (frontend) |

## Architecture

```
Browser → React SPA (Vite + Nginx)
              ↓ /api/v1/*
          Spring Boot 3
              ├── Caffeine cache (GitHub API)
              ├── JSON content files (profile, experience, skills)
              └── JavaMailSender (SMTP contact form)
```

All secrets are environment variables — nothing hardcoded. See `.env.example`.

---

## Quick Start

### Prerequisites

- Node.js 20+
- Java 17+ (Temurin recommended)
- Docker + Docker Compose (optional)

### With Docker (development)

```bash
git clone https://github.com/Nokz22/portfolio.git
cd portfolio
cp .env.example .env   # fill in your values
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1

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

### Production build (local test)

```bash
cp .env.example .env  # set VITE_API_URL and CORS_ALLOWED_ORIGINS
docker compose -f docker-compose.prod.yml up --build
```

---

## Development Scripts

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR on :3000 |
| `npm run build` | TypeScript check + production bundle |
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run format` | Prettier |
| `npm test` | Vitest watch mode |
| `npm run test:ci` | Vitest single run + coverage |

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `./gradlew bootRun` | Start dev server |
| `./gradlew test` | JUnit tests + JaCoCo coverage |
| `./gradlew bootJar` | Build fat JAR |
| `./gradlew checkstyleMain` | Checkstyle (zero warnings) |

---

## Deployment (Render + Vercel)

### Backend — Render (Docker, Free tier)

1. Create a [Render](https://render.com) account → **New Web Service**
2. Connect `Nokz22/portfolio`, set **Root Directory** to `backend`, **Language** to `Docker`
3. Set environment variables in the Render dashboard:

```
GITHUB_USERNAME=Nokz22
GITHUB_TOKEN=ghp_...
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=app_password_16chars
CONTACT_RECIPIENT_EMAIL=your@gmail.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend — Vercel (Free tier)

1. Create a [Vercel](https://vercel.com) account → **Add New Project**
2. Import `Nokz22/portfolio`, set **Root Directory** to `frontend`
3. Set environment variable:

```
VITE_API_URL=https://your-backend.onrender.com
```

> **Note:** Free Render instances spin down after inactivity — first request after idle may take ~50 seconds.

---

## Project Structure

```
portfolio/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   ├── sections/        # Hero, About, Experience, Skills, Projects, Contact
│   │   │   ├── ui/              # CustomCursor, SkeletonLoader, LanguageToggle, SkipToContent
│   │   │   └── webgl/           # ForgeShader (OGL)
│   │   ├── hooks/               # useProfile, useExperience, useSkills, useProjects, useContactForm
│   │   ├── lib/                 # api client · i18n · motion tokens
│   │   ├── pages/               # Home, ProjectDetail, NotFound (lazy-loaded)
│   │   └── types/               # DTO interfaces (mirrors backend)
│   ├── public/                  # favicon.svg, og-image.svg, robots.txt, sitemap.xml
│   ├── nginx.conf               # SPA routing + cache headers + CSP
│   └── Dockerfile               # multi-stage: dev / build / nginx runtime
│
├── backend/                     # Spring Boot REST API
│   └── src/main/java/dev/nokz22/portfolio/
│       ├── config/              # Security, CORS, cache, rate limiter, GitHub client
│       ├── controller/          # ContentController, ProjectController, ContactController
│       ├── service/             # ContentService, GithubService, ContactService
│       ├── repository/          # ContentRepository interface + JsonContentRepository
│       ├── dto/                 # Request/response DTOs (never expose models directly)
│       ├── model/               # Internal data models
│       └── exception/           # GlobalExceptionHandler (RFC 7807), custom exceptions
│   └── src/main/resources/
│       ├── content/             # profile.json, experience.json, skills.json
│       └── application.yml
│
├── .github/workflows/           # ci.yml + deploy.yml
├── docker-compose.yml           # Development (hot reload)
├── docker-compose.prod.yml      # Production (multi-stage builds)
└── .env.example                 # All required environment variables
```

---

## Quality Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Core bundle (gzipped) | < 150 KB |
| WCAG | 2.1 AA |

---

## Architecture Decisions (ADR)

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 001 | Repo structure | Monorepo | Atomic cross-stack commits, single CI pipeline |
| 002 | Backend runtime | Spring Boot 3 | Server-side GitHub cache, rate limiting, showcases Java skills |
| 003 | Frontend build | Vite + React Router | No SSR needed; leaner than Next.js; pure React |
| 004 | Content storage | JSON files + repository interface | Zero DB complexity in Phase 1; abstraction enables PostgreSQL migration without touching controllers/services |
| 005 | Animation | GSAP + Framer Motion + Lenis | GSAP for cursor/scroll; Framer Motion for page transitions; Lenis for smooth scroll momentum |
| 006 | WebGL | OGL (~8 KB) | Single shader doesn't justify Three.js (~600 KB) — stays within 150 KB bundle budget |
| 007 | i18n | react-i18next | Industry standard; LanguageDetector + JSON files; hooks re-render on lang change |
| 008 | Bundle chunks | manualChunks (Vite) | vendor-motion, vendor-scroll, vendor-webgl as separate lazy chunks |
| 009 | Contact anti-spam | Honeypot + Bucket4j rate limit | No CAPTCHA UX friction; honeypot silent-fails bots; 5 req/h per IP prevents flooding |
| 010 | Rate limiting | Bucket4j in-process | Redis would be overkill at this traffic level; ConcurrentHashMap is thread-safe |
| 011 | Fonts | @fontsource-variable (self-hosted) | Eliminates Google Fonts CDN dependency, DNS lookup, and render-blocking; WOFF2 served from same origin |
| 012 | Security headers | Spring Security + Nginx CSP | Backend handles HSTS/X-Frame/X-Content-Type; Nginx adds CSP, Permissions-Policy |

---

## License

MIT
