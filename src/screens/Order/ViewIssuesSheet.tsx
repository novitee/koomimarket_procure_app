import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';

export default function ViewIssuesSheet({
  isOpen,
  onCancel,
  selectedItem,
}: {
  isOpen: boolean;
  onCancel: (refresh?: boolean) => void;
  selectedItem?: any;
}) {
  const {photos, name, qty, uom} = selectedItem || {};
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
                <Text className="text-error mt-2">Show reason here</Text>
              </View>
            </View>
            <View className="flex-1 mt-4">
              <Text className="font-bold">No. of poor quality items</Text>
              <Text className="font-light mt-2">1 KG</Text>
            </View>
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
