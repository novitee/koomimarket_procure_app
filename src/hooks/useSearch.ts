import {useCallback, useState} from 'react';
import {useDebounce} from 'hooks/useDebounce';

export default function useSearch(defaultValue = '') {
  const [searchString, setSearchString] = useState(defaultValue);
  const onSearch = useCallback(
    (value: string) => {
      setSearchString(value);
    },
    [setSearchString],
  );

  const debounceSearch = useCallback(
    useDebounce({callback: onSearch, delay: 200}),
    [onSearch],
  );

  const handleSearch = useCallback(
    (value: string) => {
      debounceSearch(value);
    },
    [debounceSearch],
  );
  return {searchString, handleSearch};
}
