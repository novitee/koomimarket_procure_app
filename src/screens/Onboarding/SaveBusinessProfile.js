import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import Modal from "react-native-modal"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import PencilLogo from "assets/images/pencil.svg"
import AddCircleIcon from "assets/images/add-circle.svg"
import EditLogo from "assets/images/edit.svg"

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
        <Text style={{fontSize: 24, fontWeight: 600}}>Create Business Profile</Text>
      )
    })
  }, [navigation, route])

  const [isVisible, setIsVisible] = useState(false)

  async function onNext() {
    setIsVisible(true)
  }

  const isDone = true

  return (
    <>
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
            <TextInput style={styles.input} placeholder="Entity Name, example ABC Pte. Ltd." />
            <TextInput style={styles.input} placeholder="Billing Address" />
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 16, fontWeight: 700, marginBottom: 20}}>My Outlets</Text>
              {[...Array(3)].map((item, index) => (
                <TouchableOpacity key={index} style={{paddingHorizontal: 12, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(209, 213, 219, 1)", borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14}}>
                  <Text style={{fontSize: 14, fontWeight: 600}}>Yishun Outlet</Text>
                  <EditLogo />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={StyleSheet.flatten([styles.button, {backgroundColor: "#fff", borderColor: "#D80D1D", borderWidth: 1, flexDirection: "row", alignItems: "center"}])} onPress={onNext} disabled={!isDone}>
                <AddCircleIcon />
                <Text style={StyleSheet.flatten([styles.buttonText, {color: "#D80D1D", marginLeft: 10}])}>Add Outlet</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
            <TouchableOpacity style={StyleSheet.flatten([styles.button, !isDone && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={onNext} disabled={!isDone}>
              <Text style={StyleSheet.flatten([styles.buttonText, !isDone && {color: "#D80D1D"}])}>Done</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Modal
        testID={'modal'}
        isVisible={isVisible}
      >
        <View style={styles.modalContent}>
          <Text style={{fontSize: 18, fontWeight: 700, marginBottom: 16}}>Hi John Tan Beverages!</Text>
          <Text style={{fontSize: 24, fontWeight: 700, color: "#D80D1D", marginBottom: 16}}>Welcome Aboard!</Text>
          <Text style={{fontSize: 16, fontWeight: 600}}>You're set up and ready to go!</Text>
          <Text style={{fontSize: 16, fontWeight: 600, marginBottom: 32}}>Order like on mobile, but with extra business features for restaurants.</Text>
          <TouchableOpacity style={StyleSheet.flatten([styles.button])} onPress={() => setIsVisible(false)}>
            <Text style={StyleSheet.flatten([styles.buttonText])}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
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
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
})