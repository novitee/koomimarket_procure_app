import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import P from "components/ui/P"
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import PhonePicker from 'components/ui/PhonePicker'
import {verifyPhoneNumber} from "services/user"

export default function Login({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <ArrowBackIcon
            style={{}}
          />
        </HeaderLeft>
      )
    })
  }, [navigation, route])

  const [code, setCode] = useState(null)
  const [number, setNumber] = useState(null)

  function onChange(codeValue, numberValue) {
    setCode(codeValue)
    setNumber(numberValue)
  }

  async function onNext() {
    try {
      const {data:{otpToken}, message, success} = await verifyPhoneNumber({code, number})
      if (success) {
        navigation.navigate("OTP", {otpToken})
      } else {
        console.warn(message)
      }
    } catch (error) {
      console.warn(error.message)
    }
  }

  const isDone = !!code && !!number

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 70}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}} contentContainerStyle={{paddingBottom: 20}}>
          <View style={{paddingVertical: 92}}>
            <P style={{fontSize: 48, fontWeight: 700}}>Login to your account</P>
          </View>
          <PhonePicker 
            code={code}
            number={number}
            onChange={onChange}
          />
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, !isDone && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={onNext} disabled={!isDone}>
            <P style={StyleSheet.flatten([styles.buttonText, !isDone && {color: "#D80D1D"}])}>Next</P>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#D80D1D",
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#fff"
  }
})