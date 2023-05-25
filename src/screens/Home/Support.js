import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import KoomiLogiIcon from "assets/images/koomi-logo.svg"
import SendCircleIcon from "assets/images/send-circle.svg"
import MessageProcessingIcon from "assets/images/message-processing.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'
import LinearGradient from 'react-native-linear-gradient';

export default function Support({navigation, route}) {

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
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['rgba(255, 255, 255, 1)', 'rgba(229, 74, 43, 1)']} style={{flex: 1}}>
        <ScrollView style={{paddingHorizontal: 24, flex: 1}} contentContainerStyle={{paddingBottom: 20}}>
          <View style={{paddingVertical: 24, justifyContent: "center", alignItems: "center"}}>
            <KoomiLogiIcon />
          </View>
          <View style={{paddingVertical: 24}}>
            <H2 fontWeight={500}>Hi Zong Han 👋</H2>
            <H2 fontWeight={500}>How can we help?</H2>
          </View>
          <View>
            <TouchableOpacity>
              <View style={styles.item}>
                <View>
                  <H3 fontWeight={600}>Message History</H3>
                  <P fontWeight={400} style={{paddingTop: 16, color: "rgba(107, 114, 128, 1)"}}>We typically reply in a few minutes</P>
                  <P fontWeight={400} style={{paddingTop: 16, color: "rgba(107, 114, 128, 1)"}}>Our Support hours are Monday - Friday 9am - 6pm</P>
                </View>
                <SendCircleIcon />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.item}>
                <P fontWeight={500}>Message History</P>
                <MessageProcessingIcon />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scale(0)
  },
  item: {
    paddingVertical: 18, 
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 35
  }
})