import React, {useCallback} from 'react';
import Modal from './Modal';
import {ModalInterface, useModalDispatch, useModalState} from './modalContext';

export type ModalContainerChildrenProps = ModalInterface & {
  onClose?: () => void;
};
interface ModalContainerProps extends ModalInterface {
  children: (args: ModalContainerChildrenProps) => React.ReactNode;
}

function ModalContainer({children}: ModalContainerProps) {
  const {isOpen, title, message, modifiers, onConfirm, ContentComponent} =
    useModalState();

  const dispatch = useModalDispatch();

  const onClose = useCallback(() => {
    dispatch?.({
      type: 'CLOSE',
    });
  }, [dispatch]);

  if (ContentComponent) {
    return (
      <Modal visible={isOpen}>
        <ContentComponent onClose={onClose} />
      </Modal>
    );
  }
  return (
    <Modal visible={isOpen}>
      {children({title, message, modifiers, onConfirm, onClose})}
    </Modal>
  );
}

export default ModalContainer;
