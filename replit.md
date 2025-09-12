# Overview

MOBO NYC is a modern electronics hub that combines repair services with an e-commerce marketplace. Built as a Progressive Web App (PWA), it serves as a one-stop destination for electronics repair services and product sales. The application features a dual-purpose platform where users can book repair appointments for their devices and browse/purchase electronics products.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + TypeScript**: Modern component-based UI with type safety
- **Vite**: Fast development build tool with hot module replacement
- **Tailwind CSS + shadcn/ui**: Utility-first styling with pre-built components
- **Wouter**: Lightweight client-side routing
- **React Query (TanStack Query)**: Server state management and caching
- **React Hook Form + Zod**: Form handling with schema validation

## Backend Architecture
- **Express.js**: RESTful API server with middleware support
- **TypeScript**: Full-stack type safety
- **Session-based storage**: In-memory storage with planned database migration
- **Modular routing**: Organized API endpoints for products, appointments, and cart

## Data Layer
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **PostgreSQL**: Primary database (configured but using in-memory storage currently)
- **Schema-first design**: Shared TypeScript schemas between frontend and backend
- **Migration support**: Database versioning using Drizzle Kit for schema migrations

## Authentication & Sessions
- **Session-based cart**: Browser localStorage for cart session management
- **No user authentication**: Currently operates without user accounts
- **Guest checkout**: Streamlined purchase flow without registration

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure with Stripe Elements for secure card processing
- **Payment intents**: Server-side payment confirmation with webhook support

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL database service
- **Environment-based configuration**: Separate development and production database connections

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Google Fonts**: Custom font loading (Inter, DM Sans, Fira Code, Geist Mono)
- **Lucide React**: Consistent icon library

### Development Tools
- **Replit Integration**: Development environment optimizations
- **ESBuild**: Production bundling for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Progressive Web App
- **Service Worker**: Offline capability and caching strategy
- **Web App Manifest**: Native app-like experience on mobile devices
- **Installation prompts**: PWA installation detection and prompts

# Environment Variables

The project uses environment variables for configuration. Make sure to set the following variables in your Replit environment or `.env` files as needed:

- `DATABASE_URL` — PostgreSQL connection string (Neon or local)
- `STRIPE_SECRET_KEY` — Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `PORT` — Port for the backend server (default: 3000)
- `NODE_ENV` — Set to `development` or `production`

Refer to the README or deployment docs for more details.