import {View} from 'react-native';
import React from 'react';
import Input from './Input';
import SearchIcon from 'assets/images/search.svg';
import colors from 'configs/colors';
import {styled} from 'nativewind';
import {useTransition} from 'react';

const MagnifyingIcon = () => (
  <View className="h-full items-center justify-center pl-3 ">
    <SearchIcon color={colors.chevron} />
  </View>
);

const Wrapper = styled(View, 'w-full');

export default function SearchBar({
  placeholder = 'Search',
  onSearch,
}: {
  placeholder?: string;
  onSearch: (text: string) => void;
}) {
  const [_, startTransition] = useTransition();
  function handleChangeText(text: string) {
    startTransition(() => onSearch(text));
  }
  return (
    <Wrapper>
      <Input
        className="h-10"
        inputClassName="px-2 text-sm py-2"
        placeholder={placeholder}
        StartComponent={MagnifyingIcon}
        onChangeText={handleChangeText}
      />
    </Wrapper>
  );
}
