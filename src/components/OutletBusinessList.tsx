import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import colors from 'configs/colors';
import ChevronRightIcon from 'assets/images/chevron-right.svg';

function _keyExtractor(item: any, index: number) {
  return `${item.id}-${index}`;
}

function OutletBusinessItem({
  item,
  onPress,
}: {
  item?: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center py-4 border-b border-gray-D4D4D8 px-5"
      onPress={onPress}>
      <Text className="text-lg">{item.name}</Text>
      <ChevronRightIcon
        width={20}
        height={20}
        color={colors.gray['9CA3AF']}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}
export default function OutletBusinessList({
  onSelect,
  outlets,
}: {
  onSelect: (item: any) => void;
  outlets: any[];
}) {
  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Text className="font-bold mt-4 text-center">No outlet available</Text>
      </View>
    );
  }, []);

  const handleSelectItem = useCallback(
    (item: any) => {
      onSelect(item);
    },
    [onSelect],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OutletBusinessItem
          item={item}
          onPress={() => handleSelectItem(item)}
        />
      );
    },
    [handleSelectItem],
  );

  return (
    <FlatList
      data={outlets}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      extraData={outlets}
      ListEmptyComponent={EmptyComponent}
    />
  );
}
