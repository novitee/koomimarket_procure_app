import React, {useCallback, useEffect, useState, useRef} from 'react';
import Text from 'components/Text';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import Button from 'components/Button';
import BottomSheet from 'components/BottomSheet';
import {toCurrency} from 'utils/format';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import Counter from 'components/Counter';
import useMutation from 'libs/swr/useMutation';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import EditIcon from 'assets/images/edit.svg';
import colors from 'configs/colors';
import Toast from 'react-native-simple-toast';
import {useClickOutSide, ClickOutSideProvider} from 'components/ClickOutside';
export default function ToggleEditOrder({
  isOpen,
  order,
  onClose,
}: {
  isOpen: boolean;
  order: any;
  onClose: () => void;
}) {
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    if (order?.lineItems && isOpen) {
      setLineItems(
        order?.lineItems.map((item: any) => ({
          ...item,
          originalQty: item.qty,
        })),
      );
    }
  }, [order, isOpen]);
  const [{loading}, requestEditOrder] = useMutation({
    url: `orders/${order?.orderNo}/request-edit`,
  });
  const bottomSheetRef = useRef<any>(null);

  const handleUpdate = async () => {
    if (lineItems.every(item => item.qty === item.originalQty)) {
      onClose();
    }
    try {
      const response = await requestEditOrder({
        request: {
          lineItems: lineItems.map(item => ({
            id: item.id,
            qty: item.qty,
          })),
        },
      });
      const {success, error, message} = response;
      if (success) {
        onClose();
      } else {
        Toast.show(error.message || message, Toast.LONG);
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const handleChangeItem = (id: string, qty: number) => {
    const newLineItems = [...lineItems];
    const index = newLineItems.findIndex(item => item.id === id);
    if (index > -1) {
      if (qty === 0) {
        handleRemoveItem(id);
        return;
      }
      newLineItems[index].qty = qty;
      setLineItems(newLineItems);
    }
  };

  const handleRemoveItem = (id: string) => {
    const newLineItems = [...lineItems];
    const index = newLineItems.findIndex(item => item.id === id);
    if (index > -1) {
      newLineItems.splice(index, 1);
      setLineItems(newLineItems);
    }
  };

  return (
    <ClickOutSideProvider>
      <BottomSheet
        ref={bottomSheetRef}
        isOpen={isOpen}
        contentHeight={570}
        onClose={onClose}>
        <View className="pb-10 pt-5 flex-1">
          <View className="flex-1">
            <View className=" pb-5 mx-5">
              <Text className="text-primary font-semibold text-xl text-center">
                Request to Edit Order
              </Text>
            </View>
            <KeyboardAvoidingView>
              <ScrollView className="flex-1 mb-4 ">
                {lineItems.length > 0 ? (
                  lineItems.map((lineItem, index) => {
                    return (
                      <View key={index}>
                        <ProductItem
                          item={lineItem}
                          handleChange={(qty: number) =>
                            handleChangeItem(lineItem.id, qty)
                          }
                          handleRemove={() => handleRemoveItem(lineItem.id)}
                        />
                      </View>
                    );
                  })
                ) : (
                  <View className="flex-1 justify-center items-center px-5">
                    <Text className="font-bold mt-4 text-center">
                      No item to edit
                    </Text>
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          <View className="flex-row px-5">
            <Button
              loading={loading}
              disabled={
                lineItems.length === 0 ||
                lineItems.every(item => item.qty === item.originalQty)
              }
              onPress={handleUpdate}
              className="flex-1 ml-2">
              Send Request
            </Button>
          </View>
        </View>
      </BottomSheet>
    </ClickOutSideProvider>
  );
}
function ProductItem({
  item,
  handleChange,
  handleRemove,
}: {
  item: any;
  handleChange: (qty: number) => void;
  handleRemove?: () => void;
}) {
  const swipeableRef = useRef<any>();
  const handlePressEdit = useCallback(
    (event: GestureResponderEvent) => {
      handleRemove?.();
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    },
    [handleRemove, swipeableRef],
  );

  const {product} = item;
  const {allowDecimalQuantity, minOfQty} = product;
  const renderRightActions = (progress: any) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [64, 0],
    });
    return (
      <View className="h-full  bg-primary">
        <Animated.View
          className={
            'flex-1 w-[100px] items-center bg-primary justify-center h-full'
          }
          style={{transform: [{translateX: trans}]}}>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            onPress={handlePressEdit}>
            <EditIcon color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}>
        <View className="justify-between items-center flex-row  rounded-lg w-full py-5 px-5 border-b-2 border-[#9CA3AF] bg-white ">
          <View className="flex-shrink-1 w-1/2">
            <Text className="text-sm font-bold mb-4">{item.name}</Text>
            <Text className="text-primary font-medium mb-4">
              {`${toCurrency(item.pricing, 'USD')}/${item.uom?.toUpperCase()}`}{' '}
            </Text>
            <Text className="text-primary font-medium">
              Original Quantity: {item.originalQty}
            </Text>
          </View>
          <Counter
            defaultValue={item?.qty}
            onChange={handleChange}
            min={minOfQty || 0}
            allowDecimal={allowDecimalQuantity}
            unit={item.uom?.toUpperCase()}
          />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
