import React, {useEffect, useContext, useState, useLayoutEffect, useRef} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, SafeAreaView, Text, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import HeaderLeft from "components/HeaderLeft"
import every from "lodash/every"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import {verifyOtp} from "services/user"

export default function OTP({navigation, route}) {
  const { otpToken } = route.params

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

  const [activeInput, setActiveInput] = useState(0)
  const [isBackspace, setIsBackspace] = useState(false)
  const [optNumbers, setOptNumbers] = useState(Array(6).fill(''))

  useEffect(() => {
    if (every(optNumbers, member => member.length > 0)) {
      onSave(optNumbers)
    }
  }, [optNumbers])

  function onChangeText(index, value) {
    const _opt = [...optNumbers]
    _opt[index] = value
    setOptNumbers(_opt)
    if (isBackspace) {
      if (index === 0) {
        setActiveInput(0)
      } else {
        setActiveInput(index - 1)
      }
    } else {
      if (index >= 5) {
        setActiveInput(5)
      } else {
        setActiveInput(index + 1)
      }
    }
  }

  function onKeyPress(index, {nativeEvent}) {
    if (nativeEvent.key === 'Backspace') {
      setIsBackspace(true)
    } else {
      setIsBackspace(false)
    }
  }

  async function onSave(values) {
    try {
      const {data:{token, refreshToken}} = await verifyOtp({
        otpCode: values.join(""), 
        otpToken: otpToken
      })
      if (token && refreshToken) {
        navigation.navigate("Proceed")
      }
    } catch (error) {
      console.warn(error.message)
    }
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 24}}>
        <View style={{paddingVertical: 92}}>
          <Text style={{fontSize: 16, fontWeight: 700, textAlign: "center"}}>We just texted you a code to +6* **** **78 .  Enter the OTP to log in.</Text>
        </View>
        <View style={styles.content}>
          {optNumbers.map((item, index) => {
            return (
              <InputNumber key={index} index={index} 
                value={item} focus={activeInput === index} 
                onChangeText={onChangeText} onKeyPress={onKeyPress}
              />
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

function InputNumber({index, value, focus, onChangeText, onKeyPress}) {
  const inputRef = useRef()

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus) {
        inputRef.current.focus()
      }
    }
}, [focus])

  return (
    <TextInput 
      ref={inputRef}
      style={styles.input}
      value={value} 
      keyboardType="number-pad" 
      maxLength={1} 
      onChangeText={onChangeText.bind(this, index)}
      onKeyPress={onKeyPress.bind(this, index)}
      selectTextOnFocus
    />
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  input: {
    height: 48,
    borderWidth: 1,
    backgroundColor: "rgba(250, 250, 250, 1)",
    borderColor: "rgba(238, 238, 238, 1)",
    borderRadius: 12,
    marginHorizontal: 4,
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    textAlign: "center"
  }
})