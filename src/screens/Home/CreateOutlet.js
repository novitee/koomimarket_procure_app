import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import HomeIcon from "assets/images/home.svg"
import CameraIcon from "assets/images/camera.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'

export default function CreateOutlet({navigation, route}) {

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 70}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}} contentContainerStyle={{paddingBottom: 20}}>
          <View style={{paddingTop: scale(0)}}>
            <H2 fontWeight={700}>Add Outlet</H2>
            <P fontWeight={300} style={{paddingTop: 12}}>This is what suppliers will see your outlet as.</P>
          </View>
          <View style={{paddingVertical: 24, alignItems: "center"}}>
            <View style={styles.bigCircle}>
              <HomeIcon />
              <View style={styles.smallCircle}>
                <CameraIcon style={{fill: "#fff"}} />
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.item}>
              <P fontWeight={400}>Outlet Name <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="e.g. Ah Gao’s Cafe" />
            </View>
            <View style={styles.item}>
              <P fontWeight={400}>Delivery Address <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="e.g. 13 Istana Road #01-10" />
            </View>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button])}>
            <P fontWeight={600} style={StyleSheet.flatten([styles.buttonText])}>Create Outlet</P>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scale(0)
  },
  item: {
    marginVertical: 12
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(212, 212, 216, 1)",
    borderRadius: 4,
    width: "100%",
    fontSize: scale(14),
    fontWeight: '400',
    marginTop: 4,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff"
  },
  bigCircle: {
    width: 164,
    height: 164,
    borderRadius: 100,
    backgroundColor: "rgba(224, 224, 228, 1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  smallCircle: {
    width: 48, 
    height: 48,
    backgroundColor: color.primary,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0, 
    bottom: 0
  }
})