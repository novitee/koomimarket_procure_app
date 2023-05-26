import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import ChevronRightIcon from "assets/images/chevron-right.svg"
import EarthIcon from "assets/images/earth.svg"
import NoteTextOutlineIcon from "assets/images/note-text-outline.svg"
import ProtectIcon from "assets/images/protect.svg"
import LoginVariantIcon from "assets/images/login-variant.svg"
import { scale } from 'utils/scale'
import color from 'utils/color'

export default function Settings({navigation, route}) {

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
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 20}}>
        <View style={{paddingHorizontal: 24, paddingVertical: 24}}>
          <H2 fontWeight={700} style={{color: color.primary}}>Settings</H2>
        </View>
        <TouchableOpacity>
          <View style={styles.item}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={styles.circle}>
                <H2 fontWeight={700}>Z</H2>
              </View>
              <H2 fontWeight={500} style={{marginLeft: 12}}>Zong Han</H2>
            </View>
            <ChevronRightIcon style={{color: "#9CA3AF"}} />
          </View>
        </TouchableOpacity>
        <View style={{marginTop: 24}}>
          <P style={{paddingHorizontal: 24, paddingVertical: 16}}>Businesses</P>
          <TouchableOpacity>
            <View style={styles.item}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <View style={styles.circle}>
                  <H3 fontWeight={700}>Z</H3>
                </View>
                <P style={{marginLeft: 12}}>Zong Han Pte Ltd</P>
              </View>
              <ChevronRightIcon style={{color: "#9CA3AF"}} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 24}}>
          <TouchableOpacity>
            <View style={styles.subItem}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <EarthIcon style={{color: color.primary}} />
                <P fontWeight={500} style={{marginLeft: 24}}>Language</P>
              </View>
              <ChevronRightIcon style={{color: "#9CA3AF"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.subItem}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <NoteTextOutlineIcon style={{color: color.primary}} />
                <P fontWeight={500} style={{marginLeft: 24}}>Terms & Conditions</P>
              </View>
              <ChevronRightIcon style={{color: "#9CA3AF"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.subItem}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <ProtectIcon style={{color: color.primary}} />
                <P fontWeight={500} style={{marginLeft: 24}}>Privacy Policy</P>
              </View>
              <ChevronRightIcon style={{color: "#9CA3AF"}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={StyleSheet.flatten([styles.subItem, styles.lastSubItem])}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <LoginVariantIcon style={{color: color.primary}} />
                <P fontWeight={500} style={{marginLeft: 24}}>Log Out</P>
              </View>
              <ChevronRightIcon style={{color: "#9CA3AF"}} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: color.border,
    borderTopColor: color.border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 100,
    backgroundColor: "rgba(217, 217, 217, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  subItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: color.border,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  lastSubItem: {
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  }
})