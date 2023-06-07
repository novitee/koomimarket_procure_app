import {create} from 'zustand';

interface GlobalStore {
  loadingScreen?: boolean;
  authMode?: string;
}

const useGlobalStore = create<GlobalStore>(set => ({
  loadingScreen: false,
  authMode: '',
  setLoadingScreen: (v: boolean) => set({loadingScreen: v}),
}));
const setGlobal = useGlobalStore.setState;
export {useGlobalStore, setGlobal};
