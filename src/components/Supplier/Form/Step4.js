import React, { useState } from 'react'
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import P from 'components/ui/P'
import H4 from 'components/ui/H4'
import color from 'utils/color'
import DocumentTextIcon from "assets/images/document-text.svg"
import LinkIcon from "assets/images/link.svg"
import PlusCircle from "assets/images/plus-circle.svg"

export default function Step4({onNext}) {

  const [type, setType] = useState(null)

  function onChangeType(value) {
    setType(value)
  }

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onChangeType.bind(this, "Photo")}>
            <View style={StyleSheet.flatten([styles.item, type === "Photo" && {borderColor: color.primary}])}>
              <P fontWeight={700}>Send a photo</P>
              <H4 style={{textAlign: "center", marginTop: 8}}>Send us pictures of your invoices or delivery receipts.</H4>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChangeType.bind(this, "Email")}>
            <View style={StyleSheet.flatten([styles.item, type === "Email" && {borderColor: color.primary}])}>
              <P fontWeight={700}>Send an email</P>
              <H4 style={{textAlign: "center", marginTop: 8}}>Attach any digital invoices / delivery receipts (excel, pdf, csv, etc).</H4>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <P fontWeight={500} style={{color: color.primary}}>I will do it later</P>
            </View>
          </TouchableOpacity>

          {!!type && (
            <View style={{borderBottomColor: color.border, borderBottomWidth: 1, paddingTop: 32, borderStyle: "solid"}} />
          )}

          {type === "Photo" && (
            <View style={{marginTop: 32}}>
              <View>
                <P fontWeight={600}>Upload Photo</P>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", height: 120, borderRadius: 20, borderColor: color.border, borderWidth: 1, borderStyle: "dashed", marginTop: 12}}>
                  <PlusCircle color={"rgba(156, 163, 175, 1)"} />
                  <P style={{color: "rgba(156, 163, 175, 1)"}}>Upload Photo</P>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", marginTop: 12}}>
                  <DocumentTextIcon color={color.primary} />
                  <H4 style={{color: color.primary, marginLeft: 12}}>my-invoice-2023.jpg</H4>
                </View>
              </View>
              <View style={{marginTop: 32}}>
                <P fontWeight={600}>Comment</P>
                <TextInput style={styles.input} placeholder="Your comment" />
              </View>
            </View>
          )}

          {type === "Email" && (
            <View style={{marginTop: 32}}>
              <P fontWeight={600}>Attach any digital invoices / delivery receipts and send to this email:</P>
              <View style={styles.wrapInputLink}>
                <LinkIcon color={"rgba(107, 114, 128, 1)"} />
                <TextInput style={styles.inputLink} placeholder="Your comment" />
                <TouchableOpacity style={styles.copyButton}>
                  <P style={{color: "#fff"}}>Copy</P>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <TouchableOpacity style={StyleSheet.flatten([styles.buttonNext])} onPress={onNext.bind(this, 4)}>
          <P fontWeight={600} style={StyleSheet.flatten([styles.buttonNextText])}>Next</P>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 12,
    marginTop: 12
  },
  item: {
    padding: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: color.border,
    borderRadius: 20,
    marginBottom: 24
  },
  buttonNext: {
    backgroundColor: color.primary,
    borderRadius: 100,
    paddingVertical: 18,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonNextText: {
    color: "#fff"
  },
  wrapInputLink: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderColor: color.border,
    borderWidth: 1,
    paddingLeft: 12,
    marginTop: 12
  },
  inputLink: {
    height: 56,
    paddingHorizontal: 12,
    flex: 1
  },
  copyButton: {
    backgroundColor: "rgba(59, 130, 246, 1)", 
    height: "100%", 
    paddingHorizontal: 24, 
    flexDirection: "row", 
    alignItems: "center", 
    alignContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12
  }
})