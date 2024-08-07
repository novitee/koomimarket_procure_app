import {Text, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import _ from 'lodash'
// import {PRODUCT_CATEGORIES} from 'configs/data';
import clsx from 'libs/clsx';
import useQuery from 'libs/swr/useQuery';
interface ProductCategoriesProps {
  onChange: (category: any) => void;
  selectedCategory: any;
  supplierId: string;
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function useQueryCategories(supplierId: string) {
  const url = 'app/supplier-categories';
  const params = {
    first: 100,
    fields: 'id,name,position,slug,chinaName',
    orderBy: {
      position: 'asc',
    },
    supplierFilter: {
      _id: supplierId,
    },
    filter: {
      depth: 0,
    },
  };
  return useQuery([url, params]);
}
export default function ProductCategories({
  selectedCategory,
  onChange,
  supplierId,
}: ProductCategoriesProps) {
  const {data} = useQueryCategories(supplierId);
  const {records: categories, settingLanguage} = data || {};
  useEffect(() => {
    if (!selectedCategory && categories && categories.length > 0) {
      onChange(categories[0]);
    }
  }, [selectedCategory, categories]);

  function selectCategoryName({category, settingLanguage}: {category?: any; settingLanguage?: "ENGLISH" | "CHINESE"}) {
    const name = _.get(category, "name", null)
    const chinaName = _.get(category, "chinaName", null)
    if (settingLanguage === "CHINESE" && !!chinaName) {
      return chinaName
    }
    return name
  }

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      const isSelected = selectedCategory?.id === item.id;
      const categoryName = selectCategoryName({category: item, settingLanguage: settingLanguage})
      return (
        <TouchableOpacity
          className={clsx({
            'pl-3 pr-2 min-h-[64px] items-center flex-row': true,
            'bg-gray-300/20': !isSelected,
            'bg-primary': !!isSelected,
          })}
          onPress={() => onChange(item)}>
          <Text
            className={clsx({
              'font-bold': true,
              'text-gray-500': !isSelected,
              'text-white': !!isSelected,
            })}>
            {categoryName}
          </Text>
          {isSelected && (
            <View className="absolute left-0 top-1/2 -translate-y-[10px] bg-primary w-[5px] h-[20px] rounded-full" />
          )}
        </TouchableOpacity>
      );
    },
    [onChange, selectedCategory?.id, settingLanguage],
  );
  return (
    <FlatList
      className="max-w-[130px] "
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      data={categories?.sort((a: any, b: any) => a.position - b.position)}
    />
  );
}
