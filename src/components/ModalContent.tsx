import {ModalContainerChildrenProps} from 'libs/modal/modalContainer';
import React, {useState} from 'react';
import {View} from 'react-native';
import Button from './Button';
import Text from './Text';

export default function ModalContent({
  title,
  message,
  onClose,
  onConfirm,
  modifiers,
}: ModalContainerChildrenProps) {
  const {type, confirmTitle, cancelTitle} = modifiers || {};
  const [loading, setLoading] = useState(false);

  function renderConfirmButton() {
    return (
      <>
        <Button
          size="md"
          variant="outline"
          onPress={onClose}
          className="flex-1">
          {cancelTitle || 'Cancel'}
        </Button>
        <Button
          size="md"
          className="flex-1 ml-4"
          loading={loading}
          onPress={() => {
            setLoading(true);
            onConfirm?.();
          }}>
          {confirmTitle || 'Confirm'}
        </Button>
      </>
    );
  }

  function renderInfoButton() {
    return (
      <Button size="md" className="w-full" onPress={onConfirm || onClose}>
        {confirmTitle || 'OK'}
      </Button>
    );
  }
  function renderMessage() {
    if (typeof message === 'string') {
      return <Text className="text-center font-medium">{message}</Text>;
    } else {
      return message;
    }
  }
  return (
    <View className="w-4/5 bg-white rounded-lg shadow-xl p-5">
      {title && (
        <View className="">
          {typeof title === 'string' ? (
            <Text className="font-bold text-center text-lg">{title}</Text>
          ) : (
            title
          )}
        </View>
      )}
      <View className="py-5">{renderMessage()}</View>
      <View className="flex-row w-full mt-4">
        {type === 'confirm' ? renderConfirmButton() : renderInfoButton()}
      </View>
    </View>
  );
}
