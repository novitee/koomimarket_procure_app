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
import React, {useCallback} from 'react';
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

const Icons = [
  () => <CurrencyIcon color={colors.primary.DEFAULT} />,
  () => <TruckIcon color={colors.primary.DEFAULT} />,
  () => <CalendarIcon color={colors.primary.DEFAULT} />,
  () => <ClockIcon color={colors.primary.DEFAULT} />,
];

export default function SupplierProfileScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {supplier} = route.params || {};
  const {name, description, properties, catalogues} = supplier || {};

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
      return (
        <View className="p-4 flex-row justify-between">
          <View>
            <Text className="text-sm font-medium">{item.label}</Text>
            <Text className="text-sm font-light text-gray-400">
              {item.price}
            </Text>
          </View>
          <Image source={item.image} className="w-[72px] h-[72px]" />
        </View>
      );
    },
    [],
  );

  const _renderItemSeparator = () => (
    <View className="w-full h-[1px] bg-gray-D1D5DB" />
  );

  return (
    <View className="flex-1">
      <StatusBar translucent barStyle={'light-content'} />

      <Animated.Image
        source={dummyCover}
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
          <Text className="mt-5">{description}</Text>
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
            data={catalogues}
            keyExtractor={item => item.label}
            ItemSeparatorComponent={_renderItemSeparator}
          />
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
