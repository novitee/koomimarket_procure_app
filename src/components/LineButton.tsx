import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';
import colors from 'configs/colors';
export default function LineButton({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode | string;
  onPress?: TouchableOpacityProps['onPress'];
  style?: TouchableOpacityProps['style'];
  className?: TouchableOpacityProps['className'];
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className="flex-row items-center justify-between px-5 py-2 border-b border-gray-D4D4D8">
      {typeof children === 'string' ? (
        <Text className="text-primary text-lg font-bold">{children}</Text>
      ) : (
        children
      )}
      <ChevronRightIcon color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  );
}
