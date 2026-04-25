import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameState {
  score: number;
  highScore: number;
  currentLevel: number;
  unlockedLevels: number;
  language: 'en' | 'ur';
  isGameOver: boolean;
  gameStarted: boolean;
  achievements: string[];
  
  setScore: (score: number) => void;
  incrementScore: () => void;
  setHighScore: (score: number) => void;
  setCurrentLevel: (level: number) => void;
  unlockNextLevel: () => void;
  setLanguage: (lang: 'en' | 'ur') => void;
  setGameOver: (isOver: boolean) => void;
  setGameStarted: (started: boolean) => void;
  addAchievement: (achievement: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      score: 0,
      highScore: 0,
      currentLevel: 1,
      unlockedLevels: 1,
      language: 'en',
      isGameOver: false,
      gameStarted: false,
      achievements: [],

      setScore: (score) => set({ score }),
      incrementScore: () => set((state) => {
        const newScore = state.score + 1;
        const newHighScore = Math.max(state.highScore, newScore);
        
        // Simple achievement check
        const newAchievements = [...state.achievements];
        if (newScore === 10 && !newAchievements.includes('First 10!')) {
          newAchievements.push('First 10!');
        }
        if (newScore === 50 && !newAchievements.includes('Half Century!')) {
          newAchievements.push('Half Century!');
        }

        return { score: newScore, highScore: newHighScore, achievements: newAchievements };
      }),
      setHighScore: (highScore) => set({ highScore }),
      setCurrentLevel: (currentLevel) => set({ currentLevel }),
      unlockNextLevel: () => set((state) => ({ 
        unlockedLevels: Math.max(state.unlockedLevels, state.currentLevel + 1) 
      })),
      setLanguage: (language) => set({ language }),
      setGameOver: (isGameOver) => set({ isGameOver }),
      setGameStarted: (gameStarted) => set({ gameStarted }),
      addAchievement: (achievement) => set((state) => ({
        achievements: state.achievements.includes(achievement) 
          ? state.achievements 
          : [...state.achievements, achievement]
      })),
      resetGame: () => set({ score: 0, isGameOver: false, gameStarted: false }),
    }),
    {
      name: 'flappy-bird-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        highScore: state.highScore, 
        unlockedLevels: state.unlockedLevels, 
        language: state.language,
        achievements: state.achievements
      }),
    }
  )
);
