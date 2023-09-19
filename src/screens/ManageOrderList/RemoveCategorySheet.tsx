import {View, Text} from 'react-native';
import React from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
export default function RemoveCategorySheet({
  isOpen,
  onCancel,
  selectedEditCategory,
}: {
  isOpen?: boolean;
  selectedEditCategory?: any;
  onCancel: (refresh?: boolean) => void;
}) {
  const [{loading: removeLoading}, removeCategory] = useMutation({
    url: `categories/${selectedEditCategory?.id}`,
    method: 'DELETE',
  });
  async function handleRemove() {
    const {success, error, message} = await removeCategory();
    if (success) {
      onCancel(true);
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }
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
              Are you sure to remove this category from your Order List?
            </Text>
            <Text className="font-bold text-center mt-5">
              All the items in this category will be reset to uncategorised.
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
            onPress={handleRemove}
            className="flex-1 ml-2">
            Confirm
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
