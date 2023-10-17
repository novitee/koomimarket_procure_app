import {View, TextInputProps, TextInput} from 'react-native';
import React, {useLayoutEffect, useRef, useState, useReducer} from 'react';
import {styled} from 'nativewind';
import clsx from 'libs/clsx';
import colors from 'configs/colors';

interface InputNumberProps extends Omit<TextInputProps, 'onChangeText'> {
  index: number;
  onChangeText?: (index: number, value: string) => void;
  focus?: boolean;
  onFocus?: any;
}

interface OtpInputProps {
  containerClassName?: string;
  onChange?: (value: string) => void;
}

const StyledInput = styled(
  TextInput,
  'h-[56px] w-10 text-24 text-center border border-gray-D1D5DB rounded-[12px] mx-1 font-inter text-dark',
);

function InputNumber({
  index,
  value,
  focus,
  onChangeText,
  onKeyPress,
  onFocus,
}: InputNumberProps) {
  const inputRef = useRef<any>();

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus) {
        inputRef.current.focus();
      }
    }
  }, [focus]);

  return (
    <StyledInput
      ref={inputRef}
      value={value}
      keyboardType="number-pad"
      maxLength={1}
      onChangeText={text => onChangeText?.(index, text)}
      onKeyPress={onKeyPress}
      cursorColor={colors.dark}
      placeholderTextColor={colors.gray.D1D5DB}
      selectionColor={colors.dark}
      onFocus={() => onFocus?.(index)}
    />
  );
}

export default function OtpInput({
  containerClassName,
  onChange,
}: OtpInputProps) {
  const [values, dispatch] = useReducer(
    (prev: any, next: any) => ({...prev, ...next}),
    {
      optNumbers: Array(6).fill(''),
      activeInput: 0,
      isBackspace: false,
    },
  );
  const {optNumbers, activeInput, isBackspace} = values;

  const onRemoveOTP = (index: number, value: string) => {
    if (index < 0 || index >= optNumbers.length) return {};
    let activeInput = index - 1;
    if (activeInput < 0) {
      activeInput = 0;
    }
    return {
      optNumbers: optNumbers.map((_: string, i: number) =>
        i === index ? value : _,
      ),
      activeInput,
    };
  };

  const onAddOTP = (index: number, value: string) => {
    if (index < 0 || index >= optNumbers.length) return {};

    let activeInput = index + 1;
    if (activeInput >= optNumbers.length) {
      activeInput = optNumbers.length - 1;
    }
    if (index < 0 || index >= optNumbers.length) return {};

    return {
      optNumbers: optNumbers.map((_: string, i: number) =>
        i === index ? value : _,
      ),
      activeInput,
    };
  };

  function onKeyPress({nativeEvent}: any) {
    let changeFields = {
      isBackspace: nativeEvent.key === 'Backspace',
    };
    if (changeFields.isBackspace) {
      if (!!optNumbers[activeInput]) {
        changeFields = {
          ...changeFields,
          ...onRemoveOTP(activeInput, ''),
        };
      } else {
        changeFields = {
          ...changeFields,
          ...{activeInput: activeInput === 0 ? 0 : activeInput - 1},
        };
      }
    } else {
      changeFields = {
        ...changeFields,
        ...onAddOTP(activeInput, nativeEvent.key),
      };
    }
    dispatch(changeFields);
  }

  function onChangeText(index: number, value: string) {
    if (!isBackspace) {
      dispatch(onAddOTP(index, value));
    }

    onChange?.(optNumbers.join(''));
  }

  function onFocused(index: number) {
    dispatch({activeInput: index});
  }

  return (
    <View
      className={clsx(
        {
          'flex-row justify-center': true,
        },
        containerClassName,
      )}>
      {optNumbers.map((item: any, index: number) => {
        return (
          <InputNumber
            key={index}
            index={index}
            value={item}
            focus={activeInput === index}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            onFocus={onFocused}
          />
        );
      })}
    </View>
  );
}
