import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Input from './Input';
import PlusIcon from 'assets/images/plus.svg';
import MinusIcon from 'assets/images/minus.svg';
import colors from 'configs/colors';
import Text from './Text';
import {isDecimal, isNumber} from 'utils/validate';
interface CounterProps {
  defaultValue: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  allowDecimal?: boolean;
  unit?: string;
}

function parsePrecision(value: number): number {
  return Math.round(value * 100) / 100;
}

function isValidTypeNumber(v: string, allowDecimal: boolean): boolean {
  return (allowDecimal && isDecimal(v)) || (!allowDecimal && isNumber(v));
}

function Counter({
  defaultValue,
  onChange,
  max,
  min = 0,
  allowDecimal = false,
  unit,
}: CounterProps) {
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
      newAmount = min;
    }
    if (max && newAmount > max) {
      newAmount = max;
    }
    setValue(newAmount.toString());
    onChange(newAmount);
  }

  function handleChange(v: string) {
    if (v === '') {
      setValue(min.toString());
      onChange(min);
      return;
    } else if (!isValidTypeNumber(v, allowDecimal)) {
      setValue(value);
      return;
    } else if (/^\d+\.$/.test(v) && allowDecimal) {
      setValue(v);
      return;
    } else {
      let newAmount = parseFloat((v || min).toString());
      newAmount = parsePrecision(newAmount);

      if (max && newAmount > max) {
        newAmount = max;
      }
      setValue(newAmount.toString());
      onChange(newAmount);
    }
  }

  return (
    <View className="flex-row items-center border border-gray-300 rounded h-[60px]">
      <TouchableOpacity
        className="flex-row items-center justify-center w-10 h-full "
        onPress={handleDecrease}>
        <MinusIcon />
      </TouchableOpacity>
      <View className="h-full items-center border-gray-300 border-x py-1">
        <Input
          value={value.toString()}
          onChangeText={handleChange}
          style={{width: Math.max(60, value.toString().length * 16 + 8)}}
          inputClassName="text-center px-0 py-0"
          className="rounded-none border-0 flex-1 "
          keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
          enablesReturnKeyAutomatically
          returnKeyType="done"
          onBlur={() => {
            if (allowDecimal) {
              const v = parsePrecision(parseFloat(value));
              handleChange(v.toString());
            }
          }}
        />
        {!!unit && <Text className="text-xs text-gray-400">{unit}</Text>}
      </View>

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
