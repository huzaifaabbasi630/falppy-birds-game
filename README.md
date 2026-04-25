# Flappy Bird: Level Up Edition

Complete Flappy Bird clone with 50 levels of increasing difficulty, built with React Native (Expo), Expo Router, and Reanimated.

## Features
- **50 Levels**: Difficulty increases every level (higher pipe speed, smaller gaps).
- **Localization**: Full support for English and Urdu.
- **State Management**: Persistent high score, unlocked levels, and achievements using Zustand and AsyncStorage.
- **Physics Engine**: Custom 60 FPS game loop using `requestAnimationFrame`.
- **Responsive UI**: Works on all screen sizes.
- **Animations**: Smooth bird rotation and pipe movement using Reanimated 4.

## Tech Stack
- **Framework**: Expo (SDK 54)
- **Routing**: Expo Router
- **Animations**: React Native Reanimated
- **State**: Zustand
- **Persistence**: AsyncStorage
- **Sound**: Expo AV

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add Sounds (Optional)**:
   Place your sound files in `assets/sounds/`:
   - `jump.mp3`
   - `hit.mp3`
   - `score.mp3`

3. **Start the project**:
   ```bash
   npx expo start
   ```

## Folder Structure
- `/app`: Expo Router screens (Home, Game, Game Over)
- `/components`: Game components (Bird, Pipe, GameEngine)
- `/store`: Zustand state management
- `/utils`: Physics logic, constants, and translations
- `/assets`: Images and sounds

## Level Difficulty Formula
- **Pipe Speed**: Starts at 3.5 and increases by 0.08 per level.
- **Pipe Gap**: Starts at 200 and decreases by 1.5 per level (minimum 130).
- **Target Score**: Each level has a target score to unlock the next level.
