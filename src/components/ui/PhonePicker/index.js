import React, {useState, useEffect} from 'react'
import Modal from "react-native-modal"
import {View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, useWindowDimensions} from "react-native"
import countries from '../../../utils/country'
import useDebounce from "../../../hooks/useDebounce"

const getFlagEmoji = countryCode => String.fromCodePoint(...[...countryCode.toUpperCase()].map(x=>0x1f1a5+x.charCodeAt(0)))

const HEADER_HEIGHT = 56

export default function PhonePicker({code, number, onChange}) {

  const [isVisible, setIsVisible] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [onSearchChange] = useDebounce(handleSearch, 300)

  useEffect(() => {
    if (!!code) {
      const currentCountry = countries.find(item => item.phone_code.toString() === code.toString())
      if (currentCountry && currentCountry.name) {
        setSelectedCountry(currentCountry)
      }
    }
    if (!!phoneNumber) setPhoneNumber(number)
  }, [code, number])

  function handleSearch(value) {
    setSearch(value)
  }

  function onOpen() {
    setIsVisible(true)
  }

  function onClose() {
    setIsVisible(false)
  }

  function onSelect(item) {
    if (!item) return
    setSelectedCountry(item)
    setPhoneNumber("")
    if (typeof onChange === "function") {
      onChange(item.phone_code, number)
    }
    setIsVisible(false)
  }

  function onChangePhoneNumber(value) {
    setPhoneNumber(value)
    if (typeof onChange === "function") {
      onChange(selectedCountry.phone_code, value)
    }
  }
  
  function renderItem({item}) {
    const isSelected = item.name == (selectedCountry && selectedCountry.name)
    return (
      <TouchableOpacity 
        style={StyleSheet.flatten([{flexDirection: "row", alignItems: "center", flexWrap: "wrap", paddingVertical: 2}])}
        onPress={onSelect.bind(this, item)}
        disabled={isSelected}
      >
        <Text style={{fontSize: 32}}>{getFlagEmoji(item.code)}</Text>
        <Text style={StyleSheet.flatten([{fontSize: 18, fontWeight: 500, marginLeft: 6}, isSelected && {color: "#0369a1"}])}>{item.name}</Text> 
        <Text style={StyleSheet.flatten([{fontSize: 18, fontWeight: 500, marginLeft: 6}, isSelected && {color: "#0369a1"}])}>(+{item.phone_code})</Text> 
      </TouchableOpacity>
    )
  }

  const isError = !phoneNumber

  const listing = search && countries.filter(country => (
    country.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
    country.phone_code.toString().indexOf(search.toLowerCase()) > -1
  )) || countries

  return (
    <>
      <View style={StyleSheet.flatten([styles.container, {borderColor: !!isError ? "#D80D1D" : "#ddd"}])}>
        <TouchableOpacity style={styles.dropdownButton} onPress={onOpen}>
          <Text style={{fontSize: 32}}>{getFlagEmoji(selectedCountry && selectedCountry.code || "sg")}</Text>
          <Text style={{fontSize: 18, fontWeight: 500}}>+{selectedCountry && selectedCountry.phone_code || 65}</Text> 
          <Text style={{fontSize: 12, marginLeft: 2}}>▼</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} 
          keyboardType="number-pad" placeholder='Enter your phone number...' 
          value={phoneNumber || ""}
          onChangeText={onChangePhoneNumber}
        />
      </View>
      <Modal
        testID={'modal'}
        isVisible={isVisible}
        onSwipeComplete={onClose}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center", position: "relative", width: "100%", marginBottom: 20}}>
            <Text style={{fontSize: 18, fontWeight: 600}}>Select Country</Text>
            <TouchableOpacity style={{position: "absolute", right: 0}} onPress={onClose}>
              <Text style={{fontSize: 22}}>✗</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchInputWrap}>
            <TextInput style={styles.searchInput} defaultValue={search} placeholder="Search country ..." 
              onChangeText={value => onSearchChange(value)}
            />
            <Text style={{}}>🔍</Text>
          </View>
          <FlatList
            data={listing}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: "#fff",
            }}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.name.toString()}
            numColumns={1}
          />
        </View>
      </Modal>
    </>
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
  }
})