import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import dayjs from 'dayjs';
import CalendarIcon from 'assets/images/calendar_2.svg';
import clsx from 'libs/clsx';
import useNavigation from 'hooks/useNavigation';

interface CalendarInputProps {
  onChange?: (date: string) => void;
  minimumDate?: string;
  maximumDate?: string;
  defaultValue?: string;
  headerTitle?: string;
}
export default function CalendarInput({
  defaultValue,
  headerTitle,
  minimumDate,
  maximumDate,
  onChange,
}: CalendarInputProps) {
  const {navigate} = useNavigation();
  const [date, setDate] = useState(defaultValue);

  function openCalendarScreen() {
    navigate('CalendarListScreen', {
      onSelectDay: (selectedDate: any) => {
        setDate(selectedDate);
        onChange?.(selectedDate);
      },
      initialDate: date,
      minimumDate,
      maximumDate,
      headerTitle,
    });
  }
  return (
    <View>
      <TouchableOpacity
        onPress={openCalendarScreen}
        className="h-[50px] bg-white flex-row relative justify-between items-center px-4 border border-gray-300 rounded">
        <Text
          className={clsx({
            'text-gray-D1D5DB': !date,
          })}>
          {date ? dayjs(date).format('DD/MM/YYYY (dddd)') : 'Date'}
        </Text>
        <CalendarIcon />
      </TouchableOpacity>
    </View>
  );
}
