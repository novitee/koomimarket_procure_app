import colors from 'configs/colors';
import clsx from 'libs/clsx';
import {styled} from 'nativewind';
import React from 'react';
import {TextInput as RNTextInput, TextInputProps, View} from 'react-native';

const StyledTextInput = styled(
  RNTextInput,
  'font-inter text-dark px-4 text-16 flex-1 h-full py-3 ',
);

const StyledContainerView = styled(
  View,
  'h-[50px] bg-white flex-row relative border border-gray-300 rounded',
);

export interface RNTextInputProps extends TextInputProps {
  EndComponent?: () => JSX.Element | JSX.Element;
  StartComponent?: () => JSX.Element | JSX.Element;
  inputClassName?: string;
  inputType?: 'text' | 'amount';
  decimalPlaces?: number;
  error?: boolean;
}

export default function Input({
  EndComponent,
  StartComponent,
  inputClassName,
  style,
  onChangeText,
  error,
  ...props
}: RNTextInputProps): JSX.Element {
  return (
    <StyledContainerView
      style={style}
      className={clsx({
        'bg-gray-EEF3FD/50': props.editable === false,
        'border-red-500': !!error,
      })}>
      {StartComponent && <StartComponent />}
      <StyledTextInput
        {...props}
        onChangeText={onChangeText}
        placeholderTextColor={colors.gray.D1D5DB}
        selectionColor={colors.dark}
        className={clsx(
          {
            'text-gray-500': props.editable === false,
          },
          inputClassName,
        )}
      />
      {EndComponent && <EndComponent />}
    </StyledContainerView>
  );
}
