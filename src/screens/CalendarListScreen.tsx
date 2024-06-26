import {NativeStackScreenProps} from '@react-navigation/native-stack';
import colors from 'configs/colors';
import dayjs from 'dayjs';
import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, TextStyle, TouchableOpacity} from 'react-native';
import {CalendarList, DateData} from 'react-native-calendars';
import clsx from 'libs/clsx';
import _ from 'lodash'

const RANGE = 24;
function CalendarListScreen({navigation, route}: NativeStackScreenProps<any>) {
  const {
    horizontalView = false,
    initialDate,
    onSelectDay,
    minimumDate,
    maximumDate,
    headerTitle,
    disableElementValues
  } = route.params || {};
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle || 'Calendar',
    });
  }, [headerTitle, navigation]);

  const [selected, setSelected] = useState(initialDate);
  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: false,
        selectedColor: colors.primary.DEFAULT,
        selectedTextColor: 'white',
      },
    };
  }, [selected]);

  const onDayPress = useCallback(
    (day: DateData) => {
      setSelected(day.dateString);
      onSelectDay?.(day.dateString);
      navigation.goBack();
    },
    [navigation, onSelectDay],
  );

  function CustomDay({date, state, onPress}: any) {
    let status = state
    const thisDay = _.get(date, "dateString", "")

    if (!!disableElementValues && disableElementValues.includes(thisDay)) {
      status = 'disabled'
    }
    return <TouchableOpacity 
    onPress={() => {
      if (status !== 'disabled') {
        onPress?.(date)
      }
    }}
    className={clsx({
      "mt-1": true,
      "border-red-500 border rounded-full py-1 px-1 mt-0": thisDay === today.toString()
    })}
  >
    <Text style={{
      textAlign: 'center',
      color: status === 'disabled' ? 'gray' : 'red',
      fontWeight: status === 'disabled' ? 'normal' : 'bold',
    }}>{date?.day}</Text>
  </TouchableOpacity>
  }

  return (
    <CalendarList
      testID={'calendarList'}
      current={initialDate}
      pastScrollRange={RANGE}
      futureScrollRange={RANGE}
      onDayPress={onDayPress}
      markedDates={marked}
      renderHeader={!horizontalView ? renderCustomHeader : undefined}
      calendarHeight={!horizontalView ? 390 : undefined}
      theme={!horizontalView ? theme : undefined}
      horizontal={horizontalView}
      pagingEnabled={horizontalView}
      staticHeader={horizontalView}
      minDate={minimumDate}
      maxDate={maximumDate}
      dayComponent={CustomDay}
    />
  );
}

const theme = {
  stylesheet: {
    calendar: {
      header: {
        dayHeader: {
          fontWeight: '600',
          color: colors.primary.DEFAULT,
        },
      },
    },
  },
  'stylesheet.day.basic': {
    today: {
      borderColor: colors.primary.DEFAULT,
      borderWidth: 0.8,
      borderRadius: 20,
    },
    todayText: {
      color: colors.primary.DEFAULT,
      fontWeight: '800',
    },
  },
    
};

function renderCustomHeader(date: any) {
  const header = date.toString('MMMM yyyy');
  const [month, year] = header.split(' ');
  const textStyle: TextStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.primary.DEFAULT,
    paddingRight: 5,
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>
  );
}

export default CalendarListScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  month: {
    marginLeft: 5,
  },
  year: {
    marginRight: 5,
  },
});
