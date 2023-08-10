import {Text, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {PRODUCTS} from 'configs/data';
import {toCurrency} from 'utils/format';
import AddIcon from 'assets/images/plus.svg';
import CheckIcon from 'assets/images/check.svg';
import colors from 'configs/colors';
import Animated from 'react-native-reanimated';
import useNavigation from 'hooks/useNavigation';
import useQuery from 'libs/swr/useQuery';
interface ProductListProps {
  onSelect: (category: any) => void;
  selectedCategory?: any;
  selectedProductIds?: any[];
  supplierId: string;
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
      <Animated.Image
        sharedTransitionTag={`product-${name}`}
        source={image}
        className="w-[72px] h-[72px]"
      />
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

function useQueryProducts(supplierId: string, categoryId: string) {
  const url = 'products';
  const params = {
    first: 100,
    skip: 0,
    orderBy: {
      soldOut: 'asc',
      createdAt: 'desc',
    },
    categoryFilter: {
      _id: categoryId,
    },
    filter: {supplierId},
    include:
      'photos(url,filename,height,width,contentType),finalPricing(unit,pricing,currencyCode)',
    fields: 'id,slug,name',
  };
  return useQuery([url, params], {skip: !supplierId || !categoryId});
}

export default function ProductList({
  selectedCategory,
  selectedProductIds,
  supplierId,
  onSelect,
}: ProductListProps) {
  console.log('selectedProductIds :>> ', selectedProductIds);
  const {navigate} = useNavigation();
  const {data} = useQueryProducts(supplierId, selectedCategory?.id);
  const {records: products} = data || {};
  const productData = useMemo(() => {
    if (!products) return [];

    return products.map((product: any) => ({
      ...product,
      isSelected: (selectedProductIds || []).includes(product.id),
    }));
  }, [products, selectedProductIds]);

  console.log('productData :>> ', productData);
  const toProductDetail = useCallback(
    (item: any) => {
      navigate('ProductDetail', {
        product: item,
      });
    },
    [navigate],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ProductItem
          item={item}
          onSelect={onSelect}
          onViewDetail={toProductDetail}
        />
      );
    },
    [onSelect, toProductDetail],
  );
  return (
    <FlatList
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      data={productData}
      ItemSeparatorComponent={_renderItemSeparator}
    />
  );
}
