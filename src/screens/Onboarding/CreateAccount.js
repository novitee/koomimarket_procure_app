import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import PhonePicker from 'components/ui/PhonePicker'
import PencilLogo from "assets/images/pencil.svg"

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
      ),
      headerTitle: () => (
        <Text style={{fontSize: 24, fontWeight: 600}}>Create Account</Text>
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
    navigation.navigate("SaveBusinessProfile")
  }

  const isDone = true

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 70}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}}>
          <View style={{paddingVertical: 24, alignItems: "center"}}>
            <TouchableOpacity style={{position: "relative"}}>
              <Image source={{uri: "https://randomuser.me/api/portraits/men/97.jpg"}} 
                style={{width: 120, height: 120}} borderRadius={100}
              />
              <View style={{position: "absolute", bottom: 0, right: 0}}>
                <View style={{backgroundColor: "#D80D1D", width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center"}}>
                  <PencilLogo />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} placeholder="Name" />
          <TextInput style={styles.input} placeholder="Email" />
          <PhonePicker 
            code={code}
            number={number}
            onChange={onChange}
            showError={false}
          />
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, !isDone && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={onNext} disabled={!isDone}>
            <Text style={StyleSheet.flatten([styles.buttonText, !isDone && {color: "#D80D1D"}])}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    fontSize: 18,
    fontWeight: '500',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 24,
    paddingHorizontal: 10
  },
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