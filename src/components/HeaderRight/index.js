import React from 'react'
import {TouchableOpacity, StyleSheet} from "react-native"

export default function index({onPress, children, style, ...rest}) {
  return (
    <TouchableOpacity onPress={onPress} 
      style={StyleSheet.flatten([
        {flex: 1, justifyContent: "center", alignItems: "flex-end", width: 100, height: 40}, 
        {...style}
      ])}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}
