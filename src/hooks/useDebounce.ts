import {useRef} from 'react';
import debounce from 'lodash.debounce';
interface DebouncedArgs<T> {
  delay?: number;
  callback?: (value: T) => void;
}

export const useDebounce = <T = unknown>({
  callback,
  delay = 700,
}: DebouncedArgs<T>) => {
  const dispatchValue = (value: T) => callback?.(value);

  const setValueDebounced = useRef(debounce(dispatchValue, delay));

  return (value: T) => setValueDebounced.current(value);
};
