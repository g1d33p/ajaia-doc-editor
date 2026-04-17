# AI Workflow Note

## Tools Used

- Claude (Anthropic) — primary tool for code generation, debugging, and architecture decisions

## Where AI Materially Sped Up My Work

### 1. Full stack scaffolding
I directed Claude to generate the entire application structure — auth pages, dashboard, document editor, Supabase schema, and RLS policies — in a single session. This compressed what would have been 2-3 days of setup into under 2 hours.

### 2. Supabase RLS debugging
The most complex debugging challenge was an infinite recursion error in the Row Level Security policies. I described the error to Claude, which identified the root cause (a self-referencing SELECT policy) and generated a clean fix using a security definer function pattern.

### 3. TipTap integration
Claude generated the full editor component including the formatting toolbar, extension configuration, and content persistence logic. I verified each formatting button worked as expected and confirmed content round-tripped correctly through Supabase.

### 4. Vercel deployment troubleshooting
Multiple deployment failures due to Edge runtime incompatibility with Supabase middleware imports. Claude identified the issue (Edge functions cannot import from non-edge modules) and simplified the middleware to a passthrough, moving auth logic into page components.

## What I Changed or Rejected

- **Rejected** the initial middleware approach that imported from a utility file — it worked locally but failed on Vercel's Edge runtime. Simplified to inline middleware.
- **Changed** the useEditor initialization to add `immediatelyRender: false` after a TipTap SSR hydration error in production.
- **Changed** the RLS policy approach twice — first fix still had recursion, second approach using CASCADE drop resolved it cleanly.
- **Rejected** ts-jest TypeScript config in favor of a plain JS jest.config.js to avoid ts-node dependency issues.

## How I Verified Correctness

- Tested every user flow manually in both local and production environments
- Verified document persistence by creating, saving, navigating away, and reopening
- Verified sharing by logging in as two separate test users
- Verified file upload with both .txt and .md files
- Ran automated tests with npm test before each deployment
- Confirmed production deployment matched local behavior

## Reflection

AI was most valuable for boilerplate elimination and debugging. The judgment calls — what to cut, what to prioritize, how to structure the data model, when a partial solution was good enough — remained entirely mine. AI accelerated execution; I directed the product.