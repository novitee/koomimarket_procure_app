import React, { useState } from 'react'
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import H2 from 'components/ui/H2'
import P from 'components/ui/P'
import color from 'utils/color'

export default function Step5({onNext}) {

  const [type, setType] = useState(null)

  function onChangeType(value) {
    setType(value)
  }

  return (
    <>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <H2 fontWeight={700} style={{color: color.primary}}>We are on it!</H2>
          <P style={{textAlign: "center", marginTop: 12}}>Your chat will be ready in 24 hours and you will be notified.</P>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.buttonNext])}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonNextText])}>Back to Chat</P>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
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
    paddingHorizontal: 4, 
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
  customButton: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: color.primary
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
