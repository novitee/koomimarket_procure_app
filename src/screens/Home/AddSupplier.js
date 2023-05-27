import React, {useEffect, useRef, useState, useLayoutEffect} from 'react'
import {View, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground, SafeAreaView, Platform} from 'react-native'
import {DEFAULT_HEADER_STYLE, PADDING_CONTENT} from "utils/header-style"
import H1 from "components/ui/H1"
import H2 from "components/ui/H2"
import H3 from "components/ui/H3"
import H4 from "components/ui/H4"
import P from "components/ui/P"
import HeaderLeft from "components/HeaderLeft"
import ArrowBackIcon from "assets/images/arrow-back.svg"
import Swiper from 'react-native-swiper'
import Step1 from 'components/Supplier/Form/Step1'
import Step2 from 'components/Supplier/Form/Step2'
import Step3 from 'components/Supplier/Form/Step3'
import Step4 from 'components/Supplier/Form/Step4'
import Step5 from 'components/Supplier/Form/Step5'

function formatHeaderTitle(currentIndex) {
  if (currentIndex === 0) return "Add Supplier Name"
  if (currentIndex === 1) return "Select Option"
  if (currentIndex === 2) return "Select Option"
  if (currentIndex === 3) return "Setup Info"
  if (currentIndex === 4) return "Well Done"
  else return "Add Any Supplier"
}

export default function AddSupplier({navigation, route}) {

  const swipeRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useLayoutEffect(() => {
    navigation.setOptions({
      ...DEFAULT_HEADER_STYLE,
      headerLeft: () => (
        <HeaderLeft onPress={() => navigation.goBack()}>
          <ArrowBackIcon
            style={{}}
          />
        </HeaderLeft>
      ),
      headerTitle: () => (
        <H3 fontWeight={700}>{formatHeaderTitle(currentIndex)}</H3>
      )
    })
  }, [navigation, route, currentIndex])

  function onNext(index) {
    if (!!swipeRef) {
      const currentIndex = swipeRef.current.state.index;
      const offset = index - currentIndex;
      swipeRef.current.scrollBy(offset)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Swiper ref={swipeRef}
        showsButtons={false} loop={false} showsPagination={false} scrollEnabled={false}
        index={currentIndex} onIndexChanged={index => setCurrentIndex(index)}
      >
        <Step1 onNext={onNext} />
        <Step2 onNext={onNext} />
        <Step3 onNext={onNext} />
        <Step4 onNext={onNext} />
        <Step5 onNext={onNext} />
      </Swiper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
})