import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import HeaderRight from "components/HeaderRight"
import CloseCircleIcon from "assets/images/close-circle.svg"
import PLusIcon from "assets/images/plus.svg"
import CameraIcon from "assets/images/camera.svg"
import MicrophoneIcon from "assets/images/microphone.svg"
import KoomiLogiIcon from "assets/images/koomi-logo.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'

export default function SupplierForm({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerRight: () => (
        <HeaderRight onPress={() => navigation.goBack()}>
          <CloseCircleIcon
            style={{}}
          />
        </HeaderRight>
      )
    })
  }, [navigation, route])

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView style={{flex: 1}} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90}
      >
        <ScrollView style={{paddingHorizontal: 24, flex: 1}} contentContainerStyle={{paddingBottom: 20}}>
          <View style={{paddingVertical: 24, justifyContent: "center", alignItems: "center"}}>
            <KoomiLogiIcon />
          </View>
          <View style={styles.content}>
            <Image source={{uri: "https://randomuser.me/api/portraits/men/97.jpg"}} borderRadius={100} style={{width: 72, height: 72}} />
            <View>
              <H3 fontWeight={600} style={{textAlign: "center", paddingVertical: 22}}>We're here for you! 💙</H3> 
              <H3 fontWeight={500} style={{textAlign: "center", paddingVertical: 22}}>We typically reply in a few minutes</H3> 
              <P fontWeight={500} style={{color: "rgba(107, 114, 128, 1)", textAlign: "center"}}>Thank you for reaching out to Koomi Support.</P>
              <P fontWeight={500} style={{color: "rgba(107, 114, 128, 1)", textAlign: "center"}}>Our Support hours are Monday - Friday 9am - 6pm</P>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity>
            <PLusIcon style={{ color: '#000' }} width={40} height={40} />
          </TouchableOpacity>
          <TextInput style={styles.input} />
          <TouchableOpacity>
            <CameraIcon style={{ color: '#000', marginRight: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MicrophoneIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: scale(36),
    alignItems: "center"
  },
  item: {
    marginVertical: 12
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(212, 212, 216, 1)",
    borderRadius: 4,
    fontSize: scale(14),
    fontWeight: '400',
    marginTop: 4,
    paddingHorizontal: 10,
    flexGrow: 1,
    marginHorizontal: 12
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
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: color.border
  }
})