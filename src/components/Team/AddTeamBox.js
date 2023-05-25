import React from 'react'
import Modal from "react-native-modal"
import P from 'components/ui/P'
import H3 from 'components/ui/H3'
import H4 from 'components/ui/H4'
import CloseCircleIcon from "assets/images/close-circle.svg"
import UserIcon from "assets/images/user.svg"
import { StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import color from 'utils/color'

const HEADER_HEIGHT = 56

export default function AddTeamBox({isOpen, onClose}) {
  return (
    <Modal
      testID={'modal'}
      isVisible={isOpen}
      onSwipeComplete={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center", position: "relative", width: "100%", marginBottom: 20}}>
          <P fontWeight={600}>Add team member</P>
          <TouchableOpacity style={{position: "absolute", right: 0}} onPress={onClose}>
            <CloseCircleIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputWrap}>
          <TextInput style={styles.searchInput} placeholder="Search ..." 
          />
        </View>
        <ScrollView style={{flex: 1}} contentContainerStyle={{paddingVertical: 12}} showsVerticalScrollIndicator={false}>
          {[...Array(2)].map((item, index) => {
            return (
              <View style={{marginTop: 24}}>
                <View style={{borderBottomColor: color.border, borderBottomWidth: 1, paddingBottom: 10}}>
                  <P fontWeight={700}>Contacts On Choco</P>
                </View>
                {[...Array(4)].map((item, index) => {
                  return (
                    <View style={styles.item}>
                      <View style={styles.circle}>
                        <UserIcon color="rgba(156, 163, 175, 1)" width={24} height={24} />
                      </View>
                      <View style={{marginLeft: 12}}>
                        <P fontWeight={600}>Andrew Novitee</P>
                        <H4 style={{marginTop: 6, color: "rgba(75, 85, 99, 1)"}}>+94567890</H4>
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
    height: 56
  },
  searchInputWrap: {
    flexDirection: "row", 
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 36,
    flex: 1
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: HEADER_HEIGHT
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: "rgba(224, 224, 228, 1)",
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24
  }
})
