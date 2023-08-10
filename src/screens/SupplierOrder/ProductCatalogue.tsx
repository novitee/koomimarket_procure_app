import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import SearchBar from 'components/SearchBar';
import ProductCategories from './ProductCategories';
import ProductList from './ProductList';
import {toggleValueInArray} from 'utils/common';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function LineButton({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode | string;
  onPress?: TouchableOpacityProps['onPress'];
  style?: TouchableOpacityProps['style'];
  className?: TouchableOpacityProps['className'];
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className="flex-row items-center justify-between px-5 py-2 border-b border-gray-D4D4D8">
      {typeof children === 'string' ? (
        <Text className="text-primary text-lg font-bold">{children}</Text>
      ) : (
        children
      )}
      <ChevronRightIcon color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  );
}

export default function ProductCatalogueScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {params} = route;
  const {supplierId} = params || {};
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    selectedCategory: null,
    selectedProductIds: [],
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {selectedCategory, selectedProductIds} = values;

  function handleChangeCategory(category: any) {
    dispatch({selectedCategory: category, render: true});
  }

  function handleSelectProduct(product: any) {
    dispatch({
      selectedProductIds: toggleValueInArray(product.id, selectedProductIds),
      render: true,
    });
  }

  function handleSave() {}

  return (
    <Container className="pt-2 pb-0 px-0">
      <View className="px-5 mb-4">
        <SearchBar
          onSearch={() => {}}
          placeholder="Search by supplier or product"
        />
      </View>
      <LineButton
        onPress={() => navigation.navigate('AddingProductType')}
        className="border-t border-gray-D4D4D8">
        Add Products Manually
      </LineButton>
      <View className="flex-1 flex-row">
        <ProductCategories
          selectedCategory={selectedCategory}
          onChange={handleChangeCategory}
          supplierId={supplierId}
        />
        <ProductList
          onSelect={handleSelectProduct}
          selectedProductIds={selectedProductIds}
          selectedCategory={selectedCategory}
          supplierId={supplierId}
        />
      </View>
      <View className="bg-white px-5 pt-2">
        <Button
          disabled={selectedProductIds.length === 0}
          onPress={handleSave}>{`Save Product ${
          selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : ''
        }`}</Button>
      </View>
    </Container>
  );
}
