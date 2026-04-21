import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useFrameCallback, 
  useAnimatedStyle, 
  runOnJS,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { useGameStore, LEVELS, TRANSLATIONS } from '../src/store/useStore';
import { BIRD_X, BIRD_RADIUS, PIPE_WIDTH, checkCollision } from '../src/utils/physics';
import Bird from '../src/components/Bird';
import Pipe from '../src/components/Pipe';
import { Audio } from 'expo-av';
import { X, Pause, Play, RotateCcw, Home, Award } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GRAVITY = 0.25;
const JUMP_FORCE = -6;

export default function GameScreen() {
  const router = useRouter();
  const { 
    gameState, setGameState, 
    score, incrementScore, resetScore,
    currentLevel, completeLevel, 
    language, highScore
  } = useGameStore();
  
  const t = TRANSLATIONS[language];
  const config = LEVELS[currentLevel];

  // Game Values
  const birdY = useSharedValue(SCREEN_HEIGHT / 2);
  const birdVelocity = useSharedValue(0);
  const birdRotation = useSharedValue(0);
  const [pipes, setPipes] = useState<any[]>([]);
  const pipeXValues = useRef<Animated.SharedValue<number>[]>([]);
  const frameCount = useRef(0);
  const pipesPassed = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sound effects
  const sounds = useRef<any>({});

  useEffect(() => {
    async function loadSounds() {
      // In a real app, you'd load actual assets. Here we use platform-ready refs.
      // const { sound: jump } = await Audio.Sound.createAsync(require('./assets/jump.mp3'));
      // sounds.current.jump = jump;
    }
    loadSounds();
  }, []);

  const playSound = async (type: 'jump' | 'score' | 'hit') => {
    // console.log(`Play sound: ${type}`);
  };

  const onGameOver = useCallback(() => {
    setGameState('gameover');
    playSound('hit');
  }, [setGameState]);

  const onLevelComplete = useCallback(() => {
    completeLevel();
  }, [completeLevel]);

  const onScore = useCallback(() => {
    incrementScore();
    pipesPassed.current += 1;
    playSound('score');
    if (pipesPassed.current >= config.pipesToWin) {
      onLevelComplete();
    }
  }, [incrementScore, config.pipesToWin, onLevelComplete]);

  // Main Loop
  useFrameCallback((frameInfo) => {
    if (gameState !== 'playing' || isPaused) return;

    // Bird Physics
    birdVelocity.value += GRAVITY;
    birdY.value += birdVelocity.value;
    birdRotation.value = Math.min(45, Math.max(-45, birdVelocity.value * 5));

    // Collision with Floors
    if (birdY.value < 0 || birdY.value > SCREEN_HEIGHT) {
      runOnJS(onGameOver)();
    }

    // Pipe Management
    frameCount.current += 1;
    if (frameCount.current % Math.floor(config.pipeFrequency) === 0) {
      const topHeight = Math.random() * (SCREEN_HEIGHT - config.gapSize - 200) + 100;
      runOnJS(setPipes)((prev) => [...prev, { id: Date.now(), topHeight, passed: false }]);
      const sharedX = useSharedValue(SCREEN_WIDTH);
      pipeXValues.current.push(sharedX);
    }

    // Move Pipes & Check Collision
    const birdBox = {
      left: BIRD_X - BIRD_RADIUS + 5,
      right: BIRD_X + BIRD_RADIUS - 5,
      top: birdY.value - BIRD_RADIUS + 5,
      bottom: birdY.value + BIRD_RADIUS - 5,
    };

    pipeXValues.current.forEach((xVal, index) => {
      xVal.value -= config.speed;

      const pipe = pipes[index];
      if (pipe) {
        const topPipeBox = { left: xVal.value, right: xVal.value + PIPE_WIDTH, top: 0, bottom: pipe.topHeight };
        const bottomPipeBox = { left: xVal.value, right: xVal.value + PIPE_WIDTH, top: pipe.topHeight + config.gapSize, bottom: SCREEN_HEIGHT };

        if (checkCollision(birdBox, topPipeBox) || checkCollision(birdBox, bottomPipeBox)) {
          runOnJS(onGameOver)();
        }

        if (!pipe.passed && xVal.value + PIPE_WIDTH < BIRD_X) {
          pipe.passed = true;
          runOnJS(onScore)();
        }
      }
    });

    // Cleanup offscreen pipes
    if (pipeXValues.current.length > 0 && pipeXValues.current[0].value < -PIPE_WIDTH) {
      pipeXValues.current.shift();
      runOnJS(setPipes)((prev) => prev.slice(1));
    }
  });

  const handleJump = () => {
    if (gameState === 'playing' && !isPaused) {
      birdVelocity.value = JUMP_FORCE;
      playSound('jump');
    }
  };

  const handleRestart = () => {
    birdY.value = SCREEN_HEIGHT / 2;
    birdVelocity.value = 0;
    pipeXValues.current = [];
    setPipes([]);
    resetScore();
    pipesPassed.current = 0;
    frameCount.current = 0;
    setGameState('playing');
  };

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        {/* Sky Background */}
        <View style={styles.sky} />

        {/* Level & Score HUD */}
        <View style={styles.hud}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{t.level} {currentLevel + 1}</Text>
          </View>
          <Text style={styles.scoreText}>{score}</Text>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)} style={styles.pauseBtn}>
            {isPaused ? <Play color="#fff" size={24} /> : <Pause color="#fff" size={24} />}
          </TouchableOpacity>
        </View>

        {/* Game Entities */}
        {pipes.map((pipe, index) => (
          <Pipe 
            key={pipe.id} 
            x={pipeXValues.current[index]} 
            topHeight={pipe.topHeight} 
            gap={config.gapSize} 
            screenHeight={SCREEN_HEIGHT} 
          />
        ))}

        <Bird y={birdY} rotation={birdRotation} />

        {/* Start Hint */}
        {score === 0 && gameState === 'playing' && (
           <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{t.tapToJump}</Text>
           </View>
        )}

        {/* Modals */}
        {gameState === 'gameover' && (
           <View style={styles.overlay}>
              <Animated.View entering={withSpring} style={styles.card}>
                 <Text style={styles.overTitle}>{t.gameOver}</Text>
                 <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                       <Text style={styles.statItemLabel}>{t.score}</Text>
                       <Text style={styles.statItemValue}>{score}</Text>
                    </View>
                    <View style={styles.statItem}>
                       <Text style={styles.statItemLabel}>{t.best}</Text>
                       <Text style={styles.statItemValue}>{highScore}</Text>
                    </View>
                 </View>
                 <TouchableOpacity style={styles.actionBtn} onPress={handleRestart}>
                    <RotateCcw color="#000" />
                    <Text style={styles.actionBtnText}>{t.restart}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
                    <Home color="#5A5A40" size={18} />
                    <Text style={styles.homeBtnText}>{t.home}</Text>
                 </TouchableOpacity>
              </Animated.View>
           </View>
        )}

        {gameState === 'level-up' && (
           <View style={[styles.overlay, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
              <View style={styles.levelUpContent}>
                 <Award size={80} color="#fce303" />
                 <Text style={styles.levelUpTitle}>Level {currentLevel + 1} Done!</Text>
                 <TouchableOpacity style={styles.nextBtn} onPress={handleRestart}>
                    <Text style={styles.nextBtnText}>{t.nextLevel}</Text>
                 </TouchableOpacity>
              </View>
           </View>
        )}

        {isPaused && (
           <View style={styles.overlay}>
              <View style={styles.card}>
                 <Text style={styles.overTitle}>Paused</Text>
                 <TouchableOpacity style={styles.actionBtn} onPress={() => setIsPaused(false)}>
                    <Play color="#000" />
                    <Text style={styles.actionBtnText}>Resume</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
                    <Text style={styles.homeBtnText}>Quit Game</Text>
                 </TouchableOpacity>
              </View>
           </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98e0e0',
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#70c5ce',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 10,
  },
  levelBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  pauseBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 30,
  },
  hintContainer: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 30,
    borderRadius: 40,
    alignItems: 'center',
    gap: 20,
  },
  overTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ff4444',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  statItemLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
  },
  statItemValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
  },
  actionBtn: {
    backgroundColor: '#fce303',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#d1b902',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  actionBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  homeBtnText: {
    color: '#5A5A40',
    fontWeight: 'bold',
  },
  levelUpContent: {
    alignItems: 'center',
    gap: 20,
  },
  levelUpTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#5A5A40',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#5A5A40',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
