import {Text, FlatList, TouchableOpacity, View, Image} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {PRODUCTS} from 'configs/data';
import {toCurrency} from 'utils/format';
import AddIcon from 'assets/images/plus.svg';
import CheckIcon from 'assets/images/check.svg';
import colors from 'configs/colors';

interface ProductListProps {
  onSelect: (category: any) => void;
  selectedCategory?: any;
  selectedProductIds?: any[];
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function ProductItem({
  item,
  onSelect,
  onViewDetail,
}: {
  item: any;
  onSelect?: (item: any) => void;
  onViewDetail?: (item: any) => void;
}) {
  const {price, name, unit, image, isSelected} = item;
  return (
    <View className="p-5 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{name}</Text>
        <Text className="mt-3 text-sm text-gray-500">
          {toCurrency(price, 'USD')} {unit}
        </Text>
        <TouchableOpacity
          className="mt-3"
          hitSlop={10}
          onPress={() => onViewDetail?.(item)}>
          <Text className="text-primary font-semibold">See Details</Text>
        </TouchableOpacity>
      </View>
      <Image source={image} className="w-[72px] h-[72px]" />
      <TouchableOpacity
        hitSlop={10}
        onPress={() => onSelect?.(item)}
        className="ml-3">
        {isSelected ? (
          <View className="w-8 h-8 items-center justify-center rounded-full bg-primary">
            <CheckIcon color="#FFFFFF" width={18} height={13} />
          </View>
        ) : (
          <View className="w-8 h-8 items-center justify-center rounded-full border-[3px] border-primary">
            <AddIcon color={colors.primary.DEFAULT} strokeWidth="3" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

export default function ProductList({
  selectedCategory,
  selectedProductIds,
  onSelect,
}: ProductListProps) {
  const productsData = useMemo(() => {
    return PRODUCTS.filter(
      product => product.categoryId === selectedCategory?.id,
    ).map(product => ({
      ...product,
      isSelected: (selectedProductIds || []).includes(product.id),
    }));
  }, [selectedCategory?.id, selectedProductIds]);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return <ProductItem item={item} onSelect={onSelect} />;
    },
    [onSelect],
  );
  return (
    <FlatList
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      data={productsData}
      ItemSeparatorComponent={_renderItemSeparator}
    />
  );
}
