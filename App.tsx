/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import {cacheProvider} from 'libs/swr/cacheProvider';
import {ModalProvider} from 'libs/modal';
import {initFocus} from 'libs/swr/config';
import React from 'react';
import 'react-native-gesture-handler';
import RootView from './src/RootView';
import {SWRConfig} from 'swr';
function App(): JSX.Element {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        // provider: cacheProvider, // enable if using persistent cache
        initFocus: initFocus,
      }}>
      <ModalProvider>
        <RootView />
      </ModalProvider>
    </SWRConfig>
  );
}

export default App;
