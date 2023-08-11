import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import PhonePicker from 'components/ui/PhonePicker';
import TrashIcon from 'assets/images/trash.svg';
import AddIcon from 'assets/images/plus-circle.svg';
import Text from 'components/Text';
import colors from 'configs/colors';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useMutation, {MutationProps} from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
const WHATSAPP = 'Whatsapp';
const EMAIL = 'Email';
const BOTH = 'BOTH';

const options = [
  {
    id: WHATSAPP,
    label: 'Whatsapp',
  },
  {
    id: EMAIL,
    label: 'Email',
  },
  {
    id: BOTH,
    label: 'Both',
  },
];

export default function AddSupplierContact({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    orderCreationMethod: null,
    name: '',
    phoneCode: '',
    phoneNumber: '',
    keyItem: new Date().getTime(),
    emails: [''],
  });

  const {supplierName, isCustomerPurchased, linkedAccountNumber} =
    route?.params || {};

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

  const {name, orderCreationMethod, phoneCode, phoneNumber, emails} = values;

  const [{loading}, newSupplierContact] = useMutation({
    url: 'suppliers/add-manually',
  });

  async function handleSubmit() {
    const opts = {
      supplierName,
      isCustomerPurchased,
      linkedAccountNumber,
      fullName: name,
      mobileCode: phoneCode,
      mobileNumber: phoneNumber,
      emails,
      orderCreationMethod: orderCreationMethod.toUpperCase(),
    };
    const response = await newSupplierContact(opts);
    const {data, success, error} = response;
    if (!success) {
      Toast.show('Create Supplier Manually Failed', Toast.LONG);
      return null;
    }
    return data.supplier;
  }

  async function handleNext() {
    const supplier = await handleSubmit();
    if (supplier) {
      navigation.navigate('UploadOrderList', {supplier});
    }
  }

  const isDisabled = orderCreationMethod === null;

  function handleChangePhone(codeValue: string, numberValue: string) {
    dispatch({
      code: codeValue,
      number: numberValue,
      render: true,
    });
  }

  function handleDeleteEmail(index: number) {
    const newEmails = [...values.emails];
    newEmails.splice(index, 1);
    dispatch({emails: newEmails, keyItem: new Date().getTime(), render: true});
  }

  function handleAddMoreEmail() {
    dispatch({
      emails: [...emails, ''],
      render: true,
    });
  }

  function handleChangeEmail(index: number, text: string) {
    const newEmails = [...values.emails];
    newEmails[index] = text;
    dispatch({emails: newEmails, render: true});
  }

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <Label>How do you create your orders?</Label>
          <View className="flex-row gap-x-4 mt-3 mb-10">
            {options.map(option => (
              <Button
                key={option.label}
                className="flex-1"
                variant={
                  option.id === orderCreationMethod ? 'primary' : 'secondary'
                }
                onPress={() => dispatch({orderCreationMethod: option.id})}>
                {option.label}
              </Button>
            ))}
          </View>

          <FormGroup>
            <Label>
              {orderCreationMethod === BOTH
                ? 'Name of Representative:'
                : 'Name of person in-charge (optional)'}
            </Label>
            <Input onChangeText={text => dispatch({name: text})} />
          </FormGroup>
          {[WHATSAPP, BOTH].includes(orderCreationMethod) && (
            <FormGroup>
              <Label>Enter phone number</Label>
              <PhonePicker
                code={phoneCode}
                number={phoneNumber}
                onChange={handleChangePhone}
              />
            </FormGroup>
          )}

          {[EMAIL, BOTH].includes(orderCreationMethod) && (
            <View>
              <FormGroup>
                <Label>Enter email address</Label>
                <View className="gap-y-4">
                  {emails.map((email: string, index: number) => (
                    <View
                      key={`${values.keyItem}-${index}`}
                      className="flex-row">
                      <Input
                        defaultValue={email}
                        className="flex-1"
                        onChangeText={text => handleChangeEmail(index, text)}
                        // eslint-disable-next-line react/no-unstable-nested-components
                        EndComponent={() =>
                          index === 0 ? (
                            <View />
                          ) : (
                            <TouchableOpacity
                              className="items-center justify-center px-3"
                              onPress={() => handleDeleteEmail(index)}>
                              <TrashIcon color={colors.primary.DEFAULT} />
                            </TouchableOpacity>
                          )
                        }
                      />
                    </View>
                  ))}
                </View>
              </FormGroup>
              <Button variant="outline" onPress={handleAddMoreEmail}>
                <View className="flex-row items-center">
                  <AddIcon color={colors.primary.DEFAULT} />
                  <Text className="text-primary text-16 font-semibold flex-row items-center ml-2">
                    Add More Email
                  </Text>
                </View>
              </Button>
            </View>
          )}
        </ScrollView>

        <Button onPress={handleNext} disabled={isDisabled} className="mt-4">
          Next
        </Button>
      </KeyboardAvoidingView>
    </Container>
  );
}
