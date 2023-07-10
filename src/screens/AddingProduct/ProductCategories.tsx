import {Text, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {PRODUCT_CATEGORIES} from 'configs/data';
import clsx from 'libs/clsx';

interface ProductCategoriesProps {
  onChange: (category: any) => void;
  selectedCategory: any;
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

export default function ProductCategories({
  selectedCategory,
  onChange,
}: ProductCategoriesProps) {
  useEffect(() => {
    if (!selectedCategory) {
      onChange(selectedCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      const isSelected = selectedCategory?.id === item.id;
      return (
        <TouchableOpacity
          className={clsx({
            'pl-3 pr-2 min-h-[64px] items-center flex-row': true,
            'bg-gray-300/20': isSelected,
          })}
          onPress={() => onChange(item)}>
          <Text className=" font-bold">{item.name}</Text>
          {isSelected && (
            <View className="absolute left-0 top-1/2 -translate-y-[10px] bg-primary w-[5px] h-[20px] rounded-full" />
          )}
        </TouchableOpacity>
      );
    },
    [onChange, selectedCategory?.id],
  );
  return (
    <FlatList
      className="max-w-[130px] "
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      data={PRODUCT_CATEGORIES}
    />
  );
}
