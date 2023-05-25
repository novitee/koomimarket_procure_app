import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import { StyleSheet, Image, Dimensions, TouchableOpacity, Alert, View, SafeAreaView, ScrollView } from 'react-native'
import HeaderLeft from "components/HeaderLeft"
import HeaderRight from "components/HeaderRight"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import H4 from "components/ui/H4"
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import MapMarkerIcon from "assets/images/map-marker.svg"
import HomeIcon from "assets/images/home.svg"
import CameraIcon from "assets/images/camera.svg"
import ChevronRightIcon from "assets/images/chevron-right.svg"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import ClipboardListIcon from "assets/images/clipboard-list.svg"

import { scale } from 'utils/scale'
import color from 'utils/color'

export default function EditOutlet({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <ArrowBackIcon />
        </HeaderLeft>
      ),
      headerTitle: () => (
        <P fontWeight={600}>Edit Outlet</P>
      ),
      headerRight: () => (
        <HeaderRight onPress={null}>
          <P>Edit</P>
        </HeaderRight>
      )
    })
  }, [navigation, route])

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingVertical: 20}}>
        <View style={{paddingVertical: 24, alignItems: "center"}}>
          <View style={styles.bigCircle}>
            <HomeIcon />
            <View style={styles.smallCircle}>
              <CameraIcon style={{color: "#fff"}} />
            </View>
          </View>
        </View>
        <View>
          <View style={{paddingHorizontal: 24, paddingVertical: 12}}>
            <P fontWeight={700}>Outlet</P>
          </View>
          <View style={styles.item}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={styles.circle}>
                <MapMarkerIcon color="#FFF" />
              </View>
              <View style={{marginLeft: 12}}>
                <P>Zong Han’s Bar</P>
                <P style={{color: 'rgba(107, 114, 128, 1)', marginTop: 6}}>17 Jln Mesin, Novitee Office</P>
              </View>
            </View>
          </View>
        </View>
        <View style={{paddingTop: 48}}>
          <View style={{paddingHorizontal: 24, paddingVertical: 12}}>
            <P fontWeight={700}>Display Name</P>
          </View>
          <View style={{paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderColor: color.border, borderBottomWidth: 1}}>
            <P>Zong Han’s Bar</P>
          </View>
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bigCircle: {
    width: 164,
    height: 164,
    borderRadius: 100,
    backgroundColor: "rgba(224, 224, 228, 1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  smallCircle: {
    width: 48, 
    height: 48,
    backgroundColor: color.primary,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0, 
    bottom: 0
  }
})
