import React, {useCallback, useState} from 'react';
import Text from 'components/Text';
import {View} from 'react-native';
import Button from 'components/Button';
import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import useMutation from 'libs/swr/useMutation';
export default function ToggleUpdateProduct({
  isOpen,
  supplierId,
  item,
  onClose,
}: {
  isOpen: boolean;
  supplierId: string;
  item: any;
  onClose: (refresh?: boolean) => void;
}) {
  const [pricing, setPricing] = useState(item?.pricing);

  const [{loading}, updateItem] = useMutation({
    method: 'PATCH',
    url: `update-item/${item?.slug}`,
  });

  const handleUpdate = useCallback(async () => {
    const {data} = await updateItem({
      supplierId: supplierId,
      product: {
        pricing,
      },
    });
    onClose(true);
  }, [updateItem]);

  return (
    <BottomSheet isOpen={isOpen} contentHeight={400}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-10">
            <Text className="text-primary font-semibold text-xl text-center">{`Edit ${item?.name} price`}</Text>
          </View>
          <View className="flex-row justify-between mt-10">
            <View className="flex-1">
              <Text className="font-semibold mb-3">Original</Text>
              <Text className="mt-3">
                $ {`${item?.pricing} ${item.uom?.toUpperCase()}`} (S)
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold mb-3">Update to</Text>
              <Input
                keyboardType="decimal-pad"
                className="rounded-lg"
                StartComponent={() => (
                  <View className="flex-row items-center ml-2">
                    <Text className="text-gray-500 text-center ">$</Text>
                  </View>
                )}
                value={pricing}
                onChangeText={setPricing}
              />
            </View>
          </View>
        </View>

        <View className="flex-row">
          <Button
            variant="outline"
            onPress={() => onClose()}
            className="flex-1">
            Cancel
          </Button>
          <Button onPress={handleUpdate} className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
