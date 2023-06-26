import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import Container from 'components/Container';
import ShippingIcon from 'assets/images/shipping.svg';
import useQuery from 'libs/swr/useQuery';

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

export default function OrderScreen() {
  const {} = useQuery('');
  const records: any = [];
  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <ShippingIcon />
        <Text className="font-bold mt-4 text-center">No orders yet</Text>
        <Text className="font-light mt-4 text-center">
          Add a supplier and start ordering now!
        </Text>
      </View>
    );
  }, []);

  const _renderItem = useCallback(({item}: {item?: any}) => {
    return <View />;
  }, []);

  return (
    <Container>
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
