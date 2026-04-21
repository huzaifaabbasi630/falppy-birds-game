/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import GameCanvas from './components/GameCanvas';
import { HomeScreen, LevelSelectOverlay, GameOverScreen, LevelUpScreen } from './components/UIComponents';

export default function App() {
  const { gameState, language } = useGameStore();
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);

  // Expose level select to window for the HomeScreen button
  useEffect(() => {
    (window as any).showLevelSelect = () => setIsLevelSelectOpen(true);
  }, []);

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden font-sans ${language === 'ur' ? 'rtl' : 'ltr'}`}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Game Layer */}
      {(gameState === 'playing' || gameState === 'gameover' || gameState === 'level-up') && (
        <GameCanvas />
      )}

      {/* UI Overlay Layer */}
      {gameState === 'home' && <HomeScreen />}
      {gameState === 'gameover' && <GameOverScreen />}
      {gameState === 'level-up' && <LevelUpScreen />}

      {/* Global Modals */}
      <LevelSelectOverlay 
        isOpen={isLevelSelectOpen} 
        onClose={() => setIsLevelSelectOpen(false)} 
      />

      {/* Mobile restriction notice - subtle */}
      <div className="fixed bottom-2 left-0 right-0 text-center pointer-events-none opacity-30 text-[10px] text-gray-400">
        Optimized for mobile view. Press Space or Tap to jump.
      </div>
    </div>
  );
}
