import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { BIRD_RADIUS } from '../utils/physics';

interface BirdProps {
  y: Animated.SharedValue<number>;
  rotation: Animated.SharedValue<number>;
}

export default function Bird({ y, rotation }: BirdProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { rotate: `${rotation.value}deg` }
    ] as any,
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: 50, width: BIRD_RADIUS * 2, height: BIRD_RADIUS * 2, top: -BIRD_RADIUS }, animatedStyle]}>
      <Svg width={BIRD_RADIUS * 2} height={BIRD_RADIUS * 2} viewBox="0 0 32 32">
        {/* Body */}
        <Circle cx="16" cy="16" r="14" fill="#fce303" stroke="#000" strokeWidth="2" />
        {/* Eye */}
        <Circle cx="22" cy="12" r="4" fill="#fff" />
        <Circle cx="24" cy="12" r="1.5" fill="#000" />
        {/* Beak */}
        <Path d="M26 16 L31 18 L26 22 Z" fill="#ff8c00" stroke="#000" strokeWidth="1" />
        {/* Wing - simple */}
        <Path d="M8 16 Q12 10 16 16 T20 16" fill="none" stroke="#000" strokeWidth="2" />
      </Svg>
    </Animated.View>
  );
}
