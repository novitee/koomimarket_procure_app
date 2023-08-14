import clsx from 'libs/clsx';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import CheckYesIcon from 'assets/images/check_yes.svg';
import CheckYesActiveIcon from 'assets/images/check_yes_active.svg';
import CheckNoIcon from 'assets/images/check_no.svg';
import CheckNoActiveIcon from 'assets/images/check_no_active.svg';

interface YesNoCheckBoxProps {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  value?: string | null;
  onChange?: (value: string) => void;
}

export default function YesNoCheckBox({
  containerClassName,
  value,
  onChange,
}: YesNoCheckBoxProps) {
  function handleChange(newValue: string) {
    // setValue(newValue);
    onChange?.(newValue);
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
        onPress={() => handleChange('no')}
        className={clsx({
          'justify-center items-center w-10 h-10 rounded-full': true,
        })}>
        {value === 'no' ? <CheckNoActiveIcon /> : <CheckNoIcon />}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => handleChange('yes')}
        className={clsx({
          'justify-center items-center w-10 h-10 rounded-full ml-3': true,
        })}>
        {value === 'yes' ? <CheckYesActiveIcon /> : <CheckYesIcon />}
      </TouchableOpacity>
    </View>
  );
}
