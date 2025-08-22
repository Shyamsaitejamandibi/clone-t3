
# clone-t3

A modern web application built with Next.js, TypeScript, and Convex.

## Features
- Next.js 14 app directory structure
- TypeScript for type safety
- Convex for backend/database
- Shadcn UI components (with t3-chat theme)
- pnpm for fast package management

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (https://pnpm.io/)

### Installation

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd clone-t3
	```
2. Install dependencies:
	```bash
	pnpm install
	```
3. Set up Convex:
	- Follow Convex setup instructions in `convex/README.md` or [Convex docs](https://docs.convex.dev/).

4. Run the development server:
	```bash
	pnpm dev
	```
	Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
components.json           # Shadcn UI components config
next.config.ts            # Next.js configuration
package.json              # Project metadata and scripts
convex/                   # Convex backend schema and generated files
lib/                      # Utility functions
providers/                # React providers (e.g., Convex client)
public/                   # Static assets
app/                      # Next.js app directory (pages, layouts, styles)
```

## Scripts
- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server

## License
MIT
