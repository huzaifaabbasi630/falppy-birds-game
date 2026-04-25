import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import Bird from './Bird';
import Pipe from './Pipe';
import { useGameStore } from '../store/useGameStore';
import { 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  BIRD_SIZE, 
  PIPE_WIDTH, 
  GRAVITY, 
  JUMP_FORCE, 
  getLevelConfig,
  TRANSLATIONS
} from '../utils/constants';
import { playSound } from '../utils/sounds';

const GameEngine: React.FC = () => {
  const router = useRouter();
  const { 
    score, 
    incrementScore, 
    setGameOver, 
    currentLevel, 
    setCurrentLevel,
    unlockNextLevel, 
    language,
    setGameStarted,
    resetGame
  } = useGameStore();

  const birdY = useSharedValue(SCREEN_HEIGHT / 2);
  const birdVelocity = useSharedValue(0);
  const [pipes, setPipes] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [levelWin, setLevelWin] = useState(false);
  
  const levelConfig = getLevelConfig(currentLevel);
  const requestRef = useRef<number>(0);
  const pipeCount = useRef<number>(0);
  const gameActive = useRef<boolean>(true);
  
  // Use a single truth for pipes to avoid shaking
  const pipesInternal = useRef<any[]>([]);

  const t = TRANSLATIONS[language];

  const spawnPipe = useCallback((isFinish: boolean = false) => {
    // Ensuring pipes have a bit more space and variety
    const minHeight = 100;
    const maxHeight = SCREEN_HEIGHT - levelConfig.pipeGap - 100;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: SCREEN_WIDTH,
      topHeight,
      passed: false,
      isFinish: isFinish
    };
  }, [levelConfig]);

  const onGameOver = useCallback(() => {
    if (!gameActive.current) return;
    gameActive.current = false;
    playSound('hit');
    setGameOver(true);
    setGameStarted(false);
    cancelAnimationFrame(requestRef.current);
    router.push('/game-over');
  }, [router, setGameOver, setGameStarted]);

  const onLevelClear = useCallback(() => {
    if (!gameActive.current) return;
    gameActive.current = false;
    setLevelWin(true);
    playSound('win');
    unlockNextLevel();
    cancelAnimationFrame(requestRef.current);
  }, [unlockNextLevel]);

  const update = useCallback(() => {
    if (!gameActive.current || isPaused || levelWin) return;

    // 1. Physics
    birdVelocity.value += GRAVITY;
    birdY.value += birdVelocity.value;

    if (birdY.value <= 0 || birdY.value >= SCREEN_HEIGHT - BIRD_SIZE) {
      onGameOver();
      return;
    }

    // 2. Pipe Movement & Spawning
    const spawnDistance = Math.max(220, 350 - (currentLevel - 1) * 3);
    const updatedPipes = pipesInternal.current
      .map(p => ({ ...p, x: p.x - levelConfig.pipeSpeed }))
      .filter(p => p.x + PIPE_WIDTH > -50);

    const lastPipe = updatedPipes[updatedPipes.length - 1];
    if ((!lastPipe || SCREEN_WIDTH - lastPipe.x > spawnDistance) && pipeCount.current < levelConfig.targetScore) {
      pipeCount.current += 1;
      // ONLY the absolute last pipe gets isFinish
      const isLastOne = pipeCount.current === levelConfig.targetScore;
      updatedPipes.push(spawnPipe(isLastOne));
    }

    // 3. Collision & Scoring
    let collisionDetected = false;
    let scored = false;
    let finished = false;

    const birdLeft = 50;
    const birdRight = 50 + BIRD_SIZE;
    const birdTop = birdY.value;
    const birdBottom = birdY.value + BIRD_SIZE;

    updatedPipes.forEach(pipe => {
      // Precise collision
      if (birdRight > pipe.x + 5 && birdLeft < pipe.x + PIPE_WIDTH - 5) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + levelConfig.pipeGap) {
          collisionDetected = true;
        }
      }

      // Scoring
      if (!pipe.passed && birdLeft > pipe.x + PIPE_WIDTH) {
        pipe.passed = true;
        scored = true;
        if (pipe.isFinish) finished = true;
      }
    });

    // Update both ref and state
    pipesInternal.current = updatedPipes;
    setPipes(updatedPipes);

    if (collisionDetected) {
      onGameOver();
    } else if (scored) {
      incrementScore();
      playSound('score');
      if (finished) {
        onLevelClear();
      } else {
        requestRef.current = requestAnimationFrame(update);
      }
    } else {
      requestRef.current = requestAnimationFrame(update);
    }
  }, [birdY, birdVelocity, levelConfig, onGameOver, onLevelClear, incrementScore, isPaused, levelWin, spawnPipe, currentLevel]);

  useEffect(() => {
    cancelAnimationFrame(requestRef.current);
    resetGame();
    setGameStarted(true);
    gameActive.current = true;
    pipeCount.current = 0;
    setLevelWin(false);
    setIsPaused(false);
    
    birdY.value = SCREEN_HEIGHT / 2;
    birdVelocity.value = 0;
    pipesInternal.current = [];
    setPipes([]);
    
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [currentLevel]);

  const jump = () => {
    if (isPaused || levelWin || !gameActive.current) return;
    birdVelocity.value = JUMP_FORCE;
    playSound('jump');
  };

  const handleNextLevel = () => {
    cancelAnimationFrame(requestRef.current);
    router.replace('/?view=levels');
  };

  const handleRestart = () => {
    cancelAnimationFrame(requestRef.current);
    setCurrentLevel(currentLevel); // Re-trigger useEffect
    resetGame();
    birdY.value = SCREEN_HEIGHT / 2;
    birdVelocity.value = 0;
    pipesInternal.current = [];
    setPipes([]);
    pipeCount.current = 0;
    setLevelWin(false);
    setIsPaused(false);
    gameActive.current = true;
    requestRef.current = requestAnimationFrame(update);
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <View style={styles.scoreBoard}>
          <Text style={styles.scoreText}>{score} / {levelConfig.targetScore}</Text>
          <Text style={styles.levelText}>{t.level}: {currentLevel}</Text>
        </View>

        {pipes.map((pipe) => (
          <View key={pipe.id}>
            <Pipe x={pipe.x} topHeight={pipe.topHeight} gap={levelConfig.pipeGap} />
            {pipe.isFinish && (
              <View style={[styles.finishTextContainer, { left: pipe.x - 20 }]}>
                <Text style={styles.finishText}>FINISH LINE</Text>
              </View>
            )}
          </View>
        ))}

        <Bird y={birdY} velocity={birdVelocity} />

        {levelWin && (
          <View style={styles.overlay}>
            <Text style={styles.winTitle}>LEVEL COMPLETED! 🎉</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.restartBtn]} onPress={handleRestart}>
                <Text style={styles.btnText}>{t.restart}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.nextBtn]} onPress={handleNextLevel}>
                <Text style={styles.btnText}>{t.nextLevel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!levelWin && (
          <TouchableOpacity style={styles.pauseBtn} onPress={() => setIsPaused(!isPaused)}>
            <Text style={styles.pauseBtnText}>{isPaused ? '▶' : 'II'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#70c5ce' },
  scoreBoard: { position: 'absolute', top: 60, width: '100%', alignItems: 'center', zIndex: 10 },
  scoreText: { fontSize: 36, fontWeight: '900', color: '#fff', textShadowColor: '#000', textShadowRadius: 5 },
  levelText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  finishTextContainer: { position: 'absolute', top: SCREEN_HEIGHT / 2 - 20, width: 140, zIndex: 5 },
  finishText: { fontSize: 18, fontWeight: 'bold', color: '#f1c40f', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, textAlign: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#f1c40f' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  winTitle: { fontSize: 32, fontWeight: '900', color: '#f1c40f', marginBottom: 30, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 20 },
  btn: { paddingHorizontal: 25, paddingVertical: 15, borderRadius: 15, elevation: 5 },
  nextBtn: { backgroundColor: '#27ae60' },
  restartBtn: { backgroundColor: '#e67e22' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  pauseBtn: { position: 'absolute', top: 50, right: 20, width: 45, height: 45, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 25, justifyContent: 'center', alignItems: 'center', zIndex: 11 },
  pauseBtnText: { color: '#fff', fontSize: 22, fontWeight: 'bold' }
});

export default GameEngine;
