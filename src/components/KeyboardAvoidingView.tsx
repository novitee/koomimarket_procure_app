import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
const StyledView = styled(RNKeyboardAvoidingView, 'flex-1');

export default function KeyboardAvoidingView({
  children,
  ...props
}: KeyboardAvoidingViewProps) {
  return (
    <StyledView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 35 : 70}
      {...props}>
      {children}
    </StyledView>
  );
}
