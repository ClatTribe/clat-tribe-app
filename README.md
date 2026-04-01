# CLAT Tribe App

React + Supabase web app for CLAT GK preparation.

## Tech Stack
- React 19 + Vite 8
- Tailwind CSS 4
- Supabase (Auth + Database)
- React Router 7
- PWA (Service Worker + Manifest)

## Features
- 15 pages: Dashboard, Article, Daily News, Flashcards, Analytics, Mock Test, Weekly Quiz, Flowcharts, Monthly Revision, Static GK, Legal CA, Persons in News, Acts & Bills, Indices, PYQ Bank
- Supabase authentication (Email + Google OAuth)
- Dark mode
- Mobile-responsive with bottom nav
- Passage-based mock tests with negative marking
- 25+ flashcards across 6 categories
- Searchable Static GK library

## Setup
```bash
npm install
npm run dev
```

Set environment variables:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```
