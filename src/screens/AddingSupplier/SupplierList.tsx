import React, {useCallback} from 'react';
import Container from 'components/Container';
import SearchBar from 'components/SearchBar';
import dummy from 'assets/images/dummy.png';

import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Text from 'components/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const records = [
  {
    title: 'Local Farm',
    image: dummy,
  },
  {
    title: 'MEAT AND POULTRY',
    image: dummy,
  },
  {
    title: 'SEAFOOD',
    image: dummy,
  },
  {
    title: 'BEVERAGES',
    image: dummy,
  },
  {
    title: 'DAIRY',
    image: dummy,
  },
  {
    title: 'DRIED GOODS',
    image: dummy,
  },
  {
    title: 'BAKED GOODS',
    image: dummy,
  },
  {
    title: 'SPECIALTY',
    image: dummy,
  },
  {
    title: 'COFFEE & TEA',
    image: dummy,
  },
];

function _keyExtractor(item: any, index: number) {
  return `${item.title}-${index}`;
}

function SupplierItem({
  item,
  onPress,
}: {
  item: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  return (
    <TouchableOpacity className="h-[96px] mt-2" onPress={onPress}>
      <ImageBackground
        source={item.image}
        className="item-center justify-center w-full h-full">
        <Text className="text-32 font-bold text-white text-center">
          {item.title.toUpperCase()}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function SupplierListScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold mt-4 text-center">
          No supplier available
        </Text>
      </View>
    );
  }, []);

  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      navigation.navigate('SupplierGroup', {group: item});
    },
    [navigation],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <SupplierItem
          item={item}
          onPress={() => handleSelectSupplier({item})}
        />
      );
    },
    [handleSelectSupplier],
  );

  return (
    <Container className="pt-0">
      <SearchBar onSearch={() => {}} />

      <FlatList
        className="flex-1"
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}
