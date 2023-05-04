import React, {useEffect, useContext, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, FlatList, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import HeaderRight from "components/HeaderRight"
import KoomiIcon from "assets/images/koomi-logo.svg"
import QuestionIcon from "assets/images/question.svg"
import SettingIcon from "assets/images/setting.svg"
import AddCircleIcon from "assets/images/add-circle.svg"

export default function Home({navigation, route}) {

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={null}>
          <QuestionIcon
            style={{}}
          />
        </HeaderLeft>
      ),
      headerTitle: () => (
        <KoomiIcon width={100} />
      ),
      headerRight: () => (
        <HeaderRight onPress={null}>
          <SettingIcon
            style={{}}
          />
        </HeaderRight>
      )
    })
  }, [navigation, route])

  function renderItem({item}) {
    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={null}
      >
        <Image source={{uri: "https://huyenthoaiviet.vn/file/cafe-ngon-606f.jpg"}} resizeMode="cover" 
          style={{width: 90, height: 90}}
          borderRadius={20}
        />
        <View style={{flexDirection: "column", flex: 1, marginLeft: 20}}>
          <Text style={{fontSize: 18, fontWeight: 700}}>Yishun Outlet</Text>
          <Text style={{fontSize: 14, fontWeight: 300, marginTop: 6}}>167 Wak Hassan Drive Watercove, #03-03</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function onAddOutlet() {
    navigation.navigate("AddOutlet")
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={[...Array(10)]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={{fontSize: 48, fontWeight: 700}}>My Outlets</Text>
          </View>
        }
        ListHeaderComponentStyle={{
          paddingVertical: 24
        }}
        contentContainerStyle={{
          backgroundColor: "#fff",
          paddingHorizontal: 24
        }}
        ListEmptyComponent={
          <View style={{flexDirection: "column", alignItems: "center"}}>
            <Text style={{fontSize: 24, color: "rgba(161, 161, 170, 1)"}}>No outlets yet...</Text>
            <Text style={{fontSize: 24, color: "rgba(161, 161, 170, 1)"}}>Tell us about your outlets!</Text>
          </View>
        }
        ItemSeparatorComponent={<View style={{marginVertical: 8}} />}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        ListFooterComponent={
          <TouchableOpacity style={styles.button} onPress={onAddOutlet}>
            <AddCircleIcon />
            <Text style={styles.buttonText}>Add Outlet</Text>
          </TouchableOpacity>
        }
        ListFooterComponentStyle={{
          paddingVertical: 24
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 1)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    backgroundColor: "#FFF",
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#D80D1D"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#D80D1D",
    marginLeft: 10
  }
})
