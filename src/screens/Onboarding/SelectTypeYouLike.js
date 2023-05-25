import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H2 from "components/ui/H2"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import { scale } from 'utils/scale'
import OrderFoodIcon from "assets/images/order-food.svg"
import TeamBuildingIcon from "assets/images/team-building.svg"

const types = [
  {
    icon: <OrderFoodIcon />,
    label: "Create my business on Koomi",
    description: "I want to get set up and start ordering."
  },
  {
    icon: <TeamBuildingIcon />,
    label: "Join my team",
    description: "My team is already ordering on Koomi."
  }
]

export default function SelectTypeYouLike({navigation, route}) {

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
          <H2 fontWeight={700}>What would you like to do?</H2>
          <P fontWeight={300} style={{paddingTop: 12}}>Create your business on Koomi or join an existing team that’s already set up.</P>
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