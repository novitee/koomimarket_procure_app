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
  searchString: string;
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function useQueryProductCategories(supplierId: string, categoryId: string) {
  const url =
    supplierId && categoryId
      ? 'supplier-customer-products/selected-product-ids'
      : undefined;
  const params = {
    filter: {supplierId},
    productCategoryFilter: {categoryId, supplierId},
  };
  return useQuery([url, params]);
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
  const {name, finalPricing, photos, isSelected, isAdded} = item;
  const {currencyCode, pricing, unit} = finalPricing || {};
  return (
    <View className="p-5 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{name}</Text>
        <Text className="mt-3 text-sm text-gray-500">
          {toCurrency(pricing, currencyCode)} {unit}
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
        source={{uri: photos?.[0]?.url}}
        className="w-[72px] h-[72px]"
      />
      <TouchableOpacity
        hitSlop={10}
        onPress={() => onSelect?.(item)}
        className="ml-3 flex-shrink-1">
        {isAdded ? (
          <View className=" h-8 items-center justify-center rounded-full ">
            <Text className="text-primary">Added</Text>
          </View>
        ) : isSelected ? (
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

function useQueryProducts(
  supplierId: string,
  categoryId: string,
  searchString: string = '',
) {
  const url = !supplierId || !categoryId ? undefined : 'products';
  const params = {
    first: 100,
    skip: 0,
    orderBy: {soldOut: 'asc', createdAt: 'desc'},
    categoryFilter: {_id: categoryId},
    searchString,
    filter: {supplierId},
    include:
      'photos(url,filename,height,width,contentType),finalPricing(unit,pricing,currencyCode)',
    fields: 'id,slug,name,productNo',
  };
  return useQuery([url, params]);
}

export default function ProductList({
  selectedCategory,
  selectedProductIds,
  supplierId,
  onSelect,
  searchString,
}: ProductListProps) {
  const {navigate} = useNavigation();
  const {data: dataProductCategories} = useQueryProductCategories(
    supplierId,
    selectedCategory?.id,
  );
  const {records: addedProductIds} = dataProductCategories || {};

  const {data} = useQueryProducts(
    supplierId,
    selectedCategory?.id,
    searchString,
  );
  const {records: products} = data || {};

  const productData = useMemo(() => {
    if (!products) return [];

    return products.map((product: any) => ({
      ...product,
      isSelected: (selectedProductIds || []).includes(product.id),
      isAdded: (addedProductIds || []).includes(product.id),
    }));
  }, [products, selectedProductIds, addedProductIds]);

  const toProductDetail = useCallback(
    (item: any) => {
      navigate('ProductDetail', {
        product: {...item, categoryName: selectedCategory?.name},
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
