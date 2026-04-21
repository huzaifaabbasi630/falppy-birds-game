import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameState = 'home' | 'playing' | 'gameover' | 'level-up';
export type Language = 'en' | 'ur';

interface LevelConfig {
  speed: number;
  gapSize: number;
  pipeFrequency: number;
  pipesToWin: number;
}

export const LEVELS: LevelConfig[] = Array.from({ length: 20 }, (_, i) => ({
  speed: 3 + i * 0.3, 
  gapSize: 200 - i * 5, 
  pipeFrequency: 140 - i * 4, 
  pipesToWin: 5 + Math.floor(i / 2) * 5, 
}));

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  currentLevel: number;
  unlockedLevels: number;
  language: Language;
  
  setGameState: (state: GameState) => void;
  incrementScore: () => void;
  resetScore: () => void;
  setLevel: (level: number) => void;
  setLanguage: (lang: Language) => void;
  completeLevel: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      gameState: 'home',
      score: 0,
      highScore: 0,
      currentLevel: 0,
      unlockedLevels: 1,
      language: 'en',

      setGameState: (state) => set({ gameState: state }),
      incrementScore: () => set((state) => {
        const nextScore = state.score + 1;
        return {
          score: nextScore,
          highScore: Math.max(state.highScore, nextScore),
        };
      }),
      resetScore: () => set({ score: 0 }),
      setLevel: (level) => set({ currentLevel: level }),
      setLanguage: (lang) => set({ language: lang }),
      completeLevel: () => set((state) => {
        const nextLevel = state.currentLevel + 1;
        const newUnlocked = Math.max(state.unlockedLevels, nextLevel + 1);
        return {
          unlockedLevels: newUnlocked,
          gameState: 'level-up',
        };
      }),
    }),
    {
      name: 'sky-dash-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        highScore: state.highScore, 
        unlockedLevels: state.unlockedLevels,
        language: state.language 
      }),
    }
  )
);

export const TRANSLATIONS = {
  en: {
    title: 'Sky Dash',
    play: 'Start Game',
    gameOver: 'Game Over!',
    score: 'Score',
    highScore: 'High Score',
    restart: 'Restart Level',
    home: 'Home',
    nextLevel: 'Next Level',
    level: 'Level',
    selectLevel: 'Select Level',
    back: 'Back',
    best: 'Best',
    tapToJump: 'Tap to Jump',
  },
  ur: {
    title: 'آسمانی اڑان',
    play: 'کھیل شروع کریں',
    gameOver: 'کھیل ختم!',
    score: 'اسکور',
    highScore: 'سب سے زیادہ اسکور',
    restart: 'پھر سے کھیلیں',
    home: 'ہوم',
    nextLevel: 'اگلا لیول',
    level: 'لیول',
    selectLevel: 'لیول منتخب کریں',
    back: 'واپس',
    best: 'بہترین',
    tapToJump: 'کودنے کے لیے دبائیں',
  }
};
