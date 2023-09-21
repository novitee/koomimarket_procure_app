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
import {validateEmail} from 'utils/validate';
import clsx from 'libs/clsx';

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
    linkedAccountNumber: '',
    supplierContactCode: '65',
    supplierContactNumber: '',
    supplierEmail: '',
    openContact: false,
  });

  function reducer(state: any, action: any) {
    let updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {
    openContact,
    supplierContactNumber,
    linkedAccountNumber,
    supplierName,
    supplierEmail,
    supplierContactCode,
    errors = {},
  } = values;

  const [{loading}, newSupplierContact] = useMutation({
    url: 'suppliers/add-manually',
  });

  async function handleNext() {
    if (
      !validateInputs({
        ...values.errors,
        supplierName: !supplierName,
        linkedAccountNumber: !linkedAccountNumber,
        supplierContactNumber: !supplierContactNumber,
        supplierEmail: !supplierEmail || !validateEmail(supplierEmail),
      })
    )
      return;
    const params = {
      supplierName,
      linkedAccountNumber,
      fullName: supplierName,
      mobileCode: supplierContactCode,
      mobileNumber: supplierContactNumber,
      emails: [supplierEmail],
      orderCreationMethod: 'BOTH',
    };

    const response = await newSupplierContact(params);
    const {data, success, error} = response;
    if (!success) {
      Toast.show('Create Supplier Failed', Toast.LONG);
      return;
    }
    navigation.navigate('SupplierTabs');
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
  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function validateInputs(errors: {[key: string]: boolean}) {
    onChangeFields({errors});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
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
                onChangeText={text =>
                  onChangeFields({
                    supplierName: text,
                    errors: {
                      ...errors,
                      supplierName: !text,
                    },
                  })
                }
                className={clsx({
                  'mb-4': true,
                  'border-red-500': errors.supplierName,
                })}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Your Customer Account Number (Optional)</Label>
              <Input
                placeholder="e.g 10245"
                // onChangeText={text => dispatch({linkedAccountNumber: text})}
                onChangeText={text =>
                  onChangeFields({
                    linkedAccountNumber: text,
                    errors: {
                      ...errors,
                      linkedAccountNumber: !text,
                    },
                  })
                }
                className={clsx({
                  'mb-4': true,
                  'border-red-500': errors.linkedAccountNumber,
                })}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Supplier Contact Number</Label>
              <Input
                placeholder="e.g 65 1234 5678"
                defaultValue={supplierContactNumber}
                onChangeText={text =>
                  onChangeFields({
                    supplierContactNumber: text,
                    errors: {
                      ...errors,
                      supplierContactNumber: !text,
                    },
                  })
                }
                className={clsx({
                  'mb-4': true,
                  'border-red-500': errors.supplierContactNumber,
                })}
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
                onChangeText={text =>
                  onChangeFields({
                    supplierEmail: text,
                    errors: {
                      ...errors,
                      supplierEmail: !text || !validateEmail(text),
                    },
                  })
                }
                className={clsx({
                  'mb-4': true,
                  'border-red-500': errors.supplierEmail,
                })}
              />
            </FormGroup>
          </ScrollView>
          <View className="px-5">
            <Button loading={loading} onPress={handleNext}>
              Add Supplier
            </Button>
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
