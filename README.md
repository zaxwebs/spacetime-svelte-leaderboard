# SpacetimeDB Leaderboard

A real-time leaderboard app built with [SpacetimeDB](https://spacetimedb.com) and [Svelte 5](https://svelte.dev).

<img width="1713" height="874" alt="{F9AC2D5C-8F0B-420A-BFDF-7B4DD606EA61}" src="https://github.com/user-attachments/assets/aad165a4-e193-4e8e-ae7d-5278450c7736" />


Players are managed through a CRUD interface, and the leaderboard updates in real-time across all connected clients — no polling, no REST APIs.

## Stack

- **Backend:** SpacetimeDB TypeScript module
- **Frontend:** Svelte 5 + Vite
- **Icons:** Lucide
- **Fonts:** Inter, JetBrains Mono

## Getting Started

### Prerequisites

- [SpacetimeDB CLI](https://spacetimedb.com/install)
- Node.js 18+

### Setup

```bash
# Install dependencies
npm install

# Publish the module (creates/updates the database)
spacetime publish spacetime-svelte-kbiux --clear-database -y --module-path spacetimedb

# Generate client bindings
spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb

# Start the dev server
npm run dev
```

### Environment

Configure `.env.local` with your SpacetimeDB host and database name:

```env
VITE_SPACETIMEDB_DB_NAME=spacetime-svelte-kbiux
VITE_SPACETIMEDB_HOST=https://maincloud.spacetimedb.com
```

## Project Structure

```
├── spacetimedb/src/index.ts    # Tables + reducers (backend)
├── src/
│   ├── module_bindings/        # Generated client bindings (do not edit)
│   ├── styles.css              # Global dark theme
│   ├── router.ts               # Hash-based routing
│   ├── Root.svelte             # SpacetimeDB connection provider
│   ├── App.svelte              # Router shell
│   ├── Nav.svelte              # Navigation bar
│   ├── PlayerManager.svelte    # CRUD + score controls
│   └── Leaderboard.svelte      # Real-time ranked leaderboard
```

## Features

- **Add / remove players** on the Players page
- **Adjust scores** with `+` / `−` buttons
- **Live leaderboard** sorted by score, with animated position changes
- **Real-time sync** across all connected clients via SpacetimeDB subscriptions
- Gold, silver, bronze rank styling for top 3

## License

[Apache-2.0](LICENSE)



