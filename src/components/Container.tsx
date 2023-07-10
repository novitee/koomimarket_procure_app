import {SafeAreaView, View, ViewProps} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';

const StyledView = styled(View, 'flex-1 p-5 bg-white');
const StyledSafeAreaView = styled(SafeAreaView, 'flex-1 bg-white');
export default function Container({
  children,
  containerClassName,
  ...props
}: ViewProps & {containerClassName?: string}) {
  return (
    <StyledSafeAreaView className={containerClassName}>
      <StyledView {...props}>{children}</StyledView>
    </StyledSafeAreaView>
  );
}
