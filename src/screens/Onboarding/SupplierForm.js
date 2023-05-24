import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import { scale } from 'utils/scale'
import TruckIcon from "assets/images/truck.svg"
import color from 'utils/color'

export default function SupplierForm({navigation, route}) {

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
          <View style={{paddingTop: scale(96)}}>
            <H2 fontWeight={700}>Get in touch</H2>
            <P fontWeight={300} style={{paddingTop: 12}}>Suppliers have much more complexed processes - so we would love to get to know you better. Leave your details via the form below and we'll follow up as soon as we can.</P>
          </View>
          <View style={styles.content}>
            <View style={styles.item}>
              <P fontWeight={400}>Name <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="e.g. Tan Ah Gao" />
            </View>
            <View style={styles.item}>
              <P fontWeight={400}>Company Name <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="e.g. Koomy Procure" />
            </View>
            <View style={styles.item}>
              <P fontWeight={400}>Position</P>
              <TextInput style={styles.input} placeholder="Your position" />
            </View>
            <View style={styles.item}>
              <P fontWeight={400}>Email <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="e.g. ahgao@business.com" />
            </View>
            <View style={styles.item}>
              <P fontWeight={400}>How did you hear about Koomi <P style={{color: color.primary}}>*</P></P>
              <TextInput style={styles.input} placeholder="" />
            </View>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button])}>
            <P style={StyleSheet.flatten([styles.buttonText])}>Submit</P>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scale(36)
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
    fontSize: 16,
    fontWeight: 600,
    color: "#fff"
  }
})