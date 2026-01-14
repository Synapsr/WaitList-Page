# Waitlist

Ce dépôt contient deux projets de waitlist :

1. **Waitlist Page (Go)** - Une page de waitlist simple et légère déployable en une commande Docker
2. **Waitlist SaaS (Next.js)** - Une application SaaS complète pour créer et gérer plusieurs pages de waitlist avec authentification et dashboard (dans le dossier `nextjs-saas/`)

---

## 🚀 Waitlist Page (Go)

A beautiful, dead-simple waitlist page that deploys in seconds. One Docker command, zero configuration required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## Features

- **One command deploy** - Works out of the box with sensible defaults
- **Fully customizable** - Configure everything via environment variables
- **Multiple storage backends** - JSON file, webhooks, SMTP notifications
- **Modern UI** - Clean, responsive design with dark/light themes
- **Countdown timer** - Optional launch countdown
- **Tiny footprint** - ~15MB Docker image
- **Production ready** - Rate limiting, input validation, health checks

## Quick Start

```bash
docker run -p 3000:3000 ghcr.io/synapsr/waitlist-page
```

That's it. Open http://localhost:3000

## Customization

```bash
docker run -p 3000:3000 \
  -e TITLE="My Awesome App" \
  -e SUBTITLE="Join the revolution" \
  -e PRIMARY_COLOR="#10b981" \
  -e THEME="dark" \
  -e COUNTDOWN_DATE="2024-12-31T00:00:00Z" \
  -v ./data:/data \
  ghcr.io/synapsr/waitlist-page
```

## Configuration

### Display

| Variable | Default | Description |
|----------|---------|-------------|
| `TITLE` | `Something awesome is coming` | Main heading |
| `SUBTITLE` | `Be the first to know when we launch...` | Subheading |
| `LOGO_URL` | - | URL to your logo image |
| `PRIMARY_COLOR` | `#6366f1` | Brand color (hex) |
| `THEME` | `light` | `light` or `dark` |
| `COUNTDOWN_DATE` | - | ISO 8601 date for countdown |
| `BUTTON_TEXT` | `Join Waitlist` | Submit button text |
| `PLACEHOLDER` | `Enter your email` | Input placeholder |
| `SUCCESS_MESSAGE` | `You're on the list!` | Success message |

### Storage

| Variable | Default | Description |
|----------|---------|-------------|
| `STORAGE_TYPE` | `json` | `json`, `webhook`, `smtp`, or `multi` |

#### JSON Storage (Default)

Emails are saved to a JSON file. Mount a volume to persist data:

```bash
docker run -p 3000:3000 -v ./data:/data ghcr.io/synapsr/waitlist-page
```

Emails are stored in `/data/emails.json`:

```json
[
  {
    "email": "user@example.com",
    "timestamp": "2024-01-15T10:30:00Z",
    "ip": "192.168.1.1"
  }
]
```

#### Webhook Storage

Send emails to any HTTP endpoint (Zapier, Make, n8n, your API):

```bash
docker run -p 3000:3000 \
  -e STORAGE_TYPE=webhook \
  -e WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/xxx/xxx/" \
  -e WEBHOOK_SECRET="optional-secret" \
  ghcr.io/synapsr/waitlist-page
```

Payload sent to your webhook:

```json
{
  "email": "user@example.com",
  "timestamp": "2024-01-15T10:30:00Z",
  "ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

If `WEBHOOK_SECRET` is set, requests include an `X-Webhook-Signature` header with HMAC-SHA256 signature.

#### SMTP Notifications

Get an email notification for each signup (also saves to JSON):

```bash
docker run -p 3000:3000 \
  -e STORAGE_TYPE=smtp \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=you@gmail.com \
  -e SMTP_PASS=your-app-password \
  -e SMTP_FROM=you@gmail.com \
  -e SMTP_TO=you@gmail.com \
  -v ./data:/data \
  ghcr.io/synapsr/waitlist-page
```

#### Multi Storage

Combine multiple backends:

```bash
docker run -p 3000:3000 \
  -e STORAGE_TYPE=multi \
  -e STORAGE_BACKENDS="json,webhook" \
  -e WEBHOOK_URL="https://your-webhook.com" \
  -v ./data:/data \
  ghcr.io/synapsr/waitlist-page
```

### Admin API

Access collected emails via API:

```bash
docker run -p 3000:3000 \
  -e ADMIN_TOKEN="your-secret-token" \
  -v ./data:/data \
  ghcr.io/synapsr/waitlist-page
```

```bash
curl -H "Authorization: Bearer your-secret-token" http://localhost:3000/api/emails
```

## Docker Compose

```yaml
services:
  waitlist:
    image: ghcr.io/synapsr/waitlist-page:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      - TITLE=My Product
      - PRIMARY_COLOR=#10b981
      - THEME=dark
    restart: unless-stopped
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Waitlist page |
| `POST` | `/api/subscribe` | Submit email |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/emails` | List emails (requires `ADMIN_TOKEN`) |

## Development

```bash
# Clone
git clone https://github.com/Synapsr/WaitList-Page.git
cd WaitList-Page

# Run with Docker
docker compose up --build

# Or with Go
go run .
```

## Deployment Examples

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/waitlist)

### Fly.io

```bash
fly launch
fly secrets set TITLE="My App" PRIMARY_COLOR="#10b981"
fly deploy
```

### Render

Create a new Web Service, connect your repo, and set environment variables in the dashboard.

## Security

- Email validation (format + length)
- Rate limiting (5 requests/minute per IP)
- XSS prevention (escaped outputs)
- Webhook signature verification (HMAC-SHA256)
- Non-root container user

## License

MIT

---

## 🎯 Waitlist SaaS (Next.js)

Une application SaaS complète pour créer et gérer plusieurs pages de waitlist avec authentification et dashboard.

### Fonctionnalités

- ✅ **Authentification complète** : Inscription et connexion sécurisées
- ✅ **Dashboard intuitif** : Gérez toutes vos waitlists depuis un seul endroit
- ✅ **Personnalisation complète** : Couleurs, logo, contenu personnalisables
- ✅ **Gestion des abonnés** : Visualisez et exportez vos inscriptions en CSV
- ✅ **Pages publiques** : URLs personnalisables pour chaque waitlist (`/w/[slug]`)
- ✅ **Champs personnalisables** : Collectez nom, email, entreprise selon vos besoins

### Technologies

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité de type
- **Prisma** avec SQLite (facilement migrable vers PostgreSQL)
- **NextAuth.js** pour l'authentification
- **Tailwind CSS** pour le styling
- **bcryptjs** pour le hachage des mots de passe

### Installation

```bash
cd nextjs-saas
npm install
npx prisma migrate dev
npx prisma generate
```

Configurez les variables d'environnement dans `.env.local` :

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="votre-secret-key-changez-en-production"
NEXTAUTH_URL="http://localhost:3000"
```

Lancez le serveur de développement :

```bash
npm run dev
```

Pour plus de détails, consultez le [README du projet Next.js](./nextjs-saas/README.md).
