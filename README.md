# Game Backlog

A desktop application to help gamers manage and conquer their video game backlog.

## Overview
Features implemented include the following
- Game Collection: Record games you own across platforms.
- Status tracker: Keep track of titles as `Unplayed`, `In-Progress`, `Finished`, or `Abandoned`.
- Rating: Rate games you have played and keep personal notes.
- Objectives and Levels of Completion: Set custom objectives for each game (e.g., clearing difficulty, finding collectibles, beating optional bosses). Ticking them off automatically updates the completion progress.

## Tech Stack
- Tauri, React , TypeScript and Vite 

## Folder Structure

```text
game-catalog/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Page layouts
│   ├── services/           # Data and storage layer
│   ├── assets/             # Static media and assets
│   ├── App.tsx             # Root component
│   └── main.tsx            # Frontend entry point
├── src-tauri/              # Tauri desktop backend (Rust)
│   ├── src/
│   │   ├── lib.rs          # Rust commands and logic
│   │   └── main.rs         # Native app entry point
│   ├── tauri.conf.json     # Tauri configuration
│   └── Cargo.toml          # Rust dependencies
├── public/                 # Public web assets
└── package.json            # Dependencies and scripts
```

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/)

### Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in the application in development mode**
   ```bash
   npm run tauri dev
   ```
   *(To preview the UI in a browser without native shell: `npm run dev`)*

3. **Build for production:**
   ```bash
   npm run tauri build
   ```
