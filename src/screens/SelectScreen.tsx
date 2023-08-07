import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OptionItem} from 'components/Select';
import Text from 'components/Text';
import clsx from 'libs/clsx';
import {styled} from 'nativewind';
import {BackButton} from 'navigations/common';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, LogBox, TouchableOpacity, View} from 'react-native';
// import {setLoadingScreen} from 'stores/global';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const StyledView = styled(TouchableOpacity, 'p-5 rounded-5 mb-4');

function SelectionItem({
  item,
  onSelect,
  isSelected,
}: {
  item: OptionItem;
  onSelect?: (item: OptionItem) => void;
  isSelected?: boolean;
}) {
  return (
    <StyledView
      className={clsx({
        'bg-primary': !!isSelected,
        'bg-gray-F5FBFF': !isSelected,
      })}
      onPress={() => onSelect?.(item)}>
      <Text
        className={clsx({
          'font-medium': true,
          'text-white': !!isSelected,
          'text-dark': !isSelected,
        })}>
        {item.label}
      </Text>
    </StyledView>
  );
}
function _keyExtractor(item: any, index: number) {
  return `${item.value}-${index}`;
}
export default function SelectScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {title, onChange, onBack, options, currentValue} = route.params || {};

  const [selected, setSelected] = useState(currentValue);
  useEffect(() => {
    if (currentValue && currentValue.value !== selected.value) {
      setSelected(currentValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  const headerLeft = useCallback(() => {
    return (
      <BackButton
        canGoBack={true}
        goBack={() => {
          onBack?.();
          navigation.goBack();
        }}
      />
    );
  }, [navigation, onBack]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || 'Select',
      headerLeft: headerLeft,
    });
  }, [headerLeft, navigation, title]);

  async function handleSelect(item: OptionItem) {
    setSelected(item);
    // setLoadingScreen(true);
    await onChange(item);
    // setLoadingScreen(false);

    navigation.goBack();
  }

  function _renderItem({item}: {item: any}) {
    return (
      <SelectionItem
        item={item}
        isSelected={item.value === selected.value}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <View className="flex-1 p-5">
      <FlatList
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        data={options}
        extraData={selected}
      />
    </View>
  );
}
