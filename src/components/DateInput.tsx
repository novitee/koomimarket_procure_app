import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import DatePicker, {DatePickerProps} from './DatePicker';
import dayjs from 'dayjs';
import CalendarIcon from 'assets/images/calendar_2.svg';
import clsx from 'libs/clsx';

interface DateInputProps extends DatePickerProps {
  onChange?: (date: Date) => void;
}
export default function DateInput({
  defaultValue,
  headerTitle,
  onChange,
  ...props
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(defaultValue);
  function handleConfirm(newDate: Date) {
    setDate(newDate);
    setIsOpen(false);
    onChange?.(newDate);
  }
  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="h-[50px] bg-white flex-row relative justify-between items-center px-4 border border-gray-300 rounded">
        <Text
          className={clsx({
            'text-gray-D1D5DB': !date,
          })}>
          {date ? dayjs(date).format('DD/MM/YYYY (dddd)') : 'Date'}
        </Text>
        <CalendarIcon />
      </TouchableOpacity>
      <DatePicker
        {...props}
        onConfirm={handleConfirm}
        defaultValue={date}
        headerTitle={headerTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </View>
  );
}
