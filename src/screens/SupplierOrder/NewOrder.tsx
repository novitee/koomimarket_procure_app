import React, {useCallback} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {FlatList, StyleSheet, TouchableOpacityProps, View} from 'react-native';
import Button from 'components/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SearchBar from 'components/SearchBar';

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}
function OrderItem({
  item,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  return (
    <View className="flex-row items-center rounded-lg  p-5 mb-4">
      <Text className="font-light  text-xs mt-2">Order Item</Text>
    </View>
  );
}
function NewOrderScreen({navigation}: NativeStackScreenProps<any>) {
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

  const _renderItem = useCallback(({item}: {item?: any}) => {
    return <OrderItem item={item} onPress={() => {}} />;
  }, []);

  const records: any = [];
  return (
    <Container className="pt-4 px-0">
      <SearchBar className="px-5" onSearch={() => {}} />

      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});

export default NewOrderScreen;
