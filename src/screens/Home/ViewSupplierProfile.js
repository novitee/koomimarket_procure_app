import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, Platform, StatusBar} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H1 from "components/ui/H1"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import CurrencyDollarIcon from "assets/images/currency-dollar.svg"
import TruckIcon from "assets/images/truck.svg"
import CalendarIcon from "assets/images/calendar.svg"
import ClockIcon from "assets/images/clock.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'
import H4 from 'components/ui/H4'

export default function ViewSupplierProfile({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerTransparent: true,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <ArrowBackIcon
            style={{}}
          />
        </HeaderLeft>
      ),
    })
  }, [navigation, route])

  return (
    <>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingVertical: 0}}>
        <Image source={{uri: "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg"}} 
          style={{
            height: 240
          }}
        />
        <View style={{paddingHorizontal: 24, paddingVertical: 24}}>
          <H1 fontWeight={700}>Vegetable Farm</H1>
          <View style={{marginTop: 12}}>
            <P>We specialize in growing fresh, organic produce using sustainable farming practices. </P>
            <P fontWeight={300} style={{color: color.primary, marginTop: 6}}>See More</P>
          </View>
          <View style={{marginTop: 16}}>
            <P fontWeight={700}>About</P>
            <View style={{marginTop: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: color.border}}>
              <View style={styles.aboutItem}>
                <CurrencyDollarIcon color={color.primary} />
                <View style={{marginLeft: 12}}>
                  <H4 style={{color: "rgba(134, 128, 128, 1)"}}>Minimum order value</H4>
                  <H4 fontWeight={500}>0 SGD</H4>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <TruckIcon color={color.primary} />
                <View style={{marginLeft: 12}}>
                  <H4 style={{color: "rgba(134, 128, 128, 1)"}}>Delivery fee</H4>
                  <H4 fontWeight={500}>0 SGD</H4>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <CalendarIcon color={color.primary} />
                <View style={{marginLeft: 12}}>
                  <H4 style={{color: "rgba(134, 128, 128, 1)"}}>Delivery days</H4>
                  <H4 fontWeight={500}>Mon, Tue, Wed, Thus, Fri, Sat</H4>
                </View>
              </View>
              <View style={StyleSheet.flatten([styles.aboutItem, {borderBottomWidth: 0}])}>
                <ClockIcon color={color.primary} />
                <View style={{marginLeft: 12}}>
                  <H4 style={{color: "rgba(134, 128, 128, 1)"}}>Cut-off time </H4>
                  <H4 fontWeight={500}>1 day before, 1.00am</H4>
                </View>
              </View>
            </View>
          </View>
          <View style={{marginTop: 16}}>
            <P fontWeight={700}>Catalogue</P>
            <View style={{marginTop: 12}}>
              {[...Array(5)].map((item, index) => {
                return (
                  <View style={StyleSheet.flatten([styles.menuItem, index === 0 && {borderTopWidth: 1}])}>
                    <View>
                      <P fontWeight={500}>Cabbage Mini (Wa Wa Chye)</P>
                      <P fontWeight={200} style={{color: "rgba(173, 168, 168, 1)", marginTop: 4}}>$0.00 Kilos (S)</P>
                      <H4 style={{color: color.primary, marginTop: 4}}>See details</H4>
                    </View>
                    <Image source={{uri: "https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg"}} style={{width: 72, height: 72}} />
                  </View>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SetSupplier")}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonText])}>Add Supplier</P>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  aboutItem: {
    flexDirection: "row", 
    alignItems: "center",
    borderBottomColor: color.border,
    borderBottomWidth: 1,
    paddingVertical: 12
  },
  menuItem: {
    padding: 12, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderBottomWidth: 1,
    borderColor: color.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
  }
})