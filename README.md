# 스트림스 메트로 (Streams Metro)

A web-based implementation of the Metro X board game. Complete metro lines and earn the highest score by creating ascending sequences!

## Game Overview

스트림스 메트로 is a strategic puzzle game where players mark stations on metro lines by drawing cards. The goal is to create the longest ascending sequences to maximize your score.

### How to Play

1. **Setup**: Choose player count (1-4), number of lines (1-3), and transfer stations (0-3)
2. **Draw Cards**: Each turn, a card is revealed from the deck
3. **Mark Stations**: Click on an empty station to place the card number
4. **Complete Lines**:
   - Start with the red line, then blue, then green
   - Lines must be completed in order (can't move to next line until current is done)
5. **Advance**: Click "모두 배치 완료" when all players have placed their card

### Scoring System

Points are awarded based on **ascending sequences**:
- A sequence is 2 or more consecutive stations in ascending order
- Score = (sequence length)²
- Example: A 4-station sequence = 16 points (4²)
- Multiple sequences on the same line are scored separately

**Special Features**:
- 🟡 **Transfer Stations**: When you place a number on a transfer station, it automatically places on the connected line too
- ⭐ **Star Cards**: Wild cards that automatically optimize to the best number for maximum points

### Card Types

- **Number Cards (1-30)**: Place that number on a station
  - 1-10: 1 card each
  - 11-19: 2 cards each
  - 20-30: 1 card each
- ⭐ **Star Cards (3 total)**: Wild cards that optimize automatically

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
streams-metro/
├── src/
│   ├── types/              # TypeScript type definitions
│   ├── game/               # Game logic engine
│   ├── data/               # Game data (lines, cards)
│   ├── store/              # Zustand state management
│   ├── components/         # React components
│   │   ├── Board/          # Game board components
│   │   ├── Cards/          # Card display components
│   │   ├── Score/          # Score display
│   │   └── Controls/       # Game controls
│   └── App.tsx             # Main app component
├── public/
└── dist/                   # Build output
```

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Metro X web game"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the Vite framework
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete deployment

## Features

- ✅ Multi-player game mode (1-4 players)
- ✅ Customizable game setup (lines: 1-3, transfers: 0-3)
- ✅ Interactive SVG-based metro line visualization
- ✅ Real-time score calculation with ascending sequence detection
- ✅ Beautiful gradient UI with card flip animations
- ✅ Transfer station system with auto-synchronization
- ✅ Star card optimization for maximum points
- ✅ Score persistence (localStorage)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Multiple rounds support

## Game Rules

### Scoring

Points are calculated based on **ascending sequences**:
- Each sequence of 2+ consecutive ascending numbers scores (length)²
- Example sequences:
  - `[5, 10, 15]` = 3² = 9 points
  - `[1, 2, 3, 4, 5]` = 5² = 25 points
  - `[10, 20]` + `[22, 25, 30]` = 2² + 3² = 4 + 9 = 13 points

### Strategy Tips

- **Plan ahead**: Higher numbers give more flexibility for sequences
- **Use transfer stations**: Efficiently fill multiple lines at once
- **Save star cards**: Use them to bridge gaps in sequences
- **Sequence length matters**: A 5-station sequence (25 pts) beats two 3-station sequences (9+9=18 pts)
- **Complete lines in order**: Red → Blue → Green

## License

MIT

## Credits

Based on the Metro X board game. This is a fan-made digital implementation for educational purposes.
