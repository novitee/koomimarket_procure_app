import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, Platform} from 'react-native'
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

export default function SupplierMenu({navigation, route}) {

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
      <View style={{paddingHorizontal: 24}}>
        <View style={styles.wrapSearch}>
          <View style={styles.wrapInput}>
            <SearchIcon style={{color: "rgba(113, 113, 122, 1)"}} />
            <TextInput style={styles.input} placeholder="Search by supplier or product" />
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 1, paddingHorizontal: 24}} contentContainerStyle={{paddingVertical: 20}}>
        {[...Array(10)].map((item, index) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate("ViewSupplier")}>
              <ImageBackground source={{uri: "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg"}}
                style={{flex: 1, height: 96, justifyContent: "center", alignItems: "center", marginBottom: 8}}
              >
                <H2 fontWeight={700} style={styles.text}>FRUIT & VEG</H2>
              </ImageBackground>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212, 212, 216, 1)",
    borderRadius: 4,
    paddingHorizontal: 10,
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
  text: {
    color: "#FFF", 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
})