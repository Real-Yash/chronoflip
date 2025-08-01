# Overview

This is a React-based flip clock application with Pomodoro timer functionality. The app features a retro-style digital clock with animated flip cards that display time and countdown timers. It includes both a regular clock mode and a Pomodoro productivity timer with customizable work and break periods. The application uses modern web technologies including React, TypeScript, and Tailwind CSS for styling, with a full-stack architecture supporting both frontend and backend components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React hooks with TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for server-side bundling

## Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared schema definitions between client and server

## Component Design
- **UI Components**: Radix UI primitives with custom styling
- **Custom Components**: FlipCard component for animated time display
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Animation**: CSS-based flip animations for retro clock aesthetic

## State Management Patterns
- **Timer Logic**: Custom React hooks (usePomodoroTimer) for timer state
- **Settings**: Local state management for user preferences
- **Notifications**: Custom sound generation using Web Audio API
- **Theme**: CSS custom properties for light/dark mode support

## Development Environment
- **Hot Reload**: Vite HMR with React Fast Refresh
- **Error Handling**: Runtime error overlay for development
- **Path Aliases**: TypeScript path mapping for clean imports
- **Linting**: TypeScript strict mode with comprehensive error checking

# External Dependencies

## UI and Styling
- **shadcn/ui**: Complete UI component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Modern icon library for consistent iconography

## State and Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting utilities

## Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Express.js**: Web framework for API routes and middleware
- **connect-pg-simple**: PostgreSQL session store for Express

## Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Audio and Notifications
- **Web Audio API**: Browser-native sound generation for timer notifications
- **Custom Sound Hooks**: React hooks for managing notification sounds