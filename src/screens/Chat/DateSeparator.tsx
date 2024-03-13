import {View, Text} from 'react-native';
import React from 'react';
import {toChatDateTime} from 'utils/format';

export default function DateSeparator({
  dateTime,
}: {
  dateTime: Date | string | number;
}) {
  return (
    <View className="flex-row w-full justify-center py-6">
      <View className="p-2 bg-primary-50 rounded">
        <Text className=" uppercase text-sm">
          {toChatDateTime(dateTime, true)}
        </Text>
      </View>
    </View>
  );
}
