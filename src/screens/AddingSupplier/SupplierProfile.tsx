import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Container from 'components/Container';
import Animated from 'react-native-reanimated';
import dummyCover from 'assets/images/dummy_cover.png';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BackButton} from 'navigations/common';
import Button from 'components/Button';
import CurrencyIcon from 'assets/images/currency-dollar.svg';
import TruckIcon from 'assets/images/truck.svg';
import CalendarIcon from 'assets/images/calendar.svg';
import ClockIcon from 'assets/images/clock.svg';
import colors from 'configs/colors';
import _ from 'lodash';
import useQuery from 'libs/swr/useQuery';
const Icons = [
  () => <CurrencyIcon color={colors.primary.DEFAULT} />,
  () => <TruckIcon color={colors.primary.DEFAULT} />,
  () => <CalendarIcon color={colors.primary.DEFAULT} />,
  () => <ClockIcon color={colors.primary.DEFAULT} />,
];

function querySupplier(slug: string) {
  const url = `suppliers/${slug}`;
  const params = {
    fields: 'id,name,slug,description,minOrder,deliveryFee,cutOffTiming',
    include:
      'photo(id,url,width,height,signedKey,filename,contentType),deliveryDays(weekday,active)',
  };
  return useQuery([url, params]);
}

function queryProducts(slug: string, skip = 0) {
  const url = 'products';
  const params = {
    first: 5,
    skip: skip,
    orderBy: {
      soldOut: 'asc',
      createdAt: 'desc',
    },
    supplierFilter: {
      slug_in: [slug],
    },
    include:
      'photos(url,filename,height,width,contentType),finalPricing(unit,pricing,currencyCode)',
    fields: 'id,slug,name',
  };
  return useQuery([url, params]);
}

export default function SupplierProfileScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {slug} = route.params || {};
  const {data} = querySupplier(slug);
  const {data: productsData} = queryProducts(slug);
  const {company: supplier} = data || {};
  const {
    name,
    description,
    photo,
    minOrder,
    deliveryFee,
    cutOffTiming,
    deliveryDays,
  } = supplier || {};
  const {records: products} = productsData || {};

  const showDeliveryDays = deliveryDays?.reduce((acc: any, curr: any) => {
    if (curr.active) {
      acc += _.capitalize(curr.weekday.slice(0, 3)) + ', ';
    }
    return acc;
  }, '');

  const properties = [
    {
      label: 'Minimum Order Value',
      value: `${minOrder} SGD`,
    },
    {
      label: 'Delivery fee',
      value: `${deliveryFee} SGD`,
    },
    {
      label: 'Delivery days',
      value: showDeliveryDays,
    },
    {
      label: 'Cut-off time ',
      // value: '1 day before, 1.00am',
      value: cutOffTiming,
    },
  ];
  const imageUrl = photo ? {uri: photo?.url} : dummyCover;
  const _renderAboutItem = useCallback(
    ({item, index}: {item?: any; index: number}) => {
      return (
        <View className="py-4 flex-row items-center">
          {Icons[index]()}
          <View className="ml-4">
            <Text className="text-sm text-gray-6B7280">{item.label}</Text>
            <Text className="text-sm font-medium">{item.value}</Text>
          </View>
        </View>
      );
    },
    [],
  );

  const _renderCatalogueItem = useCallback(
    ({item}: {item?: any; index: number}) => {
      const {photos, finalPricing} = item || {};
      const photo = photos?.[0];
      const {currencyCode, pricing, unit} = finalPricing || {};
      const showPricing = `${currencyCode} ${pricing} ${unit}`;
      const imageUrl = photo ? {uri: photo?.url} : dummyCover;
      return (
        <View className="p-4 flex-row justify-between">
          <View className="mr-4 flex-1">
            <Text className="text-sm font-medium">{item.name}</Text>
            <Text className="text-sm font-light text-gray-400">
              {showPricing}
            </Text>
            <Text className="text-red-500">See details</Text>
          </View>
          <Image source={imageUrl} className="w-[72px] h-[72px] flex-0" />
        </View>
      );
    },
    [],
  );

  const _renderItemSeparator = () => (
    <View className="w-full h-[1px] bg-gray-D1D5DB" />
  );

  const [isShowMore, setIsShowMore] = useState(false);
  const showMore = useCallback(() => {
    setIsShowMore(!isShowMore);
  }, [isShowMore]);

  return (
    <View className="flex-1">
      <StatusBar translucent barStyle={'light-content'} />

      <Animated.Image
        source={imageUrl}
        className="w-screen h-[240px]"
        sharedTransitionTag={`supplier-${name}`}
      />
      <SafeAreaView className="absolute left-4 top-0 z-50">
        <BackButton canGoBack goBack={navigation.goBack} />
      </SafeAreaView>

      <Container className="p-0">
        <ScrollView
          contentContainerStyle={styles.scrollView}
          className="flex-1 p-5">
          <Text className="text-36 font-extrabold">{name}</Text>
          <Text className="mt-5">
            {isShowMore ? description : description?.substring(0, 80)}
          </Text>
          {description && description.length > 80 && (
            <Text onPress={showMore} className="text-red-500">
              {isShowMore ? 'See Less' : 'See More'}
            </Text>
          )}
          <Text className="font-bold my-4">About</Text>
          <FlatList
            className="border border-gray-D1D5DB px-4"
            scrollEnabled={false}
            renderItem={_renderAboutItem}
            data={properties}
            keyExtractor={item => item.label}
            ItemSeparatorComponent={_renderItemSeparator}
          />
          <Text className="font-bold my-4">Catalogue</Text>
          <FlatList
            className="border border-gray-D1D5DB"
            scrollEnabled={false}
            renderItem={_renderCatalogueItem}
            data={products}
            keyExtractor={item => item.slug}
            ItemSeparatorComponent={_renderItemSeparator}
          />
          <Text className="text-red-500 mt-2">See More</Text>
        </ScrollView>
        <View className="px-5">
          <Button
            onPress={() =>
              navigation.navigate('AreCurrentCustomer', {
                supplier,
              })
            }>
            Add Supplier
          </Button>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 40,
  },
});
