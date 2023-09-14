import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Input from './Input';
import PlusIcon from 'assets/images/plus.svg';
import MinusIcon from 'assets/images/minus.svg';
import colors from 'configs/colors';
interface CounterProps {
  defaultValue: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
}

function Counter({defaultValue, onChange, max, min = 1}: CounterProps) {
  const [value, setValue] = useState(Math.max(defaultValue || min, min));

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(Math.max(defaultValue || min, min));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  function handleIncrease() {
    let newAmount = parseInt((value || min).toString(), 10) + 1;
    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount);
    onChange(newAmount);
  }

  function handleDecrease() {
    if (value === min) {
      return;
    }
    let newAmount = parseInt((value || min).toString(), 10) - 1;
    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount);
    onChange(newAmount);
  }

  function handleChange(v: string) {
    let newAmount = parseInt((v || min).toString(), 10);
    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount);
    onChange(newAmount);
  }

  return (
    <View className="flex-row items-center border border-gray-300 rounded h-[60px]">
      <TouchableOpacity
        className="flex-row items-center justify-center w-10 h-full "
        onPress={handleDecrease}>
        <MinusIcon />
      </TouchableOpacity>
      <Input
        value={value.toString()}
        onChangeText={handleChange}
        style={{width: Math.max(50, value.toString().length * 16 + 8)}}
        inputClassName="text-center px-0"
        className="rounded-none border-y-0 h-full"
        keyboardType="decimal-pad"
      />

      <TouchableOpacity
        className="flex-row items-center justify-center w-10  h-full"
        onPress={handleIncrease}>
        <PlusIcon
          width={24}
          height={24}
          color={colors.primary.DEFAULT}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
}

export default Counter;
