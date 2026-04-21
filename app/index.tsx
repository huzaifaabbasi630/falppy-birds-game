import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, BounceIn } from 'react-native-reanimated';
import { useGameStore, TRANSLATIONS } from '../src/store/useStore';
import { Trophy, Play, Globe, LayoutGrid } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage, highScore, unlockedLevels, setLevel, setGameState } = useGameStore();
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const t = TRANSLATIONS[language];

  const handleStart = () => {
    setGameState('playing');
    router.push('/game');
  };

  const handleSelectLevel = (idx: number) => {
    if (idx < unlockedLevels) {
      setLevel(idx);
      setLevelModalVisible(false);
      handleStart();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
        <Text style={[styles.title, language === 'ur' && styles.urText]}>{t.title}</Text>
        
        <View style={styles.langRow}>
          <TouchableOpacity 
            onPress={() => setLanguage('en')}
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setLanguage('ur')}
            style={[styles.langBtn, language === 'ur' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, language === 'ur' && styles.langTextActive]}>اردو</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={BounceIn.delay(500)} style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Trophy size={20} color="#fce303" />
          <Text style={styles.statLabel}>{t.best}</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.statBox}>
          <LayoutGrid size={20} color="#5A5A40" />
          <Text style={styles.statLabel}>{t.level}</Text>
          <Text style={styles.statValue}>{unlockedLevels}/20</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
        <TouchableOpacity style={styles.playBtn} onPress={handleStart}>
          <Play fill="#000" size={32} />
          <Text style={[styles.playBtnText, language === 'ur' && styles.urText]}>{t.play}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelBtn} onPress={() => setLevelModalVisible(true)}>
          <Text style={styles.levelBtnText}>{t.selectLevel}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={levelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLevelModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectLevel}</Text>
              <TouchableOpacity onPress={() => setLevelModalVisible(false)}>
                <Text style={styles.closeBtn}>{t.back}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={Array.from({ length: 20 })}
              numColumns={4}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => {
                const isUnlocked = index < unlockedLevels;
                return (
                  <TouchableOpacity 
                    style={[styles.levelCard, isUnlocked ? styles.levelUnlocked : styles.levelLocked]}
                    onPress={() => handleSelectLevel(index)}
                    disabled={!isUnlocked}
                  >
                    <Text style={[styles.levelNum, !isUnlocked && styles.levelNumLocked]}>{index + 1}</Text>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.levelGrid}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 60,
    fontWeight: '900',
    color: '#5A5A40',
    textAlign: 'center',
    marginBottom: 20,
  },
  urText: {
    // fontFamily: 'NotoNastaliqUrdu', // Custom font if loaded
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5A5A40',
  },
  langBtnActive: {
    backgroundColor: '#5A5A40',
  },
  langText: {
    color: '#5A5A40',
    fontWeight: 'bold',
  },
  langTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '80%',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#999',
    marginTop: 5,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
  },
  footer: {
    width: '80%',
    gap: 15,
  },
  playBtn: {
    backgroundColor: '#fce303',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#d1b902',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  playBtnText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
  levelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  levelBtnText: {
    fontSize: 16,
    color: '#5A5A40',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
  },
  closeBtn: {
    color: '#5A5A40',
    fontWeight: 'bold',
  },
  levelGrid: {
    paddingBottom: 40,
  },
  levelCard: {
    width: (width - 100) / 4,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUnlocked: {
    backgroundColor: '#fce303',
  },
  levelLocked: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  levelNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  levelNumLocked: {
    color: '#999',
  },
});
