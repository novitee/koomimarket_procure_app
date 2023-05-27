import React from 'react'
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import P from 'components/ui/P'
import color from 'utils/color'

export default function Step1({onNext}) {
  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <TextInput style={styles.input} placeholder="Supplier Name" />
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.buttonNext])} onPress={onNext.bind(this, 1)}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonNextText])}>Next</P>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 12
  },
  buttonNext: {
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonNextText: {
    color: "#fff"
  }
})