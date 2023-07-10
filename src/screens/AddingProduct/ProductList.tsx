import {Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {PRODUCTS} from 'configs/data';

interface ProductListProps {
  onSelect: (category: any) => void;
  selectedCategory?: any;
  selectedProductIds?: any[];
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

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
      return (
        <TouchableOpacity className="p-5" onPress={() => onSelect(item)}>
          <Text>{item.name}</Text>
          <Text>
            {item.price} {item.unit}
          </Text>
        </TouchableOpacity>
      );
    },
    [onSelect],
  );
  return (
    <FlatList
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      data={productsData}
    />
  );
}
