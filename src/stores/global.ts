import {create} from 'zustand';

interface GlobalStore {
  loadingScreen?: boolean;
  authMode?: string;
  currentOutlet?: Record<string, any> | null;
  currentSupplier?: Record<string, any> | null;
}

const useGlobalStore = create<GlobalStore>(set => ({
  loadingScreen: false,
  authMode: '',
  currentOutlet: null,
  currentSupplier: null,
  setLoadingScreen: (v: boolean) => set({loadingScreen: v}),
}));
const setGlobal = useGlobalStore.setState;
export {useGlobalStore, setGlobal};
