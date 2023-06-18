import ModalContent from 'components/ModalContent';
import React, {createContext, Dispatch, useContext, useReducer} from 'react';
import ModalContainer, {ModalContainerChildrenProps} from './modalContainer';

export interface ModalInterface {
  isOpen?: boolean;
  title?: React.ReactNode | string;
  message?: React.ReactNode | string;
  modifiers?: {
    type?: 'confirm' | 'info';
    confirmTitle?: string;
    cancelTitle?: string;
  };
  ContentComponent?: React.ElementType | null;
  onConfirm?: (args?: any) => void | undefined | Promise<void>;
}

interface ActionProps {
  payload?: any;
  type: string;
}

export const initialState: ModalInterface = {
  isOpen: false,
  title: '',
  message: '',
  modifiers: {},
  ContentComponent: null,
  onConfirm: undefined,
};

const ModalStateContext = createContext<ModalInterface>(initialState);
const ModalDispatchContext = createContext<Dispatch<ActionProps> | null>(null);

export function useModalState(): ModalInterface {
  const context = useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error('useModalState must be used within a ModalProvider');
  }

  return context;
}

export function useModalDispatch() {
  const context = useContext(ModalDispatchContext);
  if (context === undefined) {
    throw new Error('useModalDispatch must be used within a ModalProvider');
  }

  return context;
}

export const ModalReducer = (
  state: ModalInterface,
  action: ActionProps,
): ModalInterface => {
  const {payload} = action;

  switch (action.type) {
    case 'SHOW':
      return {
        ...state,
        isOpen: true,
        title: payload.title,
        message: payload.message,
        modifiers: payload.modifiers,
        onConfirm: payload.onConfirm,
      };
    case 'SHOW_CUSTOM':
      return {
        ...state,
        isOpen: true,
        ContentComponent: payload.content,
      };
    case 'OPEN':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const ModalProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(ModalReducer, initialState);

  return (
    <ModalStateContext.Provider value={state}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
        <ModalContainer>
          {(props: ModalContainerChildrenProps) => <ModalContent {...props} />}
        </ModalContainer>
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};
