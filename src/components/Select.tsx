import colors from 'configs/colors';
import useNavigation from 'hooks/useNavigation';
import {styled} from 'nativewind';
import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from './Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';

const StyledView = styled(
  TouchableOpacity,
  'pl-4 h-[50px] flex-row items-center border border-gray-300 rounded',
);
export interface OptionItem {
  value: string | number;
  label?: string;
}

interface SelectProps extends TouchableOpacityProps {
  value?: OptionItem;
  options: OptionItem[];
  onChange?: (item: OptionItem) => void;
  onOpen?: () => void;
  onBack?: () => void;
  title?: string | null;
}
export default function Select({
  value,
  onChange,
  options,
  title,
  onOpen,
  onBack,
  ...props
}: SelectProps) {
  const {navigate} = useNavigation();
  function handleSelect() {
    onOpen?.();

    setTimeout(() => {
      navigate('SelectScreen', {
        options,
        onChange,
        onBack,
        title,
        currentValue: value,
      });
    }, 100);
  }
  const displayValue = options.find(op => op.value === value?.value)?.label;
  return (
    <StyledView {...props} onPress={handleSelect}>
      <Text className="flex-1">{displayValue}</Text>
      <ChevronRightIcon color={colors.chevron} />
    </StyledView>
  );
}
