import colors from 'configs/colors';
import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Loading({
  mode = 'fullscreen',
}: {
  mode?: 'fullscreen' | 'stretch';
}) {
  return (
    <View
      style={[
        styles.container,
        mode === 'fullscreen' && styles.fullscreen,
        mode === 'stretch' && styles.stretch,
      ]}>
      <ActivityIndicator size={'large'} color={colors.primary.DEFAULT} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 100,
  },
  fullscreen: {
    width: windowWidth,
    height: windowHeight,
  },
  stretch: {
    width: '100%',
    height: '100%',
  },
});
