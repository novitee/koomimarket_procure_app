import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {toCurrency} from 'utils/format';
const {width} = Dimensions.get('window');

const characterLength = parseInt(String(width / 13), 10);
 
export default function ProductDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {product} = route.params || {};
  const {id, name, photos, productNo, finalPricing, categories} = product;
  const {currencyCode, pricing, unit} = finalPricing || {};
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        name.length >= characterLength
          ? name.slice(0, characterLength) + '...'
          : name,
    });
  }, [name, navigation]);

  const data = [
    ['Unit', unit || product.uom],
    ['Product ID', productNo],
    ['Price', toCurrency(pricing || product.pricing, currencyCode || 'SGD')],
    ['Category', (categories || []).map((item: any) => item.name).join(', ')],
  ];

  return (
    <Container>
      <Image
        source={{uri: photos?.[0]?.url}}
        className="w-full h-[240px] bg-slate-300"
        // sharedTransitionTag={`product-${name}`}
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
