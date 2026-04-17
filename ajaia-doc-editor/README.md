# DocEditor

A lightweight collaborative document editor built with Next.js, Supabase, and TipTap.

## Live Demo

https://ajaia-doc-editor-delta.vercel.app

## Test Credentials

| User | Email | Password |
|------|-------|----------|
| User 1 | testuser1@gmail.com | testpass123 |
| User 2 | testuser2@gmail.com | testpass123 |

To test sharing: log in as User 1, create a document, click Share, enter testuser2@gmail.com. Then log in as User 2 to see it under "Shared With Me".

## Features

- Create, rename, edit, save, and reopen documents
- Rich text formatting: Bold, Italic, Underline, H1, H2, Bullet List, Numbered List
- File upload: import .txt or .md files as editable documents
- Document sharing: share with any registered user by email
- Owned vs shared documents clearly distinguished on dashboard
- Full persistence via Supabase

## Local Setup

### Prerequisites
- Node.js 20+
- A Supabase project

### Steps

1. Clone the repository
   git clone https://github.com/g1d33p/ajaia-doc-editor.git
   cd ajaia-doc-editor

2. Install dependencies
   npm install

3. Create .env.local in the root
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

4. Set up the database
   Run the SQL in /docs/schema.sql in your Supabase SQL Editor

5. Start the dev server
   npm run dev

6. Open http://localhost:3000

## Running Tests

npm test

## Tech Stack

- Next.js 16 (App Router)
- Supabase (Auth + Database)
- TipTap (Rich text editor)
- Tailwind CSS
- Vercel (Deployment)