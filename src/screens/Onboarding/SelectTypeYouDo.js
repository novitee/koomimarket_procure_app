import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import { scale } from 'utils/scale'
import ChefIcon from "assets/images/chef.svg"
import SupplierIcon from "assets/images/supplier.svg"

const types = [
  {
    icon: <ChefIcon />,
    label: "Chef / Manager",
    description: "I want to order stuff for my restaurant, bar or cafe."
    
  },
  {
    icon: <SupplierIcon />,
    label: "Supplier / Producer",
    description: "I want to list and promote my items for ordering."
  }
]

export default function SelectTypeYouDo({navigation, route}) {

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
      <View style={{paddingHorizontal: 24}}>
        <View style={{paddingTop: scale(96)}}>
          <H2 fontWeight={700} style={{textAlign: "center"}}>What do you do?</H2>
        </View>
        <View style={styles.content}>
          {types.map(item => {
            return (
              <TouchableOpacity>
                <View key={item.label} style={styles.item}>
                  {item.icon}
                  <View style={{flex: 1, paddingLeft: 24, justifyContent: "center"}}>
                    <P fontWeight={700}>{item.label}</P>
                    <P fontWeight={500} style={{marginTop: 8}}>{item.description}</P>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scale(36)
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 4,
    marginBottom: 24,
    borderColor: "#ddd"
  }
})