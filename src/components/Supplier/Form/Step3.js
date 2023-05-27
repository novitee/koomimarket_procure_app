import React, { useState } from 'react'
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import P from 'components/ui/P'
import color from 'utils/color'
import PhonePicker from "components/ui/PhonePicker/index.js"
import PlusCircle from "assets/images/plus-circle.svg"

export default function Step3({onNext}) {

  const [type, setType] = useState(null)

  function onChangeType(value) {
    setType(value)
  }

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{marginBottom: 6}}>
            <P fontWeight={700}>How do you create your orders?</P>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={{flex: 1}} onPress={onChangeType.bind(this, "Whatsapp")}>
              <View style={StyleSheet.flatten([styles.button, type === "Whatsapp" && {backgroundColor: color.primary}])}>
                <P fontWeight={600} style={type === "Whatsapp" ? {color: "#fff"} : {}}>Whatsapp</P>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={onChangeType.bind(this, "Email")}>
              <View style={StyleSheet.flatten([styles.button, type === "Email" && {backgroundColor: color.primary}])}>
                <P fontWeight={600} style={type === "Email" ? {color: "#fff"} : {}}>Email</P>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={onChangeType.bind(this, "Both")}>
              <View style={StyleSheet.flatten([styles.button, type === "Both" && {backgroundColor: color.primary}])}>
                <P fontWeight={600} style={type === "Both" ? {color: "#fff"} : {}}>Both</P>
              </View>
            </TouchableOpacity>
          </View>
          {!!type && (
            <View style={{marginTop: 24}}>
              <View style={{marginBottom: 24}}>
                <P fontWeight={500} style={{marginBottom: 12}}>Name of person in-charge (optional)</P>
                <TextInput style={styles.input} placeholder="Name" />
              </View>
              {["Whatsapp", "Both"].includes(type) && (
                <View style={{marginBottom: 24}}>
                  <P fontWeight={500} style={{marginBottom: 12}}>Enter phone number</P>
                  <PhonePicker />
                </View>
              )}
              {["Email", "Both"].includes(type) && (
                <>
                  <View style={{marginBottom: 24}}>
                    <P fontWeight={500} style={{marginBottom: 12}}>Enter email address </P>
                    <TextInput style={styles.input} placeholder="Email" />
                  </View>
                  <TouchableOpacity style={StyleSheet.flatten([styles.button, styles.customButton])}>
                    <PlusCircle color={color.primary} />
                    <P fontWeight={600} style={{marginLeft: 12, color: color.primary}}>Add More Email</P>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.buttonNext])} onPress={onNext.bind(this, 3)}>
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