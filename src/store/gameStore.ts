import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameState = 'home' | 'playing' | 'gameover' | 'level-up';
export type Language = 'en' | 'ur';

interface LevelConfig {
  speed: number;
  gapSize: number;
  pipeFrequency: number;
  pipesToWin: number;
}

export const LEVELS: LevelConfig[] = Array.from({ length: 20 }, (_, i) => ({
  speed: 2.5 + i * 0.25, // Starts at 2.5, increases by 0.25 per level
  gapSize: 180 - i * 4, // Starts at 180, decreases by 4 per level
  pipeFrequency: 140 - i * 3, // Frames between pipes
  pipesToWin: 10 + Math.floor(i / 2) * 5, // 10, 10, 15, 15, 20, 20...
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
        return {
          unlockedLevels: Math.max(state.unlockedLevels, nextLevel + 1),
          gameState: 'level-up',
        };
      }),
    }),
    {
      name: 'sky-dash-storage',
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
    resume: 'Resume',
    pause: 'Pause',
    gameOver: 'Game Over!',
    score: 'Score',
    highScore: 'High Score',
    restart: 'Restart Level',
    home: 'Home',
    nextLevel: 'Next Level',
    level: 'Level',
    selectLevel: 'Select Level',
    achievements: 'Achievements',
    pioneer: 'Pioneer',
    pioneerDesc: 'Complete Level 1',
    expert: 'Expert',
    expertDesc: 'Reach Level 10',
    master: 'Master',
    masterDesc: 'Complete all levels',
    back: 'Back',
  },
  ur: {
    title: 'آسمانی اڑان',
    play: 'کھیل شروع کریں',
    resume: 'دوبارہ شروع',
    pause: 'روک دیں',
    gameOver: 'کھیل ختم!',
    score: 'اسکور',
    highScore: 'سب سے زیادہ اسکور',
    restart: 'پھر سے کھیلیں',
    home: 'ہوم',
    nextLevel: 'اگلا لیول',
    level: 'لیول',
    selectLevel: 'لیول منتخب کریں',
    achievements: 'کامیابیاں',
    pioneer: 'آغاز کرنے والا',
    pioneerDesc: 'لیول 1 مکمل کریں',
    expert: 'ماہر',
    expertDesc: 'لیول 10 پر پہنچیں',
    master: 'استاد',
    masterDesc: 'تمام لیولز مکمل کریں',
    back: 'واپس',
  }
};
