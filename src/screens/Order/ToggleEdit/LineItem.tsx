import React, {useCallback, useRef, memo} from 'react';
import Text from 'components/Text';
import {
  View,
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';
import {toCurrency} from 'utils/format';
import Counter from 'components/Counter';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TrashIcon from 'assets/images/trash.svg';
import colors from 'configs/colors';
import InfoIcon from 'assets/images/info.svg';
function LineItem({
  item,
  qty,
  handleChange,
  handleRemove,
  onPressPriceChange,
}: {
  item: any;
  qty: number;
  handleChange: (qty: number) => void;
  handleRemove?: () => void;
  onPressPriceChange: TouchableOpacityProps['onPress'];
}) {
  const swipeableRef = useRef<any>();
  const handlePressEdit = useCallback(
    (event: GestureResponderEvent) => {
      handleRemove?.();
      swipeableRef.current?.close();
    },
    [handleRemove, swipeableRef],
  );

  const {product} = item;
  const {allowDecimalQuantity, minOfQty, finalPricing, defaultPricing} =
    product;
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
            <TrashIcon color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const pricing = finalPricing?.pricing || defaultPricing?.pricing;
  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}>
        <View className="justify-between items-center flex-row  rounded-lg w-full py-5 px-5 border-b-2 border-[#9CA3AF] bg-white ">
          <View className="flex-shrink-1 w-1/2">
            <View className="flex-1 flex-row ">
              <Text className="text-sm font-bold mb-4">
                {item.name || item.productInfo?.name}
              </Text>
              {item?.product?.isSupplierUpdated && (
                <TouchableOpacity
                  className=" relative"
                  onPress={onPressPriceChange}>
                  <View className="absolute ml-2">
                    <InfoIcon className="w-4 h-4" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-primary font-medium mb-4">
              {`${toCurrency(item?.pricing, 'USD')}/${item.uom?.toUpperCase()}`}{' '}
            </Text>
            <Text className="text-primary font-medium">
              Original Quantity: {item.originalQty}
            </Text>
          </View>
          <Counter
            defaultValue={qty}
            onChange={handleChange}
            min={0}
            allowDecimal={allowDecimalQuantity}
            unit={item.uom?.toUpperCase()}
          />
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

export default memo(LineItem, (prevProps, nextProps) => {
  return prevProps.qty === nextProps.qty;
});
