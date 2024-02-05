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
      if (qty === 0) {
        // setRemoveConfirm(id);
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
                  lineItems.map((lineItem, index) => {
                    return (
                      <View key={index}>
                        <LineItem
                          item={lineItem}
                          qty={lineItem.qty}
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
      </BottomSheet>
    </ClickOutSideProvider>
  );
}
