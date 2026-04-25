import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import { TRANSLATIONS } from '../utils/constants';

type MenuView = 'main' | 'levels' | 'about';

export default function Home() {
  const router = useRouter();
  const { view } = useLocalSearchParams<{ view: MenuView }>();
  const [currentView, setCurrentView] = useState<MenuView>(view || 'main');
  
  const { 
    highScore, 
    unlockedLevels, 
    currentLevel, 
    setCurrentLevel, 
    language, 
    setLanguage,
    achievements
  } = useGameStore();

  const t = TRANSLATIONS[language];
  const levels = Array.from({ length: 50 }, (_, i) => i + 1);

  const startLevel = (level: number) => {
    if (level <= unlockedLevels) {
      setCurrentLevel(level);
      router.push('/game');
    }
  };

  const renderMainMenu = () => (
    <View style={styles.menuContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.bigLogo}
          contentFit="contain"
        />
        <Text style={styles.mainTitle}>{t.title}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t.highScore}</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t.level}</Text>
          <Text style={styles.statValue}>{unlockedLevels}/50</Text>
        </View>
      </View>

      <View style={styles.buttonList}>
        <TouchableOpacity style={styles.mainButton} onPress={() => startLevel(unlockedLevels)}>
          <Text style={styles.mainButtonText}>🚀 {t.start}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={() => setCurrentView('levels')}>
          <Text style={styles.mainButtonText}>🎮 {t.levels}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={() => setCurrentView('about')}>
          <Text style={styles.mainButtonText}>ℹ️ {t.about}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLevelsView = () => (
    <View style={styles.viewContainer}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.backButton}>
          <Text style={styles.backText}>⬅ {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>{t.selectLevel}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.levelGrid}>
        {levels.map((level) => {
          const isUnlocked = level <= unlockedLevels;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                !isUnlocked && styles.levelLocked,
                level === currentLevel && styles.levelCurrent
              ]}
              onPress={() => startLevel(level)}
              disabled={!isUnlocked}
            >
              <Text style={[styles.levelText, !isUnlocked && styles.levelTextLocked]}>
                {level}
              </Text>
              {!isUnlocked && (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderAboutView = () => (
    <View style={styles.viewContainer}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.backButton}>
          <Text style={styles.backText}>⬅ {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.viewTitle}>{t.about}</Text>
      </View>

      <ScrollView style={styles.aboutContent}>
        <View style={styles.aboutCard}>
          <View style={styles.aboutLogoContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logoSmall} />
            <Text style={styles.aboutTitle}>Sky Bird Adventure</Text>
          </View>
          
          <Text style={styles.aboutText}>Version: 1.0.0</Text>
          <Text style={styles.aboutText}>Developed by: Hafiz Huzaifa</Text>
          
          <Text style={styles.sectionHeading}>About the Game</Text>
          <Text style={styles.description}>
            Sky Bird Adventure is a 2D arcade game where players control a bird and navigate 
            through challenging obstacles. Each level increases in difficulty, 
            testing the player's reflexes and timing.
          </Text>

          <Text style={styles.sectionHeading}>Technologies Used</Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>• React Native (Expo)</Text>
            <Text style={styles.techItem}>• Expo Router (Navigation)</Text>
            <Text style={styles.techItem}>• Reanimated 4 (Physics engine)</Text>
            <Text style={styles.techItem}>• Zustand (State Management)</Text>
            <Text style={styles.techItem}>• Expo AV (Sound System)</Text>
          </View>

          <Text style={styles.sectionHeading}>Credits</Text>
          <Text style={styles.description}>Icon generation: Gemini AI</Text>
          <Text style={styles.description}>Assets & Sounds: Free open-source resources</Text>

          <Text style={styles.thankYou}>Thank you for playing and supporting ❤️</Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.langToggle}
          onPress={() => setLanguage(language === 'en' ? 'ur' : 'en')}
        >
          <Text style={styles.langText}>{language === 'en' ? 'اردو' : 'English'}</Text>
        </TouchableOpacity>
      </View>

      {achievements.length > 0 && currentView === 'main' && (
        <View style={styles.achievementsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((ach, i) => (
              <View key={i} style={styles.achievementBadge}>
                <Text style={styles.achievementText}>🏆 {ach}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {currentView === 'main' && renderMainMenu()}
      {currentView === 'levels' && renderLevelsView()}
      {currentView === 'about' && renderAboutView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    marginTop: 20,
  },
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bigLogo: {
    width: 150,
    height: 150,
    borderRadius: 30,
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: '45%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  buttonList: {
    width: '100%',
    gap: 15,
  },
  mainButton: {
    backgroundColor: '#ffa500',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  viewTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  levelButton: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  levelLocked: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  levelCurrent: {
    backgroundColor: '#f1c40f',
    borderWidth: 3,
    borderColor: '#fff',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  levelTextLocked: {
    color: '#7f8c8d',
  },
  lockIcon: {
    fontSize: 10,
  },
  langToggle: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    color: '#fff',
    fontWeight: '600',
  },
  achievementsContainer: {
    height: 40,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  achievementBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
  },
  achievementText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  aboutContent: {
    flex: 1,
  },
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 40,
  },
  aboutLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  logoSmall: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  aboutText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  techList: {
    marginVertical: 10,
  },
  techItem: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  thankYou: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  }
});
