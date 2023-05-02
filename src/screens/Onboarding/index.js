import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import LogoIcon from "assets/images/logo.svg"

export default function Onboarding({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerTransparent: true
    })
  }, [navigation, route])

  function onRedirectTo(screen) {
    if (!screen) return
    navigation.navigate(screen)
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <LogoIcon />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onRedirectTo.bind(this, "Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.flatten([styles.button, styles.customButton])} onPress={onRedirectTo.bind(this, "SignUp")}>
          <Text style={StyleSheet.flatten([styles.buttonText, {color: "#D80D1D"}])}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    position: "absolute",
    bottom: 48
  },
  button: {
    backgroundColor: "#D80D1D",
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    marginTop: 24, 
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D80D1D"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#fff"
  }
})
