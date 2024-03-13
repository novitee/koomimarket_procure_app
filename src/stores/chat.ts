import {IMessageItem} from 'screens/Chat/type';
import {create} from 'zustand';

interface ChatStore {
  localMessages: IMessageItem[];
  addLocalMessage: (v: IMessageItem) => void;
  setLocalMessages: (v: IMessageItem[]) => void;
  resetLocalMessages: () => void;
}

const useChatStore = create<ChatStore>(set => ({
  localMessages: [],
  addLocalMessage: (v: IMessageItem) =>
    set(prev => ({
      localMessages: [...(prev.localMessages || []), v],
    })),
  resetLocalMessages: () => set({localMessages: []}),
  setLocalMessages: (v: IMessageItem[]) => set({localMessages: v}),
}));
const setChat = useChatStore.setState;
const getChat = useChatStore.getState;
export {useChatStore, setChat, getChat};
