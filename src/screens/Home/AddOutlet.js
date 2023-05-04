import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import PhonePicker from 'components/ui/PhonePicker'
import PencilLogo from "assets/images/pencil.svg"
import CheckLogo from "assets/images/check.svg"
import DeleteLogo from "assets/images/delete.svg"
import AddCircleLogo from "assets/images/add-circle.svg"

export default function AddOutlet({navigation, route}) {

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
        <Text style={{fontSize: 24, fontWeight: 600}}>Add Outlet</Text>
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
  }

  const isDone = true

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 70}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}} contentContainerStyle={{paddingBottom: 24}}>
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
          <TextInput style={styles.input} placeholder="Outlet Name" />
          <PhonePicker 
            code={code}
            number={number}
            onChange={onChange}
            showError={false}
          />
          <View style={{paddingVertical: 24}}>
            <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 14}}>Billing Address</Text>
            <TextInput style={StyleSheet.flatten([styles.input, {marginBottom: 0}])} placeholder="Billing Address" />
          </View>
          <View style={{paddingVertical: 0}}>
            <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 14}}>Delivery Address</Text>
            <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginBottom: 10}}>
              <View style={{width: 18, height: 18, backgroundColor: "#D80D1D", borderRadius: 100, justifyContent: "center", alignItems: "center"}}>
                <CheckLogo />
              </View>
              <Text style={{fontSize: 12, fontWeight: 500, marginLeft: 10}}>Same As Billing Address</Text>
            </TouchableOpacity>
            <TextInput style={StyleSheet.flatten([styles.input, {marginBottom: 0}])} placeholder="Delivery Address" />
          </View>
          <View style={{marginTop: 32}}>
            <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 14}}>Add Suppliers into this Outlet (optional)</Text>
            {[...Array(4)].map((item, index) => (
              <View key={index} style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "rgba(209, 213, 219, 1)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8}}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <Image source={{uri: "https://randomuser.me/api/portraits/men/97.jpg"}} 
                    style={{width: 42, height: 42}} borderRadius={100}
                  />
                  <Text style={{fontSize: 14, fontWeight: 600, marginLeft: 10}}>Jack Cafe Supply</Text>
                </View>
                <TouchableOpacity><DeleteLogo /></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={StyleSheet.flatten([styles.button, {backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#D80D1D"}])} onPress={null}>
              <AddCircleLogo />
              <Text style={StyleSheet.flatten([styles.buttonText, {color: "#D80D1D", marginLeft: 10}])}>Add Supplier</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, !isDone && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={onNext} disabled={!isDone}>
            <Text style={StyleSheet.flatten([styles.buttonText, !isDone && {color: "#D80D1D"}])}>Add Outlet</Text>
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