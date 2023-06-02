import {useStore} from 'zustand';
import {createStore} from 'zustand/vanilla';

interface GlobalStore {
  loadingScreen?: boolean;
}
const globalStore = createStore<GlobalStore>(() => ({
  loadingScreen: false,
}));

const {getState, setState, subscribe} = globalStore;

const useGlobalStore = (selector: (state: GlobalStore) => unknown) =>
  useStore(globalStore, selector);
export {getState, setState, useGlobalStore, subscribe};

export function setLoadingScreen(value: boolean) {
  setState({loadingScreen: value});
}
