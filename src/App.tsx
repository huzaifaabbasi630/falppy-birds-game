/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '../app/index';
import GameScreen from '../app/game';
import { useGameStore } from './store/useStore';

// In the browser preview, we'll use local state routing
export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  
  useEffect(() => {
    (window as any).onNavigate = (path: string) => setCurrentPath(path);
  }, []);
  
  const renderScreen = () => {
    switch (currentPath) {
      case '/':
        return <HomeScreen />;
      case '/game':
        return <GameScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
