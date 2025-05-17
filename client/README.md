# EcoFleet Client

This is the frontend application for the EcoFleet waste management platform, built with Next.js.

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

## Environment Setup

Create a `.env.local` file with the following variables:

```
MAP_BOX_ACCESS_TOKEN=your_mapbox_token
```

## Tech Stack

- Next.js 15
- React 19 
- TypeScript
- Tailwind CSS 4
- Mapbox GL JS
- Firebase Realtime Database
- Zustand for state management

## Mobile Optimization

The app is designed to be fully responsive with special considerations for:
- Touch interactions
- Mobile Safari bottom bar (using safe-area-inset)
- Adaptive layouts and typography

## Features

- Interactive map with container locations
- Recycling guide with material sorting instructions
- Route optimization for waste collection
- Collection schedule calendar

For more details, see the main [project README](../README.md) in the repository root.