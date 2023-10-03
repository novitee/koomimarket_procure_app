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

function isNumber(value: string): boolean {
  return !isNaN(parseInt(value, 10)) && value[value.length - 1] !== '.';
}

function parsePrecision(value: number): number {
  return Math.round(value * 100) / 100;
}
function Counter({defaultValue, onChange, max, min = 0}: CounterProps) {
  const [value, setValue] = useState(
    Math.max(defaultValue || min, min).toString(),
  );

  useEffect(() => {
    if (parseFloat(value) !== parseFloat(defaultValue.toString())) {
      setValue(Math.max(defaultValue || min, min).toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  function handleIncrease() {
    let newAmount = parseFloat((value || min).toString()) + 1;
    newAmount = parsePrecision(newAmount);

    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount.toString());
    onChange(newAmount);
  }

  function handleDecrease() {
    let newAmount = parseFloat((value || min).toString()) - 1;
    newAmount = parsePrecision(newAmount);
    if (newAmount <= min) {
      return;
    }
    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount.toString());
    onChange(newAmount);
  }

  function handleChange(v: string) {
    if (!isNumber(v)) {
      setValue(v);
      return;
    }
    let newAmount = parseFloat((v || min).toString());
    newAmount = parsePrecision(newAmount);

    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount.toString());
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
        style={{width: Math.max(60, value.toString().length * 16 + 8)}}
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
