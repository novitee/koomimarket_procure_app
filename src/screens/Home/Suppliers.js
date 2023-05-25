import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H1 from "components/ui/H1"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import FilterVariantIcon from "assets/images/filter-variant.svg"
import SearchIcon from "assets/images/search.svg"
import ShippingIcon from "assets/images/shipping.svg"
import PlusIcon from "assets/images/plus.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'

export default function Suppliers({navigation, route}) {

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
      <View style={{paddingHorizontal: 24, paddingVertical: 24}}>
        <H2 fontWeight={700} style={{color: color.primary}}>Zong Han's Bar</H2>
        <View style={styles.wrapSearch}>
          <View style={styles.wrapInput}>
            <SearchIcon style={{color: "rgba(113, 113, 122, 1)"}} />
            <TextInput style={styles.input} placeholder="Search by supplier or product" />
          </View>
          <TouchableOpacity>
            <FilterVariantIcon style={{color: "#000"}} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{flex: 1, paddingHorizontal: 24}} contentContainerStyle={{paddingVertical: 20, flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
      <View style={{paddingBottom: 24, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <ShippingIcon />
          <P fontWeight={700} style={{paddingTop: 12, textAlign: "center"}}>Welcome to Koomi!</P>
          <P fontWeight={200} style={{paddingTop: 12, textAlign: "center"}}>Start by adding your suppliers.</P>
        </View>
        <TouchableOpacity style={StyleSheet.flatten([styles.button])}>
          <PlusIcon style={{color: "#FFF"}} />
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonText])}>Add Suppliers</P>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24
  },
  wrapInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 212, 216, 1)",
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 12,
    flex: 1
  },
  input: {
    height: 40,
    fontSize: scale(14),
    fontWeight: '400',
    marginTop: 4,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  button: {
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 12
  },
})