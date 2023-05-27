import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H1 from "components/ui/H1"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import H4 from "components/ui/H4"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import FilterVariantIcon from "assets/images/filter-variant.svg"
import SearchIcon from "assets/images/search.svg"
import ShippingIcon from "assets/images/shipping.svg"
import PlusIcon from "assets/images/plus.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'

export default function SetSupplier({navigation, route}) {

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
        <H3 fontWeight={700}>Add Supplier</H3>
      )
    })
  }, [navigation, route])

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingVertical: 20}}>
        <View style={{paddingHorizontal: 24, marginBottom: 10}}>
          <P fontWeight={500}>Are you currently a customer with Vegetable Farm?</P>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity>
            <View style={StyleSheet.flatten([styles.button, {backgroundColor: color.primary}])}>
              <H4 style={{color: "#fff"}}>Yes</H4>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.button}>
              <H4>No</H4>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 24, marginTop: 24, marginBottom: 10}}>
          <P fontWeight={500}>Your Customer Account Number  (Optional)</P>
        </View>
        <View>
          <TextInput style={styles.input} keyboardType="number-pad" placeholder='e.g 10245' />
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.saveButton])}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.saveButtonText])}>Submit</P>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    paddingHorizontal: 24, 
    borderTopColor: color.border, 
    borderTopWidth: 1, 
    borderBottomColor: color.border, 
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12
  },
  button: {
    paddingHorizontal: 24, 
    paddingVertical: 14,
    backgroundColor: "rgba(229, 231, 235, 1)",
    borderRadius: 12,
    marginRight: 12
  },
  input: {
    height: 56,
    fontSize: scale(14),
    fontWeight: '400',
    marginTop: 4,
    paddingHorizontal: 24,
    flexGrow: 1,
    borderColor: color.border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  saveButton: {
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#fff"
  }
})