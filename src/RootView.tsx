import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Navigations from './navigations';

function RootView(): JSX.Element {
  const [isReady, setIsReady] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <>{isReady && <Navigations />}</>
    </View>
  );
}

export default RootView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
