import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React, {useReducer} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import ImageUpload from 'components/ImageUpload';
import Input from 'components/Input';
import PhonePicker from 'components/ui/PhonePicker';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import Label from 'components/Form/Label';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import TrashIcon from 'assets/images/trash.svg';
import AddIcon from 'assets/images/plus-circle.svg';

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

const WHATSAPP = 'Whatsapp';
const EMAIL = 'Email';
const BOTH = 'BOTH';

const contactOptions = [
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
export default function EditSupplierDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {supplier} = route.params || {};
  const {channelMembers} = supplier || {};

  const supplierChannelMember = channelMembers.find(
    (channelMember: any) => channelMember.objectType === 'SUPPLIER',
  );

  const {user} = supplierChannelMember || {};

  const isAddedFromNonExisting = true;

  const [values, dispatch] = useReducer(reducer, {
    name: supplier.name,
    supplierEmail: user?.email,
    mobileNumber: user?.mobileNumber,
    mobileCode: user?.mobileCode,
    isCustomerPurchased: false,
    customerAccountNumber: '',
    orderCreationMethod: null,
    userMobileCode: '',
    userMobileNumber: '',
    keyItem: new Date().getTime(),
    emails: [''],
    errors: {},
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {
    name,
    supplierEmail,
    mobileCode,
    mobileNumber,
    photo,
    isCustomerPurchased,
    customerAccountNumber,
    orderCreationMethod,
    userMobileCode,
    userMobileNumber,
    errors,
    emails,
  } = values;

  function handleChangePhoto(asset: any) {
    if (!asset || !Array.isArray(asset)) {
      return;
    }
    const {uri, signedKey} = asset[0] || {};
    onChangeFields({photo: {url: uri, signedKey}});
  }

  function onChangeFields(fields: {[key: string]: any}) {
    dispatch({...fields});
  }

  function handleDeleteEmail(index: number) {
    const newEmails = [...values.emails];
    newEmails.splice(index, 1);
    dispatch({emails: newEmails, keyItem: new Date().getTime()});
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
    dispatch({emails: newEmails});
  }

  function handleChangePhone(codeValue: string, numberValue: string) {
    dispatch({
      userMobileCode: codeValue,
      userMobileNumber: numberValue,
    });
  }

  const isDisabled =
    !orderCreationMethod ||
    !name ||
    (orderCreationMethod === WHATSAPP && !userMobileNumber) ||
    (orderCreationMethod === EMAIL && !emails[0]) ||
    (orderCreationMethod === BOTH && (!userMobileNumber || !emails[0]));

  async function handleSave() {
    console.log(`values :>>`, values);
  }

  return (
    <Container className="pt-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <View className="items-center mt-2 mb-8">
            <ImageUpload
              icon={
                photo ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: photo.url}}
                  />
                ) : (
                  <UserIcon color={colors.gray['71717A']} />
                )
              }
              onChange={handleChangePhoto}
            />
          </View>

          <Input
            editable={isAddedFromNonExisting}
            defaultValue={name}
            onChangeText={text =>
              onChangeFields({
                name: text,
                errors: {...errors, name: !text},
              })
            }
            error={errors.name}
            placeholder="Supplier Name"
            className="mb-5"
          />
          <Input
            editable={isAddedFromNonExisting}
            defaultValue={supplierEmail}
            onChangeText={text =>
              onChangeFields({
                email: text,
                errors: {...errors, email: !text},
              })
            }
            error={errors.email}
            placeholder="Email"
            className="mb-5"
          />
          <PhonePicker
            editable={isAddedFromNonExisting}
            code={mobileCode}
            number={mobileNumber}
            onChange={(code: string, number: string) =>
              onChangeFields({
                mobileCode: code,
                mobileNumber: number,
                errors: {...errors, mobileNumber: !number},
              })
            }
          />
          <FormGroup className="mt-10">
            <Label>Are you currently a customer with {supplier?.name}?</Label>
            <View className="flex-row gap-x-4 ">
              {options.map(option => (
                <Button
                  key={option.label}
                  className="flex-1"
                  variant={
                    option.id === isCustomerPurchased ? 'primary' : 'secondary'
                  }
                  onPress={() => dispatch({isCustomerPurchased: option.id})}>
                  {option.label}
                </Button>
              ))}
            </View>
          </FormGroup>

          <FormGroup className="mt-5">
            <Label>Your Customer Account Number (Optional) *</Label>
            <Input
              defaultValue={customerAccountNumber}
              onChangeText={text =>
                onChangeFields({
                  customerAccountNumber: text,
                  errors: {...errors, customerAccountNumber: !text},
                })
              }
              error={errors.customerAccountNumber}
            />
          </FormGroup>

          <FormGroup className="mt-5">
            <Label>How do you create your orders?</Label>
            <View className="flex-row gap-x-4">
              {contactOptions.map(option => (
                <Button
                  key={option.label}
                  className="flex-1 px-0"
                  variant={
                    option.id === orderCreationMethod ? 'primary' : 'secondary'
                  }
                  onPress={() => dispatch({orderCreationMethod: option.id})}>
                  {option.label}
                </Button>
              ))}
            </View>
          </FormGroup>

          {!!orderCreationMethod && (
            <FormGroup className="mt-5">
              <Label>Name of Representative</Label>
              <Input onChangeText={text => dispatch({name: text})} />
            </FormGroup>
          )}
          {[WHATSAPP, BOTH].includes(orderCreationMethod) && (
            <FormGroup className="mt-5">
              <Label>Enter phone number</Label>
              <PhonePicker
                code={userMobileCode}
                number={userMobileNumber}
                onChange={handleChangePhone}
              />
            </FormGroup>
          )}

          {[EMAIL, BOTH].includes(orderCreationMethod) && (
            <View>
              <FormGroup className="mt-5">
                <Label>Enter email address</Label>
                <View className="gap-y-4">
                  {emails.map((email: string, index: number) => (
                    <View
                      key={`${values.keyItem}-${index}`}
                      className="flex-row">
                      <Input
                        defaultValue={email}
                        className="flex-1"
                        keyboardType="email-address"
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
        <Button onPress={handleSave} disabled={isDisabled} className="mt-4">
          Save
        </Button>
      </KeyboardAvoidingView>
    </Container>
  );
}
