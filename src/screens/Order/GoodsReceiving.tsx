import {FlatList, View} from 'react-native';
import React, {useCallback, useMemo, useReducer, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import Button from 'components/Button';
import YesNoCheckBox from 'components/YesNoCheckBox';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const dummyData = [
  {id: 1, name: 'Carrot', price: 0.99, unit: 'KG', quantity: 1},
  {id: 2, name: 'Tomato', price: 1.49, unit: 'KG', quantity: 1},
  {id: 3, name: 'Broccoli', price: 1.99, unit: 'KG', quantity: 2},
  {id: 4, name: 'Spinach', price: 0.89, unit: 'KG', quantity: 2},
];

function ProductItem({
  item,
  onCheck,
}: {
  item: any;
  onCheck?: (value: string) => void;
}) {
  const value =
    typeof item?.issue === 'undefined' ? null : item?.issue ? 'no' : 'yes';
  return (
    <View className="flex-row items-center py-6 border-b border-gray-400">
      <Text className="text-30 font-bold w-16 text-center">
        {item.quantity}
      </Text>
      <View className="flex-1">
        <Text className="font-bold">{item.name}</Text>
        <Text className="font-light mt-2">{item.unit}</Text>
        {item?.issue && (
          <Text className="font-medium text-error mt-2">{`Issue: ${item.name}`}</Text>
        )}
      </View>
      <YesNoCheckBox value={value} onChange={onCheck} />
    </View>
  );
}
export default function GoodsReceivingScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    productData: dummyData,
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

  const {productData} = values;

  const handleUpdateIssue = useCallback(
    (newItem: any) => {
      console.log(newItem);
      const itemIndex = productData.findIndex(
        (item: any) => item.id === newItem.id,
      );

      const newProductData = [...productData];
      newProductData[itemIndex] = newItem;
      dispatch({productData: newProductData, render: true});
    },
    [productData],
  );

  const handleCheckProduct = useCallback(
    (item: any, value: string) => {
      console.log(value);
      if (value === 'no') {
        navigation.navigate('GoodsReceivingIssue', {
          product: item,
          onUpdateIssue: handleUpdateIssue,
        });
      } else if (value === 'yes') {
        const itemIndex = productData.findIndex(
          (productItem: any) => item.id === productItem.id,
        );
        const newProductData = [...productData];
        newProductData[itemIndex].issue = null;
        dispatch({productData: newProductData, render: true});
      }
    },
    [handleUpdateIssue, navigation, productData],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ProductItem
          item={item}
          onCheck={value => handleCheckProduct(item, value)}
        />
      );
    },
    [handleCheckProduct],
  );

  const numOfChecked = useMemo(() => {
    return productData.filter((item: any) => typeof item.issue !== 'undefined')
      .length;
  }, [productData]);

  function markAllAsGood() {
    const newProductData = [...productData].map((item: any) => ({
      ...item,
      issue: null,
    }));

    dispatch({productData: newProductData, render: true});
  }
  function markTheRestAsGood() {
    const newProductData = [...productData].map((item: any) => {
      if (typeof item.issue === 'undefined') {
        return {
          ...item,
          issue: null,
        };
      }

      return item;
    });

    dispatch({productData: newProductData, render: true});
  }

  function handleConfirm() {
    navigation.navigate('GoodsReceivingDone');
  }

  return (
    <Container>
      <Text className="text-primary font-bold text-xl">Products</Text>
      <FlatList
        className="flex-1"
        data={productData}
        extraData={productData}
        renderItem={_renderItem}
      />
      {numOfChecked === 0 && (
        <Button onPress={markAllAsGood}>{'Mark all as good'}</Button>
      )}
      {numOfChecked > 0 && numOfChecked < productData.length && (
        <Button onPress={markTheRestAsGood}>{'Mark the rest as good'}</Button>
      )}
      {numOfChecked === productData.length && (
        <Button onPress={handleConfirm}>{'Confirm'}</Button>
      )}
    </Container>
  );
}
