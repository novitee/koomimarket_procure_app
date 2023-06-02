import {AppState, AppStateStatus} from 'react-native';

export const initFocus = (callback: () => void) => {
  let appState = AppState.currentState;

  const onAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      callback();
    }
    appState = nextAppState;
  };
  const subscription = AppState.addEventListener('change', onAppStateChange);

  return () => {
    subscription.remove();
  };
};
