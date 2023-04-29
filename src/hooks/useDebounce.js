import React, { useCallback } from 'react'
import { debounce } from 'lodash'

export default function useDebounce(callback, delay) {
  const d = callback
  const callbackFn = useCallback(debounce(d, delay), [])

  return [callbackFn]
}