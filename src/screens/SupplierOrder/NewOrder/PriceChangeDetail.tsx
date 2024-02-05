import React from 'react';
import Text from 'components/Text';
import {View} from 'react-native';
import Button from 'components/Button';
import BottomSheet from 'components/BottomSheet';

import {toCurrency} from 'utils/format';
export default function PriceChangeDetail({
  isOpen,
  product,
  onClose,
}: {
  isOpen: boolean;
  product: any;
  onClose: (refresh?: boolean) => void;
}) {
  return (
    <BottomSheet isOpen={isOpen} contentHeight={300}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className=" pb-5 ">
            <Text className="text-primary font-semibold text-xl text-center">
              Price Update
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold">
              Supplier has updated the pricing
            </Text>
            <View className="flex-1 flex-row mt-3">
              <Text className="">
                {toCurrency(product?.oldPricing, 'SGD')} / {product?.uom} to{' '}
              </Text>
              <Text className="text-primary">
                {toCurrency(product?.pricing, 'SGD')} / {product?.uom}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row">
          <Button onPress={onClose} className="flex-1 ml-2">
            Got It
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
