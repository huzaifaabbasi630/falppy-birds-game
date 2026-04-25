import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import { TRANSLATIONS, getLevelConfig } from '../utils/constants';

export default function GameOver() {
  const router = useRouter();
  const { 
    score, 
    highScore, 
    currentLevel, 
    unlockedLevels,
    language,
    resetGame
  } = useGameStore();

  const t = TRANSLATIONS[language];
  const levelConfig = getLevelConfig(currentLevel);
  const isWin = score >= levelConfig.targetScore;
  const isLevelUnlocked = unlockedLevels > currentLevel;

  const handleRestart = () => {
    resetGame();
    router.replace('/game');
  };

  const handleHome = () => {
    resetGame();
    router.replace('/');
  };

  const handleNextLevel = () => {
    // Note: State logic for currentLevel should ideally be handled before coming here 
    // or by adding a setCurrentLevel call here if the store didn't auto-increment.
    // For now, let's just go home and let the user pick the next level.
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.gameOver}</Text>
        
        <View style={styles.scoreCard}>
          {isWin && (
            <Text style={styles.winText}>LEVEL CLEARED! 🎉</Text>
          )}
          
          <Text style={styles.levelInfo}>{t.level} {currentLevel}</Text>
          
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{t.score}:</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{t.highScore}:</Text>
            <Text style={styles.scoreValue}>{highScore}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isWin && isLevelUnlocked && (
            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextLevel}>
              <Text style={styles.buttonText}>{t.nextLevel}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>{t.restart}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={handleHome}>
            <Text style={styles.buttonText}>{t.home}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
  },
  scoreCard: {
    backgroundColor: '#f1c40f',
    width: '100%',
    padding: 30,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 10,
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  levelInfo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#e67e22',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#27ae60',
  },
  homeButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
