import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import { StyleSheet, Image, Dimensions, TouchableOpacity, Alert, View, SafeAreaView, ScrollView } from 'react-native'
import HeaderLeft from "components/HeaderLeft"
import HeaderRight from "components/HeaderRight"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import P from "components/ui/P"
import H4 from "components/ui/H4"
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import AccountPlusIcon from "assets/images/account-plus.svg"
import KoomiLogoIcon from "assets/images/koomi-logo.svg"
import ChevronRightIcon from "assets/images/chevron-right.svg"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import AddTeamBox from 'components/Team/AddTeamBox'

import { scale } from 'utils/scale'
import color from 'utils/color'

export default function MyOutlets({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <ArrowBackIcon />
        </HeaderLeft>
      ),
      headerTitle: () => (
        <KoomiLogoIcon resizeMode="contain" />
      ),
      headerRight: () => (
        <HeaderRight onPress={null}>
          <Image source={{uri: "https://randomuser.me/api/portraits/men/46.jpg"}} borderRadius={100} style={{width: 32, height: 32}} />
        </HeaderRight>
      )
    })
  }, [navigation, route])

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{paddingVertical: 20}}>
          <View>
            <View style={{paddingHorizontal: 24, paddingVertical: 12}}>
              <P fontWeight={700}>Outlet</P>
            </View>
            <TouchableOpacity>
              <View style={styles.item}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <View style={styles.circle}>
                    <H3 fontWeight={700}>Z</H3>
                  </View>
                  <P style={{marginLeft: 12}}>Zong Han’s Bar</P>
                </View>
                <ChevronRightIcon style={{color: "#9CA3AF"}} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: 48}}>
            <View style={{paddingHorizontal: 24, paddingVertical: 12}}>
              <P fontWeight={700}>Team Members</P>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(true)}>
              <View style={StyleSheet.flatten([styles.item, {borderBottomWidth: 0}])}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <View style={StyleSheet.flatten([styles.smallCircle, {backgroundColor: color.primary}])}>
                    <AccountPlusIcon color={"#fff"} />
                  </View>
                  <P fontWeight={600} style={{marginLeft: 12, color: color.primary}}>Add team member</P>
                </View>
                <ChevronRightIcon style={{color: "#9CA3AF"}} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.item}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <View style={styles.smallCircle}>
                    <P fontWeight={700}>Z</P>
                  </View>
                  <View>
                    <P style={{marginLeft: 12}}>You</P>
                    <H4 style={{marginLeft: 12, color: "rgba(75, 85, 99, 1)"}}>Admin</H4>
                  </View>
                </View>
                <ChevronRightIcon style={{color: "#9CA3AF"}} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <AddTeamBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
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
  smallCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "rgba(217, 217, 217, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
})
