import {View, ViewProps} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import Text from './Text';

interface StatusBadgeProps extends ViewProps {
  status?: string;
}

const StyledView = styled(
  View,
  'px-3 py-2 flex-row items-center justify-center self-start border rounded',
);

const colors: Record<string, string> = {
  '': '#374151',
  SENT: '#374151',
  CONFIRMED: '#16D66E',
  CANCELLED: '#EF4444',
  ISSUE: '#EAB308',
};

export default function StatusBadge({status, ...props}: StatusBadgeProps) {
  return (
    <StyledView {...props} style={{borderColor: colors[status || '']}}>
      <View
        className="rounded-full w-2.5 h-2.5"
        style={{backgroundColor: colors[status || '']}}
      />
      <Text
        className="ml-2 text-14 font-semibold"
        style={{color: colors[status || '']}}>
        {status}
      </Text>
    </StyledView>
  );
}
