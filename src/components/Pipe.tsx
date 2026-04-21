import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { PIPE_WIDTH } from '../utils/physics';

interface PipeProps {
  id?: any;
  key?: any;
  x: Animated.SharedValue<number>;
  topHeight: number;
  gap: number;
  screenHeight: number;
}

export default function Pipe({ x, topHeight, gap, screenHeight }: PipeProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const bottomHeight = screenHeight - topHeight - gap;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Top Pipe */}
      <View style={[styles.pipe, { height: topHeight, borderBottomWidth: 4 }]}>
        <View style={styles.cap} />
      </View>
      
      {/* Target Gap (Invisible but defines the space) */}
      <View style={{ height: gap }} />

      {/* Bottom Pipe */}
      <View style={[styles.pipe, { height: bottomHeight, borderTopWidth: 4 }]}>
         <View style={[styles.cap, { top: 0 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: PIPE_WIDTH,
    height: '100%',
  },
  pipe: {
    width: PIPE_WIDTH,
    backgroundColor: '#2e8b57',
    borderColor: '#000',
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  cap: {
    position: 'absolute',
    bottom: 0,
    left: -5,
    width: PIPE_WIDTH + 10,
    height: 24,
    backgroundColor: '#3cb371',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 4,
  }
});
