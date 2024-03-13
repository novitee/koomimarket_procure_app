import {create} from 'zustand';

interface GlobalStore {
  loadingScreen?: boolean;
  authMode?: string;
  currentOutlet?: Record<string, any> | null;
  currentChannel?: Record<string, any> | null;
  uploadProgress?: Record<string, number> | null;
  setUploadProgress?: (v: Record<string, number>) => void;
}

const useGlobalStore = create<GlobalStore>(set => ({
  loadingScreen: false,
  authMode: '',
  currentOutlet: null,
  currentChannel: null,
  uploadProgress: null,
  setLoadingScreen: (v: boolean) => set({loadingScreen: v}),
  setUploadProgress: (v: Record<string, number>) =>
    set(prev => ({
      ...prev,
      uploadProgress: {
        ...prev.uploadProgress,
        ...v,
      },
    })),
}));
const setGlobal = useGlobalStore.setState;
export {useGlobalStore, setGlobal};
