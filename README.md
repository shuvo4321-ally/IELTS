# IELTS Core

A focused, step-by-step video learning platform for the IELTS journey. Work through the course in order, and the app remembers what you have finished.

## Course sections

1. Start and Study Mindset
2. Grammar Foundation
3. Vocabulary Foundation
4. Pronunciation Foundation
5. Listening
6. Reading
7. Writing: Academic IELTS
8. Speaking

## Features

- Landing page, dashboard and a video player page with a lesson drawer
- Per-user progress tracking (not started / in progress / completed), stored in Firestore
- Sign-in with Firebase Authentication
- Previous / next lesson navigation

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, Firebase (Auth + Firestore), Motion

## Getting started

Prerequisites: Node.js 18+ and a Firebase project.

```bash
npm install
cp .env.example .env     # set values as needed
npm run dev              # http://localhost:3000
```

The Firebase project is configured in `firebase-applet-config.json`, and Firestore security rules are in `firestore.rules`. The lesson list lives in `src/data/videos.ts`.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run lint` | Type-check with `tsc` |