# 🏢 One Studio - Interior Design & Architecture Web Application

High-performance Next.js application for One Studio (Bengaluru), featuring bespoke interior design showcases, interactive cost calculators, local SEO engine, lead capture system, and a Yoast-style admin dashboard.

---

## ⚡ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | React 19 framework with Turbopack & SSG/ISR static rendering |
| **Language** | **TypeScript 5** | Strict type safety for data models and Server Actions |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS framework |
| **Database** | **Supabase (PostgreSQL)** | Cloud database for `leads` and `blogs` tables |
| **Backend** | **Next.js Server Actions** | Native server execution for form submissions and admin controls |
| **Notifications** | **Resend Email API** | Automated email alert dispatching for sales leads |
| **SEO Suite** | **Yoast-Style SEO Engine** | Live Google SERP simulator, focus keyword analyzer, JSON-LD schemas |

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Admin Dashboard & Yoast SEO Suite

Access the Admin Dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

- **Default Passcode**: `onestudio2025`
- **Features**:
  1. 📥 **Leads Inbox**: View, filter, and export customer leads to CSV.
  2. ✍️ **Blog Writer Studio**: Publish blog posts to Supabase with real-time Yoast SEO scoring.
  3. 🎯 **Yoast Page SEO Manager**: Edit Google Title Tags and Meta Descriptions with live SERP preview.
  4. 📍 **Local SEO Directory**: Preview geo-targeted neighborhood landing pages (`/[slug]`).

---

## 📖 Complete Documentation

- 📄 [`SEO_SYSTEM.md`](file:///Users/naveenadicharla/Documents/constrc-app/SEO_SYSTEM.md) - Full technical documentation for the SEO Engine, Yoast Suite, and Schema.org markup.
- 📄 [`supabase/schema.sql`](file:///Users/naveenadicharla/Documents/constrc-app/supabase/schema.sql) - Supabase SQL setup script.
