import { motion } from 'motion/react';
import { useGameStore, TRANSLATIONS, Language } from '../store/gameStore';
import { Trophy, Play, Home, RotateCcw, ChevronRight, Globe, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const SPRING = { type: 'spring', stiffness: 400, damping: 25 };

export function HomeScreen() {
  const { setGameState, highScore, language, setLanguage, unlockedLevels } = useGameStore();
  const t = TRANSLATIONS[language];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full bg-[#f5f5f0] p-8 text-[#5A5A40]"
    >
      <motion.h1 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-6xl font-black mb-2 tracking-tight text-[#5A5A40]"
      >
        {t.title}
      </motion.h1>
      
      <div className="flex gap-4 mb-12">
        <button 
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] border border-[#5A5A40]'}`}
        >
          <Globe size={14} /> English
        </button>
        <button 
          onClick={() => setLanguage('ur')}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ur' ? 'bg-[#5A5A40] text-white' : 'bg-white text-[#5A5A40] border border-[#5A5A40]'}`}
        >
          <Globe size={14} /> اردو
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGameState('playing')}
          className="flex items-center justify-center gap-3 bg-[#fce303] text-gray-900 text-2xl font-black py-4 rounded-3xl shadow-[0_8px_0_#d1b902] active:shadow-none active:translate-y-[8px] transition-all"
        >
          <Play fill="currentColor" /> {t.play}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window as any).showLevelSelect()}
          className="bg-white border-2 border-[#5A5A40] text-[#5A5A40] text-xl font-bold py-3 rounded-2xl"
        >
          {t.selectLevel}
        </motion.button>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[#5A5A40]/60 uppercase tracking-widest text-xs font-bold">
          <Trophy size={14} /> {t.highScore}
        </div>
        <div className="text-3xl font-black">{highScore}</div>
      </div>

      <div className="mt-8 flex gap-4">
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[#5A5A40]/40">Unlocked</span>
            <span className="text-xl font-bold">{unlockedLevels}/20</span>
        </div>
        <div className="flex gap-2">
            <motion.div 
               animate={{ opacity: unlockedLevels >= 2 ? 1 : 0.2 }}
               className="p-2 bg-yellow-400 rounded-lg shadow-sm"
               title={t.pioneer}
            >
               <Award size={20} className="text-yellow-900" />
            </motion.div>
            <motion.div 
               animate={{ opacity: unlockedLevels >= 10 ? 1 : 0.2 }}
               className="p-2 bg-blue-400 rounded-lg shadow-sm"
               title={t.expert}
            >
               <Award size={20} className="text-blue-900" />
            </motion.div>
            <motion.div 
               animate={{ opacity: unlockedLevels >= 20 ? 1 : 0.2 }}
               className="p-2 bg-purple-400 rounded-lg shadow-sm"
               title={t.master}
            >
               <Award size={20} className="text-purple-900" />
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function LevelSelectOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { unlockedLevels, setLevel, setGameState, language } = useGameStore();
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-md z-[100] p-8 overflow-y-auto"
    >
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#5A5A40]">{t.selectLevel}</h2>
          <button onClick={onClose} className="p-2 bg-[#5A5A40]/10 rounded-full text-[#5A5A40] font-bold">
            {t.back}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 20 }).map((_, i) => {
            const isUnlocked = i < unlockedLevels;
            return (
              <motion.button
                key={i}
                whileHover={isUnlocked ? { scale: 1.1 } : {}}
                whileTap={isUnlocked ? { scale: 0.9 } : {}}
                onClick={() => {
                  if (isUnlocked) {
                    setLevel(i);
                    setGameState('playing');
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                  isUnlocked 
                    ? 'bg-[#fce303] shadow-[0_4px_0_#d1b902] text-gray-900 border-2 border-transparent' 
                    : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                }`}
              >
                {i + 1}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function GameOverScreen() {
  const { score, highScore, setGameState, language } = useGameStore();
  const t = TRANSLATIONS[language];

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-[200]"
    >
      <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-8 shadow-2xl overflow-hidden relative">
        <div className="space-y-2">
            <h2 className="text-4xl font-black text-red-500 uppercase italic tracking-tighter">{t.gameOver}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Better luck next time!</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t.score}</div>
            <div className="text-4xl font-black text-gray-800">{score}</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-200">
            <div className="text-[10px] uppercase font-bold text-yellow-600 mb-1">{t.highScore}</div>
            <div className="text-4xl font-black text-yellow-700">{highScore}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setGameState('playing')}
            className="w-full bg-[#fce303] text-gray-900 font-black py-4 rounded-2xl shadow-[0_6px_0_#d1b902] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={20} /> {t.restart}
          </button>
          
          <button
            onClick={() => setGameState('home')}
            className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            <Home size={20} /> {t.home}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function LevelUpScreen() {
  const { currentLevel, setLevel, setGameState, language } = useGameStore();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fce303', '#5A5A40', '#ffffff']
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center p-6 z-[200]"
    >
      <div className="text-center space-y-8">
        <motion.div
           animate={{ rotate: [0, -10, 10, -10, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="inline-block"
        >
          <Award size={120} className="text-yellow-400 mx-auto" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-[#5A5A40]">LEVEL {currentLevel + 1} COMPLETE!</h2>
          <p className="text-[#5A5A40]/60 font-medium">You're getting good at this!</p>
        </div>

        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <button
            onClick={() => {
              setLevel(currentLevel + 1);
              setGameState('playing');
            }}
            className="w-full bg-[#5A5A40] text-white font-black py-5 rounded-3xl shadow-[0_8px_0_#2d2d20] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3 text-xl"
          >
            {t.nextLevel} <ChevronRight />
          </button>
          
          <button
            onClick={() => setGameState('home')}
            className="w-full text-[#5A5A40] font-bold py-3"
          >
            {t.home}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
