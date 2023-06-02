import Text from 'components/Text';
import {styled} from 'nativewind';
import {TextProps} from 'react-native';
import React from 'react';

const StyledText = styled(Text, 'font-semibold mb-2');

export default function Label({
  children,
  required,
  ...props
}: TextProps & {required?: boolean}) {
  return (
    <StyledText {...props}>
      {children}
      {required && <Text className="text-primary-600"> *</Text>}
    </StyledText>
  );
}
