import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import ShoppingIcon from "assets/images/shopping.svg"
import TruckIcon from "assets/images/truck.svg"

const proceedArr = [
  {icon: <ShoppingIcon />, title: "Chef / Manager", description: "I want to order stuff for my restaurant, bar or cafe."},
  {icon: <TruckIcon />, title: "Supplier", description: "I want to list and promote my items for ordering."},
]

export default function Proceed({navigation, route}) {

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

  const [selectedItem, setSelectedItem] = useState(null)

  function onSelect(item) {
    if (!item) return
    setSelectedItem(item.title)
  }

  async function onNext() {
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 80 : 70}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}}>
          <View style={{paddingVertical: 72}}>
            <Text style={{fontSize: 48, fontWeight: 700}}>What you want to do?</Text>
          </View>
          <View style={styles.content}>
            {proceedArr.map((item, index) => {
              const isSelected = item.title === selectedItem
              return (
                <TouchableOpacity key={index} style={StyleSheet.flatten([styles.item, {borderColor: isSelected ? "#D80D1D" : "rgba(238, 238, 238, 1)"}])}
                  onPress={onSelect.bind(this, item)}
                >
                  {item.icon}
                  <View style={styles.wrapText}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
          <TouchableOpacity style={StyleSheet.flatten([styles.button, !selectedItem && {backgroundColor: "rgba(216, 13, 29, 0.08)"}])} onPress={onNext} disabled={!selectedItem}>
            <Text style={StyleSheet.flatten([styles.buttonText, !selectedItem && {color: "#D80D1D"}])}>Proceed to Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
  },  
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 32
  },
  wrapText: {
    flex: 1,
    marginLeft: 18
  },
  title: {
    fontSize: 18,
    fontWeight: 700
  },
  description: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 6
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
  }
})