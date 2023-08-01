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
  const {name, image, unit, price} = product;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  const data = [
    ['Unit', unit],
    ['Product ID', 'AG001'],
    ['Price', toCurrency(price, 'USD')],
    ['Category', 'Asian & Local VEg'],
  ];

  return (
    <Container>
      <Animated.Image
        source={image}
        className="w-full h-[240px]"
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
