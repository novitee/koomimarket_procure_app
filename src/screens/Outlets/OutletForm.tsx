import {ScrollView, View, LogBox, Image} from 'react-native';
import React, {useReducer, useState} from 'react';
import {SubTitle} from 'components/Text';
import CheckBox from 'components/CheckBox';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import Toast from 'react-native-simple-toast';
import ImageUpload from 'components/ImageUpload';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';
import Avatar from 'components/Avatar';
import PhonePicker from 'components/ui/PhonePicker';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function OutletForm({
  onSave,
  loading,
  editMode,
  initialValues,
}: {
  onSave?: (params: any) => void;
  loading?: boolean;
  editMode?: boolean;
  initialValues: any;
}) {
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    outletName: initialValues.name,
    billingAddress: initialValues.billingAddress,
    unitNo: initialValues.unitNo,
    deliveryAddress: initialValues.deliveryAddress,
    deliveryPostalCode: initialValues.postal,
    deliveryUnitNo: initialValues.deliveryUnitNo,
    sameAsBillingAddress: initialValues.isSameBillingAddress,
    photo: initialValues.photo,
    billingPostalCode: initialValues.billingPostal,
    mobileCode: initialValues.mobileCode,
    mobileNumber: initialValues.mobileNumber,
  });

  const {handlePostalCodeChange} = usePostalCode();

  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const {
    outletName,
    billingPostalCode,
    billingAddress,
    unitNo,
    deliveryAddress,
    deliveryPostalCode,
    deliveryUnitNo,
    sameAsBillingAddress,
    mobileCode,
    mobileNumber,
    photo,
    errors = {},
  } = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }
  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function handleChangeUnitNo(text: string) {
    if (sameAsBillingAddress) {
      onChangeFields({unitNo: text, deliveryUnitNo: text});
    } else {
      onChangeFields({unitNo: text});
    }
  }

  async function handleChangePostalCode(text: string) {
    let address = billingAddress;
    if (text.length >= 6) {
      address = await handlePostalCodeChange(text);
    }
    let changeFields = {
      billingPostalCode: text,
      billingAddress: address,
      errors: {
        ...errors,
        billingPostalCode: !text,
        billingAddress: !address,
      },
    } as any;

    if (sameAsBillingAddress) {
      changeFields = {
        ...changeFields,
        deliveryPostalCode: text,
        deliveryAddress: address,
        errors: {
          ...errors,
          ...changeFields.errors,
          deliveryPostalCode: !text,
          deliveryAddress: !address,
        },
      };
    }
    onChangeFields(changeFields);
  }

  async function handleChangeDeliveryPostalCode(text: string) {
    const address = await handlePostalCodeChange(text);
    onChangeFields({
      deliveryPostalCode: text,
      deliveryAddress: address,
      errors: {
        ...errors,
        deliveryPostalCode: !text,
        deliveryAddress: !address,
      },
    });
  }

  function handleSetSameAsBillingAddress(value: boolean) {
    let changeFields = {
      sameAsBillingAddress: value,
    } as any;
    if (value) {
      changeFields = {
        ...changeFields,
        deliveryAddress: billingAddress,
        deliveryUnitNo: unitNo,
        deliveryPostalCode: billingPostalCode,
      };
    }
    onChangeFields(changeFields);
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

  function handleChangePhoto(photo: any) {
    if (!photo || !Array.isArray(photo)) return;
    const {uri, signedKey} = photo[0] || {};
    onChangeFields({photo: {url: uri, signedKey}});
  }

  async function handleAddOutlet() {
    const validFields = validateInputs({
      ...values.errors,
      outletName: !outletName,
      postalCode: !billingPostalCode,
      billingAddress: !billingAddress,
      deliveryPostalCode: !deliveryPostalCode,
      deliveryAddress: !deliveryAddress,
      mobileCode: !mobileCode,
      mobileNumber: !mobileNumber,
    });

    if (!validFields) {
      return;
    }

    const params = {
      name: outletName,
      billingPostal: billingPostalCode,
      billingAddress: billingAddress,
      deliveryAddress: deliveryAddress,
      deliveryPostal: deliveryPostalCode,
      postal: deliveryPostalCode,
      isSameBillingAddress: sameAsBillingAddress,
      unitNo: unitNo,
      deliveryUnitNo: deliveryUnitNo,
      photo: photo,
      mobileCode: mobileCode,
      mobileNumber: mobileNumber,
    };

    onSave?.(params);
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView className="flex-1 px-5">
        {!editMode && (
          <SubTitle>This is what suppliers will see your outlet as.</SubTitle>
        )}
        <View className="items-center  mb-8">
          <ImageUpload
            icon={
              editMode ? (
                photo?.url ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: photo.url}}
                  />
                ) : (
                  <Avatar name={outletName} size={162} />
                )
              ) : null
            }
            onChange={handleChangePhoto}
            editable={editMode}
          />
        </View>
        <FormGroup>
          <Label required>Outlet Name</Label>
          <Input
            value={outletName}
            onChangeText={text =>
              onChangeFields({
                outletName: text,
                errors: {...errors, outletName: !text},
              })
            }
            className={clsx({
              'border-red-500': errors.outletName,
            })}
            placeholder="E.g. John Doe Cafe"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Outlet Phone Number</Label>
          <PhonePicker
            containerClassName="rounded-md"
            code={mobileCode}
            number={mobileNumber}
            onChange={(code: string, number: string) =>
              onChangeFields({
                mobileNumber: number,
                mobileCode: code,
                errors: {...errors, mobileNumber: !number},
              })
            }
            showError={errors.mobileNumber || errors.mobileCode}
          />
        </FormGroup>
        <FormGroup>
          <Label required>Billing Address</Label>
          <Input
            value={billingPostalCode}
            onChangeText={handleChangePostalCode}
            placeholder="Postal Code"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.billingPostalCode,
            })}
            keyboardType="numeric"
            editable={!loading}
          />
          <Input
            value={billingAddress}
            placeholder="Billing Address"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.billingAddress,
            })}
            onChangeText={text =>
              onChangeFields({
                billingAddress: text,
                errors: {...errors, billingAddress: !text},
              })
            }
          />
          <Input
            value={unitNo}
            onChangeText={handleChangeUnitNo}
            placeholder="Unit Number"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Delivery Address</Label>
          <CheckBox
            label="Same as billing address"
            containerClassName="my-4"
            defaultValue={sameAsBillingAddress}
            onChange={handleSetSameAsBillingAddress}
          />
          <Input
            value={deliveryPostalCode}
            onChangeText={text => handleChangeDeliveryPostalCode(text)}
            placeholder="Postal Code"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.deliveryPostalCode,
            })}
            keyboardType="numeric"
            editable={!sameAsBillingAddress}
          />
          <Input
            value={deliveryAddress}
            placeholder="Delivery Address"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.deliveryAddress,
            })}
            editable={!sameAsBillingAddress}
            onChangeText={text =>
              onChangeFields({
                deliveryAddress: text,
                errors: {...errors, deliveryAddress: !text},
              })
            }
          />
          <Input
            value={deliveryUnitNo}
            onChangeText={text => onChangeText(text, 'deliveryUnitNo')}
            placeholder="Unit Number"
            editable={!sameAsBillingAddress}
          />
        </FormGroup>
      </ScrollView>
      <View className=" pt-4 px-5">
        <Button loading={loading} onPress={handleAddOutlet}>
          {editMode ? 'Update Outlet' : 'Create Outlet'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
