import {MMKV} from 'react-native-mmkv';
import {useStore} from 'zustand';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import {createStore, StoreApi} from 'zustand/vanilla';

const mmkv = new MMKV();
const storage: StateStorage = {
  getItem: (name: string) => {
    return mmkv.getString(name) || null;
  },
  setItem: (name: string, value: any) => {
    mmkv.set(name, value);
  },
  removeItem: (name: string) => {
    if (typeof name === 'string' && mmkv.contains(name)) {
      mmkv.delete(name);
    }
  },
};
export interface IAppStore {
  authToken?: string;
  authRefreshToken?: string;
  isFirstLoad?: boolean;
  authRegisterType?: 'BUYER' | 'SUPPLIER' | '';
  authStatus:
    | 'NOT_AUTH'
    | 'AUTH_COMPLETED'
    | 'REGISTERING'
    | 'BUYER_COMPLETED'
    | 'SUPPLIER_COMPLETED';
}
const appStore = createStore<IAppStore>()(
  persist(
    (_set, _get) => ({
      authToken: '',
      authRefreshToken: '',
      isFirstLoad: true,
      authStatus: 'NOT_AUTH',
      authRegisterType: '',
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
);
const {getState, setState, subscribe} = appStore;
const createBoundedUseStore = (store => (selector, equals) =>
  useStore(store, selector as never, equals)) as <S extends StoreApi<unknown>>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(
    selector: (state: ExtractState<S>) => T,
    equals?: (a: T, b: T) => boolean,
  ): T;
};

type ExtractState<S> = S extends {getState: () => infer X} ? X : never;
const useAppStore = createBoundedUseStore(appStore);

export {getState, setState, useAppStore, subscribe};
