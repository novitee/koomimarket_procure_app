import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Text, {Title} from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
import SearchBar from 'components/SearchBar';
import ProductCategories from './ProductCategories';
import ProductList from './ProductList';

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
      className={
        'flex-row items-center justify-between px-5 py-2 border-b border-gray-D4D4D8'
      }>
      {typeof children === 'string' ? (
        <Text className="text-primary text-lg font-bold">{children}</Text>
      ) : (
        children
      )}
      <ChevronRightIcon color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  );
}

export default function ProductCatalogueScreen() {
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
      selectedProductIds: [...selectedProductIds, product.id],
      render: true,
    });
  }

  return (
    <Container className="pt-0 px-0">
      <View className="px-5 mb-4">
        <Title className="text-primary mb-4">Browse Catalogue</Title>
        <SearchBar
          onSearch={() => {}}
          placeholder="Search by supplier or product"
        />
      </View>
      <LineButton className="border-t border-gray-D4D4D8">
        Add Products Manually
      </LineButton>
      <LineButton>Upload Invoice</LineButton>
      <View className="flex-1 flex-row">
        <ProductCategories
          selectedCategory={selectedCategory}
          onChange={handleChangeCategory}
        />
        <ProductList
          onSelect={handleSelectProduct}
          selectedProductIds={selectedProductIds}
          selectedCategory={selectedCategory}
        />
      </View>
    </Container>
  );
}
