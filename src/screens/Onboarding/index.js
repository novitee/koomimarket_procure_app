import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, Text, Platform } from 'react-native'
import { DEFAULT_HEADER_STYLE, PADDING_CONTENT } from "utils/header-style"
import LogoIcon from "assets/images/logo.svg"
import notifee from '@notifee/react-native';
import color from "utils/color"
import P from "components/ui/P"

export default function Onboarding({ navigation, route }) {

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

  async function showNotif() {
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LogoIcon />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onRedirectTo.bind(this, "Login")}>
          <P style={styles.buttonText} fontWeight={600}>Login</P>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.flatten([styles.button, styles.customButton])} onPress={onRedirectTo.bind(this, "SignUp")}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonText, { color: color.primary }])}>Sign Up</P>
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
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    marginTop: 24,
    backgroundColor: "rgba(238, 243, 253, 1)",
    borderWidth: 1,
    borderColor: "rgba(238, 243, 253, 1)"
  },
  buttonText: {
    color: "#fff"
  }
})
