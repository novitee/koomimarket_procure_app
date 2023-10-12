import {FlatList, View} from 'react-native';
import React, {useCallback, useMemo, useReducer, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import Button from 'components/Button';
import YesNoCheckBox from 'components/YesNoCheckBox';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
function LineItem({
  item,
  onCheck,
}: {
  item: any;
  onCheck?: (value: string) => void;
}) {
  const {name, qty, uom, deliveryCheck} = item || {};
  const deliveryCheckReason =
    deliveryCheck?.status === 'TROUBLED' && deliveryCheck?.reason;
  const value = deliveryCheck?.status
    ? deliveryCheck?.status === 'TROUBLED'
      ? 'no'
      : 'yes'
    : undefined;
  return (
    <View className="flex-row items-center py-6 border-b border-gray-400">
      <Text className="text-30 font-bold w-16 text-center">{qty}</Text>
      <View className="flex-1">
        <Text className="font-bold">{name}</Text>
        <Text className="font-light mt-2">{uom}</Text>
        {deliveryCheckReason && (
          <Text className="font-medium text-error mt-2">{`Issue: ${deliveryCheckReason}`}</Text>
        )}
      </View>
      <YesNoCheckBox value={value} onChange={onCheck} />
    </View>
  );
}
export default function GoodsReceivingScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {orderNo, lineItems} = route.params || {};
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    lineItemData: lineItems.map((item: any) => ({
      ...item,
      deliveryCheck: {
        ...(item.deliveryCheck || {}),
        status: item.deliveryCheck?.status || 'NOTHING',
      },
    })),
  });

  const [{}, checkGoodsReceived] = useMutation({
    url: `orders/${orderNo}/delivery-check`,
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

  const {lineItemData} = values;

  const handleUpdateIssue = useCallback((newItem: any, lineItemData: any) => {
    const itemIndex = lineItemData.findIndex(
      (item: any) => item.id === newItem.id,
    );
    const newLineItemData = [...lineItemData];
    newLineItemData[itemIndex] = newItem;
    dispatch({lineItemData: newLineItemData, render: true});
  }, []);

  const handleCheckProduct = useCallback(
    (item: any, value: string) => {
      if (value === 'no') {
        navigation.navigate('GoodsReceivingIssue', {
          lineItem: {
            ...item,
            deliveryCheck: {
              status: 'TROUBLED',
            },
          },
          onUpdateIssue: (newItem: any) =>
            handleUpdateIssue(newItem, lineItemData),
        });
      } else if (value === 'yes') {
        const itemIndex = lineItemData.findIndex(
          (lineItem: any) => item.id === lineItem.id,
        );
        const newLineItemData = [...lineItemData];
        newLineItemData[itemIndex].status = null;
        newLineItemData[itemIndex].deliveryCheck = {
          status: 'NOTHING',
        };
        dispatch({lineItemData: newLineItemData, render: true});
      }
    },
    [navigation, lineItemData],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <LineItem
          item={item}
          onCheck={value => handleCheckProduct(item, value)}
        />
      );
    },
    [handleCheckProduct],
  );

  const numOfChecked = useMemo(() => {
    return lineItemData.filter(
      (item: any) => typeof item.deliveryCheck !== 'undefined',
    ).length;
  }, [lineItemData]);

  const markAllAsGood = useCallback((lineItems: any) => {
    const newLineItemData = [...lineItems].map((item: any) => ({
      ...item,
      deliveryCheck: {
        status: 'NOTHING',
      },
    }));
    dispatch({lineItemData: newLineItemData, render: true});
  }, []);

  const markTheRestAsGood = useCallback((lineItems: any) => {
    const newLineItemData = [...lineItems].map((item: any) => {
      if (typeof item.deliveryCheck === 'undefined') {
        return {
          ...item,
          deliveryCheck: {
            status: 'NOTHING',
          },
        };
      }
      return item;
    });
    dispatch({lineItemData: newLineItemData, render: true});
  }, []);

  const convertLineItemsToParams = useCallback((lineItems: any) => {
    return lineItems.map((item: any) => ({
      id: item.id,
      deliveryCheck: item.deliveryCheck,
    }));
  }, []);

  const isAllGood = useCallback((lineItems: any) => {
    return lineItems.every((item: any) => {
      return item?.deliveryCheck?.status === 'NOTHING';
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    let lineItemParams = convertLineItemsToParams(lineItemData);

    const response = await checkGoodsReceived({lineItems: lineItemParams});
    const {data, success, error, message} = response || {};

    if (!success) {
      Toast.show("Couldn't update the delivery status", Toast.LONG);
      return;
    }
    navigation.navigate('GoodsReceivingDone', {
      isAllGood: isAllGood(lineItemData),
    });
  }, [lineItemData, navigation]);

  return (
    <Container>
      <Text className="text-primary font-bold text-xl">Products</Text>
      <FlatList
        className="flex-1"
        data={lineItemData}
        extraData={lineItemData}
        renderItem={_renderItem}
      />
      {numOfChecked === 0 && (
        <Button onPress={() => markAllAsGood(lineItemData)}>
          Mark all as good
        </Button>
      )}
      {numOfChecked > 0 && numOfChecked < lineItemData.length && (
        <Button onPress={() => markTheRestAsGood(lineItemData)}>
          Mark the rest as good
        </Button>
      )}
      {numOfChecked === lineItemData.length && (
        <Button onPress={handleConfirm}>{'Confirm'}</Button>
      )}
    </Container>
  );
}
