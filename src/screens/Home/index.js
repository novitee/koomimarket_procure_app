import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"

export default function Home({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerTransparent: true
    })
  }, [navigation, route])


  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text style={{fontSize: 24, color: "#c00", fontWeight: 600}}>Welcome</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
})
