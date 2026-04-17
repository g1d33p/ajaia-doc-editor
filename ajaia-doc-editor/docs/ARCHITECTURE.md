# Architecture Note

## Overview

DocEditor is a full stack Next.js application using Supabase for authentication and persistence, and TipTap for rich text editing.

## Stack Decisions

### Next.js App Router
Chosen for its file-based routing and seamless server/client component model. All page components are client components since they require real-time auth state and editor interactivity.

### Supabase
Handles three concerns in one service: authentication, database, and row-level security. This eliminated the need for a separate backend API, keeping the architecture simple and the scope manageable within the timebox.

### TipTap
Best-in-class headless rich text editor for React. Chosen over alternatives like Quill or Slate for its clean extension model and first-class TypeScript support. Content is stored as HTML in Supabase.

### Tailwind CSS
Utility-first CSS for rapid UI development without context switching.

### Vercel
Zero-config deployment for Next.js. Auto-deploys on git push.

## Data Model

### profiles
Extends Supabase auth.users. Stores email for share lookups.

### documents
Stores title, HTML content, owner_id, and timestamps. Row-level security ensures users can only access their own documents or documents shared with them.

### document_shares
Join table linking documents to shared users by email and user ID.

## What I Prioritized

1. Core editing experience — TipTap with full formatting toolbar
2. Auth and persistence — Supabase handles both cleanly
3. Sharing model — simple but functional, demonstrates clear intent
4. File upload — .txt and .md files convert to editable documents

## What I Deliberately Cut

- Real-time collaboration — requires WebSocket infrastructure, out of scope for timebox
- Version history — valuable but non-essential for MVP
- Role-based permissions — basic owner/shared model is sufficient for this scope
- Export to PDF — stretch goal, deprioritized for core stability

## If Given 2-4 More Hours

- Add auto-save on keystroke with debounce
- Add document deletion from dashboard
- Add role-based sharing (view vs edit)
- Add export to Markdown