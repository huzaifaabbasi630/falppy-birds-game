import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import GameEngine from '../components/GameEngine';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <GameEngine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
