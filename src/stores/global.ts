import {create} from 'zustand';

interface GlobalStore {
  loadingScreen?: boolean;
  authMode?: string;
  currentOutlet?: Record<string, any> | null;
  currentChannel?: Record<string, any> | null;
}

const useGlobalStore = create<GlobalStore>(set => ({
  loadingScreen: false,
  authMode: '',
  currentOutlet: null,
  currentChannel: null,
  setLoadingScreen: (v: boolean) => set({loadingScreen: v}),
}));
const setGlobal = useGlobalStore.setState;
export {useGlobalStore, setGlobal};
