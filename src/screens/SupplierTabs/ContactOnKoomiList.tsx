import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import colors from 'configs/colors';
import UserIcon from 'assets/images/user.svg';
function _keyExtractor(item: any, index: number) {
  return `${item.id}-${index}`;
}

function ContactListItem({item, onPress}: {item?: any; onPress?: () => void}) {
  return (
    <TouchableOpacity className="flex-row items-center mt-4" onPress={onPress}>
      <View className="w-14 h-14 bg-gray-E0E0E4 rounded-full items-center justify-center">
        <UserIcon width={24} height={24} color={colors.chevron} />
      </View>
      <View className="ml-4">
        <Text className="font-semibold">{item.name}</Text>
        <Text>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );
}
export default function ContactOnKoomiList({
  onSelect,
  users,
}: {
  onSelect: (item: any) => void;
  users: any[];
}) {
  const EmptyComponent = useCallback(() => {
    return <></>;
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
        <ContactListItem item={item} onPress={() => handleSelectItem(item)} />
      );
    },
    [handleSelectItem],
  );

  return (
    <FlatList
      data={users}
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      extraData={users}
      ListEmptyComponent={EmptyComponent}
    />
  );
}
