import React, {useReducer, useState, useCallback, useEffect} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import Label from 'components/Form/Label';
import {ScrollView, StyleSheet, View} from 'react-native';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import DateInput from 'components/DateInput';
import dayjs from 'dayjs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useMutation from 'libs/swr/useMutation';
import useQuery from 'libs/swr/useQuery';
import {toCurrency} from 'utils/format';
import {generateOfflineBillingCart} from 'utils/billingCart';
import Toast from 'react-native-simple-toast';

export default function FinalizeOrderScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const supplierName = 'Vegetable Farm';
  const {billingCartId} = route.params || {};

  const {data} = useQuery(
    billingCartId ? `get-billing-cart/${billingCartId}` : undefined,
  );

  const [{}, generateReasonableDeliveryTime] = useMutation({
    url: 'delivery-dates',
  });
  const [{}, updateDeliveryDate] = useMutation({
    url: 'update-delivery-date',
  });
  const [{}, updateBillingCart] = useMutation({
    url: 'update-billing-cart',
  });
  const [{}, createOfflinePaymentOrders] = useMutation({
    url: 'create-offline-payment-orders',
  });

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
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

  const {requestedDeliveryDate, remarks, reasonableDeliveryTime} = values;

  const {getBillingCart: billingCart} = data || {};
  const {cartGroups, supplierId, total = 0} = billingCart || {};
  const cartGroup = cartGroups?.[0] || {};
  const mappingProducts = cartGroup?.cartItems?.map((cartItem: any) => ({
    id: cartItem.productId,
  }));
  const deliveryInputData = {
    id: supplierId,
    products: mappingProducts,
  };
  // const getReasonableDeliveryTime = async () => {
  //   const {data, success} = await generateReasonableDeliveryTime({
  //     supplier: deliveryInputData,
  //   });
  //   if (success) {
  //     dispatch({
  //       reasonableDeliveryTime: data?.deliveryDates,
  //       // render: true,
  //     });
  //   }
  // };
  // getReasonableDeliveryTime();
  // console.log('reasonableDeliveryTime :>> ', reasonableDeliveryTime);

  // useEffect(() => {
  //   if (!!deliveryInputData) {
  //     getReasonableDeliveryTime();
  //   }
  // }, [deliveryInputData]);

  const handleUpdateDeliveryDate = useCallback(
    async (date: Date) => {
      const {data, success} = await updateDeliveryDate({
        cartGroup: {
          billingCartId,
          deliveryDate: dayjs(date).valueOf(),
          id: cartGroup?.id,
        },
      });
      if (success) {
        dispatch({requestedDeliveryDate: date, render: true});
      }
    },
    [cartGroup?.id, billingCartId, updateDeliveryDate],
  );

  const handleCreateOfflinePaymentOrders = useCallback(async () => {
    const {data, success, error} = await createOfflinePaymentOrders({
      billingCartId,
      supplierId,
      procurePortalOrderUrl: '/order-details',
    });
    if (!success) {
      Toast.show(error?.message, Toast.LONG);
    }
    return data;
  }, [billingCartId, createOfflinePaymentOrders, supplierId]);

  const handleOrder = useCallback(async () => {
    const newBillingCart = generateOfflineBillingCart(billingCart, remarks);
    const {success, error} = await updateBillingCart({
      billingCart: newBillingCart,
      myOrderUrl: '/my-orders',
      portalOrderUrl: '/orders',
    });

    if (!success) {
      Toast.show(error?.message, Toast.LONG);
      return;
    }
    const checkoutData = await handleCreateOfflinePaymentOrders();
    if (checkoutData) {
      navigation.navigate('DoneOrder', {
        order: checkoutData.orders?.[0],
      });
    }
  }, [
    billingCart,
    handleCreateOfflinePaymentOrders,
    navigation,
    remarks,
    updateBillingCart,
  ]);

  return (
    <Container>
      <Text className="text-30 font-bold text-primary">
        Purchase Order With
      </Text>
      <View className="bg-primary p-2.5 mt-3">
        <Text className="text-white text-30 font-bold">{supplierName}</Text>
      </View>
      <View className="h-10  mt-2">
        {requestedDeliveryDate && (
          <Text className="text-30 font-bold uppercase">
            <Text className="text-primary lowercase text-30 font-bold">
              for
            </Text>{' '}
            {dayjs(requestedDeliveryDate).format('dddd')}
          </Text>
        )}
      </View>

      <ScrollView
        className="flex-1 mt-2"
        contentContainerStyle={styles.scrollViewContent}>
        <FormGroup>
          <Label required>Requested Delivery Date</Label>
          <DateInput
            defaultValue={requestedDeliveryDate}
            onChange={handleUpdateDeliveryDate}
          />
        </FormGroup>
        <FormGroup>
          <Label required>Comment</Label>
          <Input
            multiline={true}
            numberOfLines={10}
            placeholder={'e.g. Call me when reach'}
            textAlignVertical={'top'}
            className="h-[100px]"
            scrollEnabled={false}
            onChangeText={text => dispatch({remarks: text, render: true})}
          />
        </FormGroup>

        <Text className="text-20 text-primary font-bold mt-5">
          Order Summary
        </Text>
        {cartGroup?.cartItems?.map((item: any, index: number) => (
          <View
            className="flex-row items-center py-6 border-b border-gray-400"
            key={index}>
            <Text className="text-30 font-bold w-16 text-center">
              {item?.qty}
            </Text>
            <View className="flex-1">
              <Text className="font-bold">{item.name}</Text>
              <Text className="font-light mt-2">{item?.product?.uom}</Text>
            </View>
          </View>
        ))}
        <Text className="mt-6 font-bold">
          Estimated Order Total: {toCurrency(total, 'SGD')}
        </Text>
        <Text className="text-sm font-light mt-2">
          All prices to all products to see the estimated order total
        </Text>
      </ScrollView>

      <Button
        onPress={handleOrder}
        disabled={!requestedDeliveryDate || !remarks}>
        Tap to Order
      </Button>
    </Container>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 40,
  },
});
