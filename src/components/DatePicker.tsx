import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import BottomSheet from './BottomSheet';
import RNDatePicker from 'react-native-date-picker';
import Text from './Text';

export interface DatePickerProps {
  isOpen?: boolean;
  onClose?: () => void;
  headerTitle?: string;
  defaultValue?: Date;
  onConfirm?: (date: Date) => void;
}

export default function DatePicker({
  isOpen,
  onClose,
  headerTitle,
  defaultValue,
  onConfirm,
}: DatePickerProps) {
  const [date, setDate] = useState(
    defaultValue ? dayjs(defaultValue).toDate() : new Date(),
  );
  useEffect(() => {
    if (defaultValue && defaultValue !== date) {
      setDate(dayjs(defaultValue).toDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} contentHeight={350}>
      <View>
        <View className="flex-row justify-between py-4 px-5 border-b-2 border-gray-E5">
          <TouchableOpacity hitSlop={10} onPress={onClose}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          {!!headerTitle && <Text className="font-medium">{headerTitle}</Text>}

          <TouchableOpacity hitSlop={10} onPress={() => onConfirm?.(date)}>
            <Text className="text-primary-559BD1">Select</Text>
          </TouchableOpacity>
        </View>
        <View style={{zIndex: 100000}}>
          <RNDatePicker
            mode="date"
            className="w-full"
            textColor="#000000"
            date={date}
            onDateChange={setDate}
            androidVariant="nativeAndroid"
          />
        </View>
      </View>
    </BottomSheet>
  );
}
