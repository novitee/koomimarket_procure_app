import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import { StyleSheet, Image, Dimensions, TouchableOpacity, Alert, View, SafeAreaView, ScrollView } from 'react-native'
import HeaderLeft from "components/HeaderLeft"
import HeaderRight from "components/HeaderRight"
import H2 from "components/ui/H2"
import P from "components/ui/P"
import H4 from "components/ui/H4"
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import QuestionMarkCircleIcon from "assets/images/question-mark-circle.svg"
import CogIcon from "assets/images/cog.svg"
import KoomiLogoIcon from "assets/images/koomi-logo.svg"
import IllustrationIcon from "assets/images/Illustration.svg"
import PlusIcon from "assets/images/plus.svg"
import ClipboardListIcon from "assets/images/clipboard-list.svg"

import { scale } from 'utils/scale'
import color from 'utils/color'

export default function MyOutlets({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <QuestionMarkCircleIcon />
        </HeaderLeft>
      ),
      headerTitle: () => (
        <KoomiLogoIcon resizeMode="contain" />
      ),
      headerRight: () => (
        <HeaderRight onPress={null}>
          <CogIcon />
        </HeaderRight>
      )
    })
  }, [navigation, route])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <H2 fontWeight={700}>My Outlets</H2>
        <TouchableOpacity style={styles.stockButton}>
          <ClipboardListIcon />
          <P fontWeight={600} numberOfLines={1} style={{marginLeft: 12, flex: 1, color: color.primary}}>Start Stock Take</P>
        </TouchableOpacity>
      </View>
      <ScrollView style={{paddingHorizontal: 24, flex: 1}} 
        // No Outlets style
        // contentContainerStyle={{paddingVertical: 20, flexGrow: 1, justifyContent: "center", alignItems: "center"}}
        contentContainerStyle={{paddingVertical: 20}}
      >
        {[...Array(4)].map((item, index) => {
          return (
            <View style={styles.item}>
              <Image source={{uri: "https://i.pinimg.com/originals/ba/00/12/ba0012e9e262f582e690c80d1ddc8b2d.jpg"}} style={{width: 72, height: 72}} borderRadius={12} />
              <View style={{marginLeft: 16}}>
                <P fontWeight={700} style={{marginBottom: 16}}>Hougang Outlet</P>
                <P fontWeight={300}>184 Hougang Road, Hougang Mall</P>
                <P fontWeight={300}>#03-04</P>
              </View>
              <View style={styles.badge}>
                <H4 fontWeight={700} style={{color: "#fff"}}>1</H4>
              </View>
            </View>
          )
        })}
        

        {/* No Outlets */}
        {/* <View style={{paddingBottom: 24}}>
          <IllustrationIcon />
          <P fontWeight={700} style={{paddingTop: 12, textAlign: "center"}}>No Outlets Yet...</P>
          <P fontWeight={200} style={{paddingTop: 12, textAlign: "center"}}>Tell us about your outlets!</P>
        </View>
        <TouchableOpacity style={StyleSheet.flatten([styles.button])}>
          <PlusIcon style={{fill: "#FFF"}} />
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonText])}>Create Outlet</P>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  stockButton: {
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(238, 243, 253, 1)",
    flex: 1,
    marginLeft: 12
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
    marginBottom: 24
  },
  badge: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    right: -10,
    top: -10
  }
})
