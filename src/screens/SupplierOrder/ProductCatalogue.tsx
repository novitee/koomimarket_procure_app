import {View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';

import SearchBar from 'components/SearchBar';
import ProductCategories from './ProductCategories';
import ProductList from './ProductList';
import {toggleValueInArray} from 'utils/common';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import useSearch from 'hooks/useSearch';
import LineButton from 'components/LineButton';

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
  const {searchString, handleSearch} = useSearch();
  function handleChangeCategory(category: any) {
    dispatch({selectedCategory: category, render: true});
  }
  function handleSelectProduct(product: any) {
    dispatch({
      selectedProductIds: toggleValueInArray(product.id, selectedProductIds),
      render: true,
    });
  }
  const [{loading}, createItems] = useMutation({
    url: 'create-item-from-supplier-catalog',
  });

  async function handleSave() {
    const body = {
      supplierId,
      items: selectedProductIds.map((id: any) => ({productId: id})),
    };
    const {success} = await createItems(body);
    if (!success) {
      Toast.show("Can't not add items", Toast.LONG);
    } else {
      navigation.navigate('NewOrder');
    }
  }

  return (
    <Container className="pt-2 px-0">
      <View className="px-5 mb-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by supplier or product"
          defaultValue={searchString}
        />
      </View>
      <LineButton
        onPress={() =>
          navigation.navigate('AddingProductType', {
            supplierId,
          })
        }
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
          searchString={searchString}
        />
      </View>
      <View className="bg-white px-5 pt-2">
        <Button
          disabled={selectedProductIds.length === 0}
          onPress={handleSave}>{`Add Product ${
          selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : ''
        }`}</Button>
      </View>
    </Container>
  );
}
