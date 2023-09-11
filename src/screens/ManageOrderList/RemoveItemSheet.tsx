import {View, Text} from 'react-native';
import React from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';

export default function RemoveItemSheet({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen?: boolean;
  onConfirm?: (values: any) => void;
  onCancel?: () => void;
}) {
  return (
    <BottomSheet isOpen={isOpen} contentHeight={550} onClose={onCancel}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-5">
            <Text className="text-primary font-semibold text-xl text-center">
              {'Remove Item'}
            </Text>
          </View>
          <View className="mt-5">
            <Text className="font-bold text-center">
              Are you sure to delete item from your Order List?
            </Text>
          </View>
        </View>

        <View className="flex-row">
          <Button variant="outline" onPress={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onPress={onConfirm} className="flex-1 ml-2">
            Remove
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
