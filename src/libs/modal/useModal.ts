import {useCallback} from 'react';
import {ModalInterface, useModalDispatch, useModalState} from './modalContext';
function useModal() {
  const dispatch = useModalDispatch();
  const {isOpen} = useModalState();

  const showModal = useCallback(
    ({title, message, modifiers, onConfirm}: ModalInterface) => {
      dispatch?.({
        type: 'SHOW',
        payload: {
          title,
          message,
          modifiers,
          onConfirm,
        },
      });
    },
    [dispatch],
  );

  const showCustomModal = useCallback(
    ({content}: {content: ModalInterface['ContentComponent']}) => {
      dispatch?.({
        type: 'SHOW_CUSTOM',
        payload: {
          content,
        },
      });
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch?.({
      type: 'CLOSE',
    });
  }, [dispatch]);

  return {
    isOpen,
    showModal,
    showCustomModal,
    closeModal,
  };
}

export default useModal;
