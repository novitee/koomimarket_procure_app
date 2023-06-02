import {View, TextInputProps, TextInput} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {styled} from 'nativewind';
import clsx from 'libs/clsx';

interface InputNumberProps extends Omit<TextInputProps, 'onChangeText'> {
  index: number;
  onChangeText?: (index: number, value: string) => void;
  focus?: boolean;
}

interface OtpInputProps {
  containerClassName?: string;
  onChange?: (value: string) => void;
}

const StyledInput = styled(
  TextInput,
  'h-[56px] w-10 text-24 text-center border border-gray-D1D5DB rounded-[12px] mx-1 font-inter',
);

function InputNumber({
  index,
  value,
  focus,
  onChangeText,
  onKeyPress,
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
      selectTextOnFocus
    />
  );
}

export default function OtpInput({
  containerClassName,
  onChange,
}: OtpInputProps) {
  const [optNumbers, setOptNumbers] = useState(Array(6).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const [isBackspace, setIsBackspace] = useState(false);

  function onKeyPress({nativeEvent}: any) {
    if (nativeEvent.key === 'Backspace') {
      setIsBackspace(true);
    } else {
      setIsBackspace(false);
    }
  }

  function onChangeText(index: number, value: string) {
    const _opt = [...optNumbers];
    _opt[index] = value;
    setOptNumbers(_opt);
    if (isBackspace) {
      if (index === 0) {
        setActiveInput(0);
      } else {
        setActiveInput(index - 1);
      }
    } else {
      if (index >= 5) {
        setActiveInput(5);
      } else {
        setActiveInput(index + 1);
      }
    }
    onChange?.(_opt.join(''));
  }
  return (
    <View
      className={clsx(
        {
          'flex-row justify-center': true,
        },
        containerClassName,
      )}>
      {optNumbers.map((item, index) => {
        return (
          <InputNumber
            key={index}
            index={index}
            value={item}
            focus={activeInput === index}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
          />
        );
      })}
    </View>
  );
}
