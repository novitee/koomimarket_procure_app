import {View, Text, Image} from 'react-native';
import React from 'react';

export default function Avatar({
  url,
  name,
  size = 64,
}: {
  url?: string;
  name?: string;
  size?: number;
}) {
  const firstChar = (name || '').charAt(0);

  return (
    <View
      className="items-center justify-center rounded-full bg-gray-D4D4D8 overflow-hidden"
      style={{
        width: size,
        height: size,
      }}>
      {url ? (
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          source={{uri: url}}
          className="w-full h-full"
        />
      ) : (
        <Text className="text-36 font-bold">{firstChar}</Text>
      )}
    </View>
  );
}
