import {View, ViewProps} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';

const StyledView = styled(View, 'mb-4');
export default function FormGroup({
  children,
  ...props
}: ViewProps & {containerClassName?: string}) {
  return <StyledView {...props}>{children}</StyledView>;
}
