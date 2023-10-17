import {ScrollView, View, LogBox, Image} from 'react-native';
import React, {useReducer, useState} from 'react';
import {SubTitle} from 'components/Text';
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

export default function BusinessForm({
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
    companyName: initialValues.companyName,
    billingAddress: initialValues.billingAddress,
    billingPostal: initialValues.postalCode,
    unitNo: initialValues.unitNo,
    photo: initialValues.photo,
    mobileTelCode: initialValues.mobileTelCode,
    mobileTelNumber: initialValues.mobileTelNumber,
  });

  const {handlePostalCodeChange} = usePostalCode();

  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const {
    companyName,
    billingPostal,
    billingAddress,
    unitNo,
    photo,
    mobileTelCode,
    mobileTelNumber,
    errors = {},
  } = values;

  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields});
  }

  function handleChangeUnitNo(text: string) {
    onChangeFields({unitNo: text});
  }

  async function handleChangePostalCode(text: string) {
    let address = billingAddress;
    if (text.length >= 6) {
      address = await handlePostalCodeChange(text);
    }
    let changeFields = {
      billingPostal: text,
      billingAddress: address,
      errors: {
        ...errors,
        billingPostal: !text,
        billingAddress: !address,
      },
    } as any;

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

  async function handleSubmit() {
    const validFields = validateInputs({
      ...values.errors,
      companyName: !companyName,
      billingPostal: !billingPostal,
      billingAddress: !billingAddress,
      mobileTelNumber: !mobileTelNumber,
      mobileTelCode: !mobileTelCode,
    });

    if (!validFields) {
      return;
    }
    const params = {
      name: companyName,
      postal: billingPostal,
      billingAddress: billingAddress,
      unitNo: unitNo,
      photo: photo,
      mobileTelCode: mobileTelCode,
      mobileTelNumber: mobileTelNumber,
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
                  <Avatar name={companyName} size={162} />
                )
              ) : null
            }
            onChange={handleChangePhoto}
            editable={editMode}
          />
        </View>

        <FormGroup>
          <Label required>Business Name</Label>
          <Input
            value={companyName}
            onChangeText={text =>
              onChangeFields({
                companyName: text,
                errors: {...errors, companyName: !text},
              })
            }
            className={clsx({
              'border-red-500': errors.companyName,
            })}
            placeholder="E.g. John Doe Cafe"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Business Phone Number</Label>
          <PhonePicker
            containerClassName="rounded-md"
            code={mobileTelCode}
            number={mobileTelNumber}
            onChange={(code: string, number: string) =>
              onChangeFields({
                mobileTelNumber: number,
                mobileTelCode: code,
                errors: {...errors, mobileTelNumber: !number},
              })
            }
            showError={errors.mobileTelNumber || errors.mobileTelCode}
          />
        </FormGroup>
        <FormGroup>
          <Label required>Business Address</Label>
          <Input
            value={billingPostal}
            onChangeText={handleChangePostalCode}
            placeholder="Postal Code"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.billingPostal,
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
      </ScrollView>
      <View className=" pt-4 px-5">
        <Button loading={loading} onPress={handleSubmit}>
          {editMode ? 'Update Business' : 'Create Business'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
