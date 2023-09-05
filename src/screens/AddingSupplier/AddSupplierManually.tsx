import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useMutation, {MutationProps} from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import SearchIcon from 'assets/images/search_2.svg';
import BottomSheet from 'components/BottomSheet';
import ContactList from 'components/ContactList';
import CloseCircleIcon from 'assets/images/close-circle.svg';

const options = [
  {
    id: false,
    label: 'No',
  },
  {
    id: true,
    label: 'Yes',
  },
];

export default function AddSupplierManuallyScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {supplier} = route?.params || {};
  const [currentState, setCurrentState] = useState(0);

  const [values, dispatch] = useReducer(reducer, {
    render: false,
    supplierName: '',
    accountNumber: '',
    supplierContactNumber: '',
    supplierEmail: '',
    openContact: false,
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {openContact, supplierContactNumber} = values;

  async function handleNext() {
    // const response = await newSupplier({
    //   supplierIds: [supplier.id],
    // });
    // const {data, success, error} = response;
    // if (success) {
    //   navigation.navigate('AddSupplierContact', {supplier: data});
    // } else {
    //   Toast.show(error?.message, Toast.LONG);
    // }
    // navigation.navigate('AddSupplierContact');
  }

  function closeContact() {
    dispatch({openContact: false, render: true});
  }

  function handleSelectContact(contact: any) {
    dispatch({
      supplierContactNumber: contact.phoneNumber,
      openContact: false,
      render: true,
    });
  }

  return (
    <>
      <Container className="px-0">
        <KeyboardAvoidingView className="flex-1">
          <ScrollView className="flex-1 px-5">
            <FormGroup>
              <Label required>Supplier Name</Label>
              <Input
                placeholder="e.g Chicken Factory Supplies Pte Ltd"
                onChangeText={text => dispatch({supplierName: text})}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Your Customer Account Number (Optional)</Label>
              <Input
                placeholder="e.g 10245"
                onChangeText={text => dispatch({accountNumber: text})}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Supplier Contact Number</Label>
              <Input
                placeholder="e.g 65 1234 5678"
                defaultValue={supplierContactNumber}
                onChangeText={text => dispatch({supplierContactNumber: text})}
                // eslint-disable-next-line react/no-unstable-nested-components
                EndComponent={() => (
                  <TouchableOpacity
                    className="items-center justify-center px-3"
                    onPress={() => dispatch({openContact: true, render: true})}>
                    <SearchIcon />
                  </TouchableOpacity>
                )}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Supplier Email</Label>
              <Input
                placeholder="e.g john@mail.com"
                onChangeText={text => dispatch({supplierEmail: text})}
              />
            </FormGroup>
          </ScrollView>
          <View className="px-5">
            <Button onPress={handleNext}>Add Supplier</Button>
          </View>
        </KeyboardAvoidingView>
      </Container>
      <BottomSheet
        isOpen={openContact}
        onClose={closeContact}
        contentHeight={550}>
        <TouchableOpacity
          className="absolute right-2 top-2 z-50"
          onPress={closeContact}>
          <CloseCircleIcon width={24} height={24} />
        </TouchableOpacity>
        <View className="flex-1 px-5 pt-7 pb-10">
          <ContactList onSelect={handleSelectContact} />
        </View>
      </BottomSheet>
    </>
  );
}
