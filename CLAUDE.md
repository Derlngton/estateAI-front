# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev          # Start Vite development server (default: http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## Architecture Overview

### Tech Stack
- **Framework**: Vue 3 with Composition API (`<script setup>` syntax)
- **Build Tool**: Vite
- **Language**: JavaScript (no TypeScript)
- **Styling**: Vanilla CSS with scoped styles in components

### Project Structure
```
/src
  /components
    Header.vue      - Navigation header with fashion-inspired design
    AgentCard.vue   - Agent display card component
  App.vue          - Main application component with agent management logic
  main.js          - Vue app entry point
  style.css        - Global styles and CSS variables
/index.html        - HTML entry point
vite.config.mjs    - Vite configuration with Vue plugin
```

### Application Purpose
AI Agents platform for real estate agents. Manages AI assistants that communicate with clients via WhatsApp.

### Component Architecture

#### App.vue
Main container component that:
- Manages agent state using Vue 3 Composition API (`ref()`)
- Stores sample agents data with properties: id, name, phone, type, description, avatar (Unsplash URLs), status, conversations
- Provides `createNewAgent()` function that generates random agents
- Renders empty state when no agents exist
- Uses CSS Grid to display agent cards

#### AgentCard.vue
Presentation component that:
- Receives agent data via props
- Emits click events to parent
- Displays avatar, name, phone, type, description, and conversation stats
- Uses scoped styles (styles defined in parent style.css)

#### Header.vue
Fashion-inspired navigation with:
- "ESTATE AI" logo using Playfair Display font
- Center-aligned navigation links
- Icon buttons for search, profile, favorites, notifications
- Sticky positioning with minimal shadow

### State Management
Simple reactive state using Vue 3 `ref()`:
- `agents` array contains all agent objects
- No Vuex/Pinia - state lives directly in App.vue
- Agent mutations happen through array methods (push, etc.)

### Styling Approach
Premium fashion-inspired design:
- CSS custom properties (CSS variables) in `:root`
- Color palette: black primary (#000000), beige accent (#8b7355), white backgrounds
- Typography: Inter for body text, Playfair Display for logo
- Minimal borders, subtle shadows
- Card hover effects with translateY animation
- Responsive breakpoints at 768px and 1024px
- No CSS preprocessor - vanilla CSS only
