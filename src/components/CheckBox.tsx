import clsx from 'libs/clsx';
import {styled} from 'nativewind';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from './Text';
import CheckIcon from 'assets/images/check.svg';
interface CheckBoxProps {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
}

const Label = styled(Text, 'ml-3 font-medium mt-0.5');
export default function CheckBox({
  label,
  labelClassName,
  containerClassName,
  defaultValue,
  onChange,
}: CheckBoxProps) {
  const [checked, setChecked] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue !== checked) {
      setChecked(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  function handleChange() {
    setChecked(!checked);
    onChange?.(!checked);
  }
  return (
    <View
      className={clsx(
        {
          'flex-row': true,
        },
        containerClassName,
      )}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleChange}
        className={clsx({
          'justify-center items-center w-6 h-6 rounded-md ': true,
          'border border-gray-300': !checked,
          'bg-primary': checked === true,
        })}>
        {checked ? <CheckIcon color="white" /> : <View />}
      </TouchableOpacity>
      <Label className={labelClassName}>{label}</Label>
    </View>
  );
}
