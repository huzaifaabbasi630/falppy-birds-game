import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PIPE_WIDTH, SCREEN_HEIGHT } from '../utils/constants';

interface PipeProps {
  x: number;
  topHeight: number;
  gap: number;
}

const Pipe: React.FC<PipeProps> = ({ x, topHeight, gap }) => {
  return (
    <>
      {/* Top Pipe */}
      <View
        style={[
          styles.pipe,
          {
            left: x,
            top: 0,
            height: topHeight,
          },
        ]}
      >
        <View style={styles.pipeCap} />
      </View>

      {/* Bottom Pipe */}
      <View
        style={[
          styles.pipe,
          {
            left: x,
            top: topHeight + gap,
            height: SCREEN_HEIGHT - (topHeight + gap),
          },
        ]}
      >
        <View style={[styles.pipeCap, { bottom: undefined, top: 0 }]} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#27ae60',
    zIndex: 1,
  },
  pipeCap: {
    position: 'absolute',
    bottom: 0,
    left: -5,
    width: PIPE_WIDTH + 10,
    height: 25,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#27ae60',
    borderRadius: 5,
  },
});

export default Pipe;
