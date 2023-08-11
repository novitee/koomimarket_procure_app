import {View} from 'react-native';
import React, {useEffect} from 'react';
import Input from './Input';
import SearchIcon from 'assets/images/search.svg';
import colors from 'configs/colors';
import {styled} from 'nativewind';
import {useDebounce} from 'hooks/useDebounce';
import {ViewProps} from 'react-native';

const MagnifyingIcon = () => (
  <View className="h-full items-center justify-center pl-3 ">
    <SearchIcon color={colors.chevron} />
  </View>
);

const Wrapper = styled(View, 'w-full');

interface SearchBarProps extends ViewProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = 'Search',
  onSearch,
  defaultValue,
  ...props
}: SearchBarProps) {
  const debounce = useDebounce({callback: onChange});

  const handleOnInput = (text: string) => {
    debounce(text);
  };

  function onChange(value: string) {
    onSearch(value);
  }
  return (
    <Wrapper {...props}>
      <Input
        className="h-10"
        inputClassName="px-2 text-sm py-2 leading-none"
        placeholder={placeholder}
        StartComponent={MagnifyingIcon}
        onChangeText={handleOnInput}
        defaultValue={defaultValue}
      />
    </Wrapper>
  );
}
