import {View, StyleSheet} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import colors from 'configs/colors';

interface ProgressBarProps {
  total: number;
  step: number;
  tag: string;
}

export default function ProgressBar({total, step, tag}: ProgressBarProps) {
  const percentage = (step * 100) / total;

  return (
    <View className="w-full h-1">
      <Animated.View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.animatedView,
          width: `${percentage}%`,
        }}
        sharedTransitionTag={tag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    height: 4,
    backgroundColor: colors.primary.DEFAULT,
  },
});
