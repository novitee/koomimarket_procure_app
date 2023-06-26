import React, {useCallback, useLayoutEffect} from 'react';
import Container from 'components/Container';
import SearchBar from 'components/SearchBar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dummyCover from 'assets/images/dummy_cover.png';
import dummyCatalogue from 'assets/images/dummy_catalogue.png';
import {
  FlatList,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import Animated from 'react-native-reanimated';

const records = [
  {
    image: dummyCover,
    name: 'Vegetable Farm Pte Ltd',
    noOfProduct: 128,
    description:
      'We specialize in growing fresh, organic produce using sustainable farming practices. ',
    properties: [
      {
        label: 'Minimum Order Value',
        value: '0 SGD',
      },
      {
        label: 'Delivery fee',
        value: '0 SGD',
      },
      {
        label: 'Delivery days',
        value: 'Mon, Tue, Wed, Thus, Fri, Sat',
      },
      {
        label: 'Cut-off time ',
        value: '1 day before, 1.00am',
      },
    ],
    catalogues: [
      {
        label: 'Cabbage Mini (Wa Wa Chye)',
        price: '$0.00 Kilos (S)',
        image: dummyCatalogue,
      },
      {
        label: 'Dragonfruit Red',
        price: '$0.00 Kilos (S)',
        image: dummyCatalogue,
      },
      {
        label: 'Honeydew',
        price: '$0.00 Kilos (S)',
        image: dummyCatalogue,
      },
      {
        label: 'Lettuce Oak Red',
        price: '$0.00 Kilos (S)',
        image: dummyCatalogue,
      },
      {
        label: 'Lime Seedless',
        price: '$0.00 Kilos (S)',
        image: dummyCatalogue,
      },
    ],
  },
  {
    image: dummyCover,
    name: 'Organic Farm Pte Ltd',
    noOfProduct: 57,
  },
  {
    image: dummyCover,
    name: 'ABC Organic Farm',
    noOfProduct: 46,
  },
  {
    image: dummyCover,
    name: 'ABC Vegetable Farm',
    noOfProduct: 28,
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
    <TouchableOpacity className=" mt-5 w-full " onPress={onPress}>
      <Animated.Image
        source={dummyCover}
        className="w-full h-[112px]"
        sharedTransitionTag={`supplier-${item.name}`}
      />

      <View className="bg-white h-14 w-14 rounded-full items-center justify-center absolute top-4 left-4">
        <Text className="text-24 font-bold text-primary text-center">
          {(item.name || '').charAt(0)}
        </Text>
      </View>
      <View className="px-4 py-3 border border-t-0 border-gray-D4D4D8">
        <Text className="font-semibold">{item.name}</Text>
        <Text className="text-chevron">
          Discover {item.noOfProduct} products
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SupplierGroupScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {group} = route.params || {};
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: group.title,
    });
  }, [group, navigation]);

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
      navigation.navigate('SupplierProfile', {supplier: item});
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
