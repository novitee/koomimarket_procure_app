import {View, Text} from 'react-native';
import React from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
export default function RemoveItemSheet({
  isOpen,
  onCancel,
  selectedItemIds,
}: {
  isOpen: boolean;
  onCancel: (refresh?: boolean) => void;
  selectedItemIds?: any[];
}) {
  const [{loading: removeLoading}, removeItems] = useMutation({
    method: 'DELETE',
    url: 'items',
  });

  async function onConfirm() {
    const {data, success, error, message} = await removeItems({
      productIds: selectedItemIds,
    });
    if (success) {
      onCancel(true);
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} contentHeight={300} onClose={onCancel}>
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
          <Button
            variant="outline"
            onPress={() => onCancel()}
            className="flex-1">
            Cancel
          </Button>
          <Button
            loading={removeLoading}
            onPress={onConfirm}
            className="flex-1 ml-2">
            Remove
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
