import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue, interpolate } from 'react-native-reanimated';
import { BIRD_SIZE } from '../utils/constants';

interface BirdProps {
  y: Animated.SharedValue<number>;
  velocity: Animated.SharedValue<number>;
}

const Bird: React.FC<BirdProps> = ({ y, velocity }) => {
  const rotation = useDerivedValue(() => {
    return interpolate(
      velocity.value,
      [-10, 10],
      [-25, 90],
      'clamp'
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: y.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      {/* Visual representation of the bird (yellow circle for now, can be an image) */}
      <Animated.View style={styles.birdBody} />
      <Animated.View style={styles.eye} />
      <Animated.View style={styles.beak} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bird: {
    position: 'absolute',
    left: 50,
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  birdBody: {
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    backgroundColor: '#FFD700',
    borderRadius: BIRD_SIZE / 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  eye: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  beak: {
    position: 'absolute',
    right: -5,
    top: 18,
    width: 15,
    height: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
  }
});

export default Bird;
