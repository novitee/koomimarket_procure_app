import React, {useCallback, useReducer, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SearchBar from 'components/SearchBar';
import Counter from 'components/Counter';
import {toCurrency} from 'utils/format';
import BottomSheet from 'components/ButtomSheet';
import Input from 'components/Input';

const dummyData = [
  {id: 1, name: 'Carrot', price: 0.99, unit: 'KG', categoryId: 1},
  {id: 2, name: 'Tomato', price: 1.49, unit: 'KG', categoryId: 1},
  {id: 3, name: 'Broccoli', price: 1.99, unit: 'KG', categoryId: 2},
  {id: 4, name: 'Spinach', price: 0.89, unit: 'KG', categoryId: 2},
];

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}
function OrderItem({
  item,
  onEdit,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
  onEdit?: TouchableOpacityProps['onPress'];
}) {
  return (
    <View className="flex-row items-center justify-between rounded-lg p-5">
      <View>
        <Text className="text-sm ">{item.name}</Text>
        <TouchableOpacity
          className="p-2 bg-primary rounded mt-2"
          onPress={onEdit}>
          <Text className="text-white">{`${toCurrency(item.price, 'USD')} ${
            item.unit
          }`}</Text>
        </TouchableOpacity>
      </View>
      <Counter defaultValue={1} onChange={() => {}} />
    </View>
  );
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

function NewOrderScreen({navigation}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    selectedItem: {},
  });

  const minOrderAmount = 150;

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

  const {selectedItem} = values;

  const toAddProduct = useCallback(() => {
    navigation.navigate('ProductCatalogue');
  }, [navigation]);
  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">No products yet</Text>
        <Text className="font-light mt-4 text-center">
          Add products to your order list to get started.
        </Text>

        <Button className="mt-4" onPress={toAddProduct}>
          Add Products
        </Button>
      </View>
    );
  }, [toAddProduct]);

  const handleEdit = useCallback((item: any) => {
    dispatch({
      selectedItem: item,
      render: true,
    });
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OrderItem
          item={item}
          onEdit={() => handleEdit(item)}
          onPress={() => {}}
        />
      );
    },
    [handleEdit],
  );

  // const records: any = [];
  const records = dummyData;
  return (
    <>
      <Container className="pt-4 px-0">
        <SearchBar className="px-5" onSearch={() => {}} />
        {records.length > 0 && (
          <View className="mt-5">
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-primary font-bold text-2xl">
                My Order List
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ManageOrderList')}>
                <Text className="text-primary">Manage List</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-gray-100 px-5 py-4 mt-4">
              <Text className="font-medium">{`Minimum Order Amount: ${toCurrency(
                minOrderAmount,
                'USD',
              )}`}</Text>
              <Text className="text-sm text-gray-500 leading-none mt-2">
                This supplier has a minimum order value. Additional costs may
                occur if orders are placed under this amount.
              </Text>
            </View>
          </View>
        )}
        <FlatList
          keyExtractor={_keyExtractor}
          contentContainerStyle={styles.flatListContentStyle}
          renderItem={_renderItem}
          data={records || []}
          extraData={records}
          ListEmptyComponent={EmptyComponent}
          ItemSeparatorComponent={_renderItemSeparator}
        />
      </Container>
      <BottomSheet isOpen={!!selectedItem?.name} contentHeight={400}>
        <View className="pb-10 px-5 pt-5 flex-1">
          <View className="flex-1">
            <View className="border-b border-gray-300 pb-10">
              <Text className="text-primary font-semibold text-xl text-center">{`Edit ${selectedItem?.name} price`}</Text>
            </View>
            <View className="flex-row justify-between mt-10">
              <View className="flex-1">
                <Text className="font-semibold mb-3">Original</Text>
                <Text className="mt-3">{`${selectedItem?.price} ${selectedItem.unit}`}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold mb-3">Update to</Text>
                <Input keyboardType="decimal-pad" />
              </View>
            </View>
          </View>

          <View className="flex-row">
            <Button
              variant="outline"
              onPress={() =>
                dispatch({
                  selectedItem: {},
                  render: true,
                })
              }
              className="flex-1">
              Cancel
            </Button>
            <Button
              onPress={() =>
                dispatch({
                  selectedItem: {},
                  render: true,
                })
              }
              className="flex-1 ml-2">
              Save
            </Button>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});

export default NewOrderScreen;
