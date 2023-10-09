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
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';

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
  const {channel} = route.params || {};
  const {supplier} = channel;
  const {manualSupplierId} = supplier;
  const [{loading}, updateSupplier] = useMutation({
    url: `channels/${channel?.id}/supplier`,
  });
  const [values, dispatch] = useReducer(reducer, {
    supplierName: supplier.name,
    supplierEmail: supplier?.email,
    supplierMobileCode: supplier?.mobileTelCode,
    photo: supplier?.photo,
    supplierMobileNumber: supplier?.mobileTelNumber,
    isCustomerPurchased: channel?.isCustomerPurchased,
    linkedAccountNumber: channel?.linkedAccountNumber,
    orderCreationMethod: channel?.orderCreationMethod,
    orderMobileCode: channel?.orderMobileCode,
    orderMobileNumber: channel?.orderMobileNumber,
    orderNameRepresentative: channel?.orderNameRepresentative,
    keyItem: new Date().getTime(),
    emails: channel?.emails || [''],
    errors: {},
  });

  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const {
    supplierName,
    supplierEmail,
    supplierMobileNumber,
    supplierMobileCode,
    photo,
    isCustomerPurchased,
    linkedAccountNumber,
    orderCreationMethod,
    orderMobileCode,
    orderMobileNumber,
    orderNameRepresentative,
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
      orderMobileCode: codeValue,
      orderMobileNumber: numberValue,
    });
  }

  // const isDisabled =
  //   !orderCreationMethod ||
  //   !supplierName ||
  //   (orderCreationMethod === WHATSAPP && !orderMobileNumber) ||
  //   (orderCreationMethod === EMAIL && !emails[0]) ||
  //   (orderCreationMethod === BOTH && (!orderMobileNumber || !emails[0]));

  async function handleSave() {
    const response = await updateSupplier({
      supplierInfo: {
        supplierEmail,
        supplierMobileCode,
        supplierMobileNumber,
        orderCreationMethod,
        orderMobileCode,
        orderMobileNumber,
        emails,
        supplierName,
        isCustomerPurchased,
        linkedAccountNumber,
        orderNameRepresentative,
      },
    });

    const {success, error} = response;
    console.log('response :>> ', response);
    if (success) {
      navigation.goBack();
    } else {
      Toast.show(error?.message, Toast.LONG);
    }
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
              editable={!!manualSupplierId}
            />
          </View>

          <Input
            editable={!!manualSupplierId}
            defaultValue={supplierName}
            onChangeText={text =>
              onChangeFields({
                supplierName: text,
                errors: {...errors, name: !text},
              })
            }
            error={errors.name}
            placeholder="Supplier Name"
            className="mb-5"
          />
          <Input
            editable={!!manualSupplierId}
            defaultValue={supplierEmail}
            onChangeText={text =>
              onChangeFields({
                supplierEmail: text,
                errors: {...errors, supplierEmail: !text},
              })
            }
            error={errors.supplierEmail}
            placeholder="Email"
            className="mb-5"
          />
          <PhonePicker
            editable={!!manualSupplierId}
            code={supplierMobileCode}
            number={supplierMobileNumber}
            onChange={(code: string, number: string) =>
              onChangeFields({
                supplierMobileNumber: number,
                supplierMobileCode: code,
                errors: {...errors, supplierMobileNumber: !number},
              })
            }
          />
          <FormGroup className="mt-10">
            <Label>
              Are you currently a customer with{' '}
              <Text className="text-red-500">{supplier?.name}</Text>?
            </Label>
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
          {!!isCustomerPurchased && (
            <FormGroup className="mt-5">
              <Label>Your Customer Account Number (Optional) *</Label>
              <Input
                defaultValue={linkedAccountNumber}
                onChangeText={text =>
                  onChangeFields({
                    linkedAccountNumber: text,
                    errors: {...errors, linkedAccountNumber: !text},
                  })
                }
                error={errors.linkedAccountNumber}
              />
            </FormGroup>
          )}

          {!!manualSupplierId && (
            <>
              <FormGroup className="mt-5">
                <Label>How do you create your orders?</Label>
                <View className="flex-row gap-x-4">
                  {contactOptions.map(option => (
                    <Button
                      key={option.label}
                      className="flex-1 px-0"
                      variant={
                        option.id === orderCreationMethod
                          ? 'primary'
                          : 'secondary'
                      }
                      onPress={() =>
                        dispatch({orderCreationMethod: option.id})
                      }>
                      {option.label}
                    </Button>
                  ))}
                </View>
              </FormGroup>

              {!!orderCreationMethod && (
                <FormGroup className="mt-5">
                  <Label required>Name of Representative</Label>
                  <Input
                    onChangeText={text =>
                      dispatch({orderNameRepresentative: text})
                    }
                    defaultValue={orderNameRepresentative}
                  />
                </FormGroup>
              )}
              {[WHATSAPP, BOTH].includes(orderCreationMethod) && (
                <FormGroup className="mt-5">
                  <Label required>Enter phone number</Label>
                  <PhonePicker
                    code={orderMobileCode}
                    number={orderMobileNumber}
                    onChange={handleChangePhone}
                  />
                </FormGroup>
              )}

              {[EMAIL, BOTH].includes(orderCreationMethod) && (
                <View>
                  <FormGroup className="mt-5">
                    <Label required>Enter email address</Label>
                    <View className="gap-y-4">
                      {emails.map((email: string, index: number) => (
                        <View
                          key={`${values.keyItem}-${index}`}
                          className="flex-row">
                          <Input
                            defaultValue={email}
                            className="flex-1"
                            keyboardType="email-address"
                            onChangeText={text =>
                              handleChangeEmail(index, text)
                            }
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
            </>
          )}
        </ScrollView>
        <Button
          loading={loading}
          onPress={handleSave}
          disabled={false}
          className="mt-4">
          Save
        </Button>
      </KeyboardAvoidingView>
    </Container>
  );
}
