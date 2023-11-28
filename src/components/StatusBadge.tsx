import {View, ViewProps} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import Text from './Text';
import {ORDER_STATUS} from 'utils/constants';
interface StatusBadgeProps extends ViewProps {
  status?: string;
}

const convertStatus = (status: string | undefined) => {
  let result = Object.keys(ORDER_STATUS).find(key => {
    return ORDER_STATUS[key] === status;
  });
  if (!result) return '';
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
};
const StyledView = styled(
  View,
  'px-2 py-2 flex-row items-center justify-center self-start border rounded-lg',
);

const colors: Record<string, string> = {
  '': '#374151',
  SUBMITTED: '#374151',
  COMPLETED: '#16D66E',
  RESOLVED: '#16D66E',
  CANCELED: '#EF4444',
  ACKNOWLEDGED: '#f97315',
  RESOLVING: '#EAB308',
  PACKED: '#f97315',
};

export default function StatusBadge({status, ...props}: StatusBadgeProps) {
  return (
    <StyledView
      {...props}
      style={{
        borderColor: colors[status || ''],
      }}>
      <View
        className="rounded-full w-4 h-4"
        style={{
          backgroundColor: colors[status || ''],
        }}
      />
      <Text
        className="ml-2 text-14 font-semibold"
        style={{color: colors[status || '']}}>
        {status === 'PACKED'
          ? 'CONFIRMED'
          : status === 'RESOLVED'
          ? 'COMPLETE'
          : convertStatus(status).toUpperCase()}
      </Text>
    </StyledView>
  );
}
