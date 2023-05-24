import React from "react";
import { StyleSheet, Text } from "react-native";
import { scale } from "utils/scale";
import color from "utils/color"
import {formatFontWeight} from "utils/format"

const H2 = props => {

  const defaultFontWeight = props.fontWeight || 400

  let baseStyle = {
    fontSize: scale(32),
    color: color.text,
    fontFamily: formatFontWeight(defaultFontWeight),
  }
  
  return (
    <Text {...props} 
      style={StyleSheet.flatten([baseStyle, props.style])}
    >
      {props.children}
    </Text>
  )
}

export default H2;