import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import PhonePicker from 'components/ui/PhonePicker'

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

  const isDone = !!code && !!number

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 24}}>
        <View style={{paddingVertical: 92}}>
          <Text style={{fontSize: 48, fontWeight: 700}}>Login to your account</Text>
        </View>
        <PhonePicker 
          code={code}
          number={number}
          onChange={onChange}
        />
      </View>
      <View style={{position: "absolute", width: "100%", paddingHorizontal: 24, bottom: 48}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.button, !isDone && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={null} disabled={!isDone}>
          <Text style={StyleSheet.flatten([styles.buttonText, !isDone && {color: "#D80D1D"}])}>Next</Text>
        </TouchableOpacity>
      </View>
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