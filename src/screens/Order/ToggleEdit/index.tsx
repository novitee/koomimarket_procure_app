import React, {useCallback, useEffect, useState} from 'react';
import Text from 'components/Text';
import {ScrollView, View} from 'react-native';
import Button from 'components/Button';
import BottomSheet from 'components/BottomSheet';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {ClickOutSideProvider} from 'components/ClickOutside';
import LineItem from './LineItem';
import RemoveConfirm from './RemoveConfirm';
import PriceChangeDetail from './PriceChangeDetail';
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
  const [openPriceChangeItem, setPriceChangeItem] = useState<any>(null);
  const [removeConfirmId, setRemoveConfirm] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      setLineItems(
        order?.lineItems.map((item: any) => ({
          ...item,
          originalQty: item.qty,
        })),
      );
    }
  }, [isOpen]);
  const [{loading}, requestEditOrder] = useMutation({
    url: `orders/${order?.orderNo}/request-edit`,
  });

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
      // if (qty === 0) {
      //   handleRemoveItem(id);
      //   return;
      // }
      newLineItems[index].qty = qty;
      setLineItems(newLineItems);
    }
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  return (
    <ClickOutSideProvider>
      <BottomSheet isOpen={isOpen} contentHeight={570} onClose={onClose}>
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
                  lineItems.map(lineItem => {
                    return (
                      <View key={lineItem.id}>
                        <LineItem
                          item={lineItem}
                          qty={lineItem.qty}
                          handleChange={(qty: number) =>
                            handleChangeItem(lineItem.id, qty)
                          }
                          handleRemove={() => handleRemoveItem(lineItem.id)}
                          onPressPriceChange={() =>
                            setPriceChangeItem(lineItem)
                          }
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
        <RemoveConfirm
          isOpen={!!removeConfirmId}
          onClose={() => setRemoveConfirm(null)}
          onConfirm={() => {
            if (removeConfirmId) {
              handleRemoveItem(removeConfirmId);
              setRemoveConfirm(null);
            }
          }}
        />
        <PriceChangeDetail
          isOpen={!!openPriceChangeItem}
          // product={openPriceChangeItem?.product}
          item={openPriceChangeItem}
          onClose={() => setPriceChangeItem(null)}
        />
      </BottomSheet>
    </ClickOutSideProvider>
  );
}
