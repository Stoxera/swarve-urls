<div align="center">
  <img src="https://i.ibb.co/Nd1XkVVZ/image.png" alt="Swarve Banner" width="100%" />

  # 🔗 Swarve
  **The ultra-minimalist, high-performance link management platform.**
  
  *Built with Next.js 15, Turso (SQLite), and Tailwind CSS.*

  <div align="center">
    <a href="https://swarve.link"><strong>Explore the Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Stoxera/swarve-urls/issues">Report Bug</a>
    ·
    <a href="https://github.com/Stoxera/swarve-urls/issues">Request Feature</a>
  </div>
  <br />

  [![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Turso DB](https://img.shields.io/badge/Turso-SQLite-antiquewhite?style=flat-square&logo=turso)](https://turso.tech/)
  [![Auth.js](https://img.shields.io/badge/Auth.js-v5-764ABC?style=flat-square&logo=authjs)](https://authjs.dev/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
</div>

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**Swarve** is more than a URL shortener; it's a developer-first tool to manage digital real estate. It offers a clean, distraction-free interface to transform long, messy URLs into branded, memorable links.

Designed for the modern web, Swarve leverages **Server Components** and **Edge Databases** to ensure that redirection and dashboard management happen in milliseconds, no matter where your users are.

---

## 🏗 Architecture

Swarve is built on a "Hybrid Edge" architecture:
- **Compute**: Next.js App Router (deployed on Vercel) for optimized SSR/ISR.
- **Database**: Turso (LibSQL) for low-latency data access at the edge.
- **Auth**: Stateless JWT sessions with Auth.js (NextAuth v5).



---

## ✨ Features

- **Dashboard**: A sleek, dark-themed control center to manage all your links.
- **Dynamic Link Limits**: User-specific quotas (e.g., 30 links for basic users) managed directly via the database.
- **Full CRUD**: Create, read, edit, and delete links with instant UI updates (Optimistic UI patterns).
- **Auto-Join Discord**: Seamlessly integrates with Discord OAuth to automatically add users to your community server.
- **Real-time Analytics**: Built-in click tracking for every shortened URL.
- **Randomized Slugs**: One-click nano-id generation for quick link creation.

---

## 🛠️ Tech Stack

### Frontend & Framework
- **Next.js 15**: Leveraging Server Actions and the latest App Router features.
- **Tailwind CSS**: Utility-first CSS for a custom, responsive "Cyber-Dark" UI.
- **Lucide React**: Beautiful & consistent iconography.
- **Radix UI**: Unstyled, accessible components for modals and tooltips.

### Backend & Storage
- **Turso**: Distributed SQLite database based on LibSQL.
- **Auth.js**: Secure authentication with Discord OAuth2.
- **Nanoid**: For generating short, non-sequential unique IDs.

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** and **npm/pnpm** installed. You will also need:
- A [Turso](https://turso.tech/) account.
- A [Discord Developer](https://discord.com/developers/applications) App for OAuth.

### 2. Environment Setup
Clone the repo and create a `.env.local` file:

```bash
# Auth
AUTH_SECRET= # Run 'npx auth secret' to generate
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Database
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# App
NEXTAUTH_URL=
```

### 3. Installation
```bash
pnpm install
pnpm dev
```

## 🗃 Database Schema
To get the application running, execute these SQL commands in your Turso shell:

```sql
-- Users table with dynamic limits
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  linksMax INTEGER DEFAULT 30
);

-- Links table with click tracking
CREATE TABLE links (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  userId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.