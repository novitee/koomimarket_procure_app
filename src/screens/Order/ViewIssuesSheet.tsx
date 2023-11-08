import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import {REASON_OPTIONS} from 'utils/constants';
export default function ViewIssuesSheet({
  isOpen,
  onCancel,
  selectedItem,
}: {
  isOpen: boolean;
  onCancel: (refresh?: boolean) => void;
  selectedItem?: any;
}) {
  const {name, qty, uom, deliveryCheck} = selectedItem || {};
  const {reason, photos, requestTroubleQuantity, comment} = deliveryCheck || {};
  const reason_option = REASON_OPTIONS.find(r => r.value === reason);
  return (
    <BottomSheet isOpen={isOpen} contentHeight={650} onClose={onCancel}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-3">
            <Text className="text-primary font-semibold text-xl text-center">
              {'View Issues'}
            </Text>
          </View>
          <ScrollView className="flex-1 mt-5">
            <View className="flex-row items-center py-6 border-b bg-gray-100 border-gray-400">
              <Text className="text-30 font-bold w-16 text-center">{qty}</Text>
              <View className="flex-1">
                <Text className="font-bold">{name}</Text>
                <Text className="font-light mt-2">{uom}</Text>
                <Text className="text-error mt-2">{reason_option?.name}</Text>
              </View>
            </View>
            {comment && (
              <View className="flex-1 mt-4">
                <Text className="font-bold">Comment</Text>
                <Text className="font-light mt-2">{comment}</Text>
              </View>
            )}
            {requestTroubleQuantity && (
              <View className="flex-1 mt-4">
                <Text className="font-bold">
                  {reason_option?.id === 2
                    ? 'No. of items with wrong quantity'
                    : 'No. of poor quality items'}
                </Text>
                <Text className="font-light mt-2">
                  {requestTroubleQuantity} {uom}
                </Text>
              </View>
            )}
            {photos && photos.length > 0 && (
              <View className="flex-1 mt-4">
                <Text className="font-bold">Photo</Text>
                <View className="flex-row w-full flex-wrap pt-3 gap-4">
                  {(photos || []).map((photo: any, index: number) => (
                    <View key={index} className="">
                      <Image
                        source={{uri: photo?.url}}
                        resizeMode="cover"
                        resizeMethod="scale"
                        className="w-32 h-32 rounded-lg bg-slate-200"
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        <View className="flex-row">
          <Button onPress={() => onCancel()} className="flex-1">
            Close
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
