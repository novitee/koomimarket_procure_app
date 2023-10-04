import React, {useCallback} from 'react';
import Text from 'components/Text';
import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import Counter from 'components/Counter';
import {toCurrency} from 'utils/format';
import useMutation from 'libs/swr/useMutation';

export default function OrderItem({
  item,
  onEdit,
  onPress,
  supplierId,
}: {
  item?: any;
  onPress: (value: number) => void;
  onEdit?: TouchableOpacityProps['onPress'];
  supplierId: string;
}) {
  const [{loading}, updateItemQty] = useMutation({
    url: 'update-item-qty',
    method: 'PATCH',
  });

  const handleUpdateQty = useCallback(
    async (value: number) => {
      const {data, success} = await updateItemQty({
        productId: item?.id,
        qty: value,
        supplierId,
      });
      if (success) {
        onPress(value);
      }
    },
    [updateItemQty],
  );

  return (
    <View className="flex-row items-center justify-between rounded-lg p-5 w-full">
      <View className="flex-shrink-1 w-1/2">
        <Text className="text-sm font-bold ">{item.name}</Text>
        <TouchableOpacity
          className="flex-row items-center pr-2 rounded mt-1 flex-1 self-start"
          onPress={onEdit}>
          <Text className="text-primary font-medium">
            {`${toCurrency(item.pricing, 'USD')}/${item.uom?.toUpperCase()}`}{' '}
          </Text>
        </TouchableOpacity>
      </View>
      <Counter
        defaultValue={item?.procureQty}
        onChange={handleUpdateQty}
        min={item?.minOfQty || 0}
        allowDecimal={item?.allowDecimalQuantity}
        unit={item.uom?.toUpperCase()}
      />
    </View>
  );
}
