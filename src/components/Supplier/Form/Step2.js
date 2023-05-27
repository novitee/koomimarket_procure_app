import React, { useState } from 'react'
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import P from 'components/ui/P'
import color from 'utils/color'

export default function Step2({onNext}) {

  const [type, setType] = useState(null)

  function onChangeType(value) {
    setType(value)
  }

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{marginBottom: 6}}>
            <P fontWeight={700}>Have you purchase from this supplier before?</P>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={{flex: 1}} onPress={onChangeType.bind(this, "Yes")}>
              <View style={StyleSheet.flatten([styles.button, type === "Yes" && {backgroundColor: color.primary}])}>
                <P fontWeight={600} style={type === "Yes" ? {color: "#fff"} : {}}>Yes</P>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={onChangeType.bind(this, "No")}>
            <View style={StyleSheet.flatten([styles.button, type === "No" && {backgroundColor: color.primary}])}>
                <P fontWeight={600} style={type === "No" ? {color: "#fff"} : {}}>No</P>
              </View>
            </TouchableOpacity>
          </View>
          {type === "Yes" && (
            <View style={{marginTop: 24}}>
              <P fontWeight={500} style={{marginBottom: 12}}>What is your account number with this supplier? (optional)</P>
              <TextInput style={styles.input} placeholder="Supplier Number" keyboardType="number-pad" />
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.buttonNext])} onPress={onNext.bind(this, 2)}>
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
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    flex: 1
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24, 
    paddingVertical: 14,
    backgroundColor: "rgba(229, 231, 235, 1)",
    borderRadius: 12,
    borderRadius: 100
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