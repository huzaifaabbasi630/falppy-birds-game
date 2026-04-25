import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const BIRD_SIZE = 40;
export const PIPE_WIDTH = 60;
export const PIPE_GAP_MIN = 150;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -10;
export const PIPE_SPEED_BASE = 3.5;

export const getLevelConfig = (level: number) => {
  // Level 1 starts very easy and scales up
  // level 1: speed 3.0, gap 250, target 3
  // level 50: speed 7.5, gap 140, target 100+
  
  const speed = 3.0 + (level - 1) * 0.1; 
  const gap = Math.max(140, 250 - (level - 1) * 2.5); 
  const targetScore = 5 + (level - 1) * 3; // First level 5, then 8, 11...

  return {
    pipeSpeed: speed,
    pipeGap: gap,
    targetScore: targetScore,
  };
};


export const TRANSLATIONS = {
  en: {
    title: 'Sky Bird Adventure',
    start: 'Start Game',
    levels: 'Levels',
    about: 'About',
    restart: 'Restart',
    home: 'Home',
    gameOver: 'Game Over!',
    score: 'Score',
    highScore: 'High Score',
    level: 'Level',
    nextLevel: 'Next Level',
    unlocked: 'Unlocked',
    locked: 'Locked',
    selectLevel: 'Select Level',
    back: 'Back',
  },
  ur: {
    title: 'اسکائی برڈ ایڈونچر',
    start: 'کھیل شروع کریں',
    levels: 'لیولز',
    about: 'بارے میں',
    restart: 'دوبارہ شروع کریں',
    home: 'ہوم',
    gameOver: 'کھیل ختم!',
    score: 'اسکور',
    highScore: 'بہترین اسکور',
    level: 'لیول',
    nextLevel: 'اگلا لیول',
    unlocked: 'کھلا ہوا',
    locked: 'بند',
    selectLevel: 'لیول منتخب کریں',
    back: 'واپس',
  }
};
