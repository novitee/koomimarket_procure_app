import {StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';
import {toCurrency} from 'utils/format';

export default function ProductDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {product} = route.params || {};
  const {name, photos, productNo, finalPricing, categories} = product;
  const {currencyCode, pricing, unit} = finalPricing || {};
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  const data = [
    ['Unit', unit],
    ['Product ID', productNo],
    ['Price', toCurrency(pricing, currencyCode)],
    ['Category', (categories || []).map((item: any) => item.name).join(', ')],
  ];

  return (
    <Container>
      <Animated.Image
        source={{uri: photos?.[0]?.url}}
        className="w-full h-[240px] bg-slate-300"
        sharedTransitionTag={`product-${name}`}
      />

      <Text className="font-extrabold text-xl mt-5">Product details</Text>
      <View
        className="border border-gray-EEF3FD p-4 mt-5 "
        style={styles.gap10}>
        {data.map(([label, value], index) => (
          <View key={index}>
            <Text className="text-gray-500 mb-1">{label}</Text>
            <Text>{value}</Text>
          </View>
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  gap10: {
    rowGap: 20,
  },
});
