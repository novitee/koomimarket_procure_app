/**
 * Toggles the value in the array. If the value already exists in the array, it is removed. Otherwise, it is added.
 * @param newValue The value to toggle in the array.
 * @param array The array to toggle the value in.
 * @returns A new array with the toggled value.
 */
export function toggleValueInArray<T>(newValue: T, array: T[]): T[] {
  const cloneArray: T[] = [...array];
  const existedIndex: number = array.findIndex(
    (value: T) => value === newValue,
  );
  if (existedIndex > -1) {
    cloneArray.splice(existedIndex, 1);
  } else {
    cloneArray.push(newValue);
  }
  return cloneArray;
}
