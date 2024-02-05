import Modal from 'libs/modal/Modal';
import ModalContent from 'components/ModalContent';

export default function RemoveConfirm({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={isOpen}>
      <ModalContent
        title=""
        message="Are you sure you want to remove this item?"
        modifiers={{
          type: 'confirm',
          confirmTitle: 'Sure',
        }}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </Modal>
  );
}
